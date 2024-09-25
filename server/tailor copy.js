import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';  // Import pdf-lib
import Chat from './models/chat.js';
import tailorResume from './routes/gemini.js';

// Function to create a PDF from tailored resume text
// --- Function to create a PDF from tailored resume text ---

const createPDF = async (resumeText) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter with 0.5" margins (in points)

  const fonts = {
    heading: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    name: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    body: await pdfDoc.embedFont(StandardFonts.Helvetica), 
  };

  const colors = {
    black: rgb(0, 0, 0),
    darkGray: rgb(0.3, 0.3, 0.3)
  };

  const margin = 36; 
  let y = 792 - margin; 
  const lineHeight = 14;  // Adjusted for more compact layout
  const sectionSpacing = 6;
  const maxLineLength = 612 - (2 * margin); 

  const drawText = (text, x, fontSize, font, color) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    if (textWidth <= maxLineLength) {
      page.drawText(text, { x, y, size: fontSize, font, color });
      y -= lineHeight;
    } else {
      const words = text.split(' ');
      let currentLine = '';
      let currentLineWidth = 0;

      for (const word of words) {
        const wordWidth = font.widthOfTextAtSize(word + ' ', fontSize); 
        if (currentLineWidth + wordWidth <= maxLineLength) {
          currentLine += word + ' ';
          currentLineWidth += wordWidth;
        } else {
          page.drawText(currentLine, { x, y, size: fontSize, font, color });
          y -= lineHeight;
          currentLine = word + ' ';
          currentLineWidth = wordWidth;
        }
      }
      page.drawText(currentLine, { x, y, size: fontSize, font, color });
      y -= lineHeight; 
    }
  };

  const lines = resumeText.split('\n');

  // --- Name ---
  drawText(lines[0], margin, 18, fonts.name, colors.black);
  y -= lineHeight; // Extra space below name

  // --- Contact Information --- 
  drawText(lines[1], margin, 10, fonts.body, colors.black); 
  y -= sectionSpacing * 2; // More space before the Summary

  // ---  The rest of the sections (Summary, Education, etc.) ---
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      y -= sectionSpacing;
      drawText(line.substring(3), margin, 12, fonts.heading, colors.darkGray);
    } else if (line.startsWith('• ')) {
      drawText(line.substring(2), margin + 15, 10, fonts.body, colors.black); 
    } else { 
      drawText(line, margin, 10, fonts.body, colors.black);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

// Helper function for processing resume tailoring
export const processTailorRequest = async (req, res) => {
  const jobDescription = req.body.jobDescription;
  const resumeFilePath = req.file?.path;  // Add optional chaining in case req.file is missing

  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Call Gemini API to tailor the resume
    const tailoredResumeText = await tailorResume(resumeFilePath, jobDescription);

    console.log("Tailored Resume Text:", tailoredResumeText);

    // Generate a PDF from the tailored resume text
    const tailoredResumePdf = await createPDF(tailoredResumeText);

    // Save tailored resume and job description to MongoDB
    const newChat = new Chat({
      originalResume: req.file.filename,
      tailoredResume: tailoredResumeText,
      jobDescription,
      fileUri: resumeFilePath,
    });

    await newChat.save();

    // Send tailored resume PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(tailoredResumePdf));  // Send the PDF as a response

  } catch (error) {
    console.error("Error processing resume:", error.message);
    res.status(500).json({ message: 'Error tailoring resume', error: error.message, stack: error.stack });
  }
};

// Export the multer upload middleware for use in the route
import multer from 'multer';
export const upload = multer({ dest: 'uploads/' });
