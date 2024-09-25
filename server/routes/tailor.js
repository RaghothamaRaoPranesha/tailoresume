import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';  // Import pdf-lib
import Chat from '../models/chat.js';
import tailorResume from './gemini.js';

// Function to create a PDF from tailored resume text
// --- Function to create a PDF from tailored resume text ---

const createPDF = async (resumeData) => {
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
    const lineHeight = 16;
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

    // Draw Name
    drawText(resumeData.name, margin, 16, fonts.name, colors.black);
    y -= sectionSpacing;

    // Draw Contact Information
    const contactInfo = `Email: ${resumeData.contact.email} | Phone: ${resumeData.contact.phone} | Location: ${resumeData.contact.location} `;
    drawText(contactInfo, margin, 10, fonts.body, colors.black);
    y -= sectionSpacing;
    // | LinkedIn: ${resumeData.contact.linkedin} | Portfolio: ${resumeData.contact.portfolio}

    // Draw Summary
    drawText("Summary", margin, 12, fonts.heading, colors.darkGray);
    drawText(resumeData.summary, margin, 10, fonts.body, colors.black);
    y -= sectionSpacing;

    // Draw Experience
    drawText("Experience", margin, 12, fonts.heading, colors.darkGray);
    for (const job of resumeData.experience) {
        drawText(`${job.position} | ${job.company} | (${job.dates})`, margin, 10, fonts.heading, colors.black);
        job.responsibilities.forEach(resp => drawText(`• ${resp}`, margin + 10, 10, fonts.body, colors.black));
        y -= sectionSpacing; // Space between jobs
    }
    y -= sectionSpacing

    // Draw Education
    drawText("Education", margin, 12, fonts.heading, colors.darkGray);
    resumeData.education.forEach(edu => {
        drawText(`${edu.degree} from ${edu.institution} (${edu.dates})`, margin, 10, fonts.body, colors.black);
        drawText(`GPA: ${edu.gpa}`, margin, 10, fonts.body, colors.black);
    });
    y -= sectionSpacing

    // Draw Skills
    drawText("Skills", margin, 12, fonts.heading, colors.darkGray);
    const skills = resumeData.skills;
    for (const [category, items] of Object.entries(skills)) {
        drawText(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${items.join(', ')}`, margin, 10, fonts.body, colors.black);
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

  

// Helper function for processing resume tailoring
export const processTailorRequest = async (req, res) => {
  const jobDescription = req.body.jobDescription;
  const resumeFilePath = req.file?.path;

  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Call Gemini API to tailor the resume
    const tailoredResumeResponse = await tailorResume(resumeFilePath, jobDescription);

    // Extract the JSON part from the response
    // const jsonStartIndex = tailoredResumeResponse.indexOf('```json');
    // const jsonString = tailoredResumeResponse.substring(jsonStartIndex + 8).trim();
    const resumeData = JSON.parse(tailoredResumeResponse); // Convert to JSON object

    console.log("Tailored Resume Data:", resumeData);

    // Generate a PDF from the tailored resume data
    const tailoredResumePdf = await createPDF(resumeData);

    // Save tailored resume and job description to MongoDB
    const newChat = new Chat({
      originalResume: req.file.filename,
      tailoredResume: JSON.stringify(resumeData), // Store as string for MongoDB
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
