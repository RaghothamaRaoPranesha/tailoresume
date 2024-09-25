import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Instantiate the Gemini API client with the correct API key
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// Function to tailor the resume
const tailorResume = async (resumeFilePath, jobDescription) => {
  try {
    console.log("Resume file path:", resumeFilePath);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You're an expert resume writer with 30 years of experience. 
    Please Tailor this resume to fit the following job description a 100%: ${jobDescription}. 
    Do not lie about anything. The experience or skills or keywords can be changed realistically according to the job description without lying.
    The response should not have anything other than the tailored resume.
    Generate a tailored resume for the job description, in JSON format. Structure the JSON with the following keys:

- "name": The person's name.
- "contact": The person's contact details (email, phone number, location, LinkedIn, etc.).
- "summary": A brief summary of the person's skills and experience.
- "experience": An array of job experiences, each containing:
  - "company": The company name.
  - "position": The job title.
  - "location": The location of the job.
  - "dates": The start and end dates of the job.
  - "responsibilities": An array of bullet points describing the person's responsibilities.
- "education": An array of education experiences, each containing:
  - "institution": The name of the educational institution.
  - "degree": The degree earned.
  - "location": The location of the institution.
  - "dates": The start and end dates of the education.
  - "gpa": The GPA (optional).
  - "relatedCourses": A list of related courses.
- "skills": A dictionary containing:
  - "languages": A list of programming languages.
  - "webTechnology": A list of web technologies.
  - "frameworksTools": A list of frameworks and tools.
  - "databases": A list of databases.
  - "certifications": A list of certifications.
- "projects": An array of projects, each containing:
  - "title": The project name.
  - "description": A brief description of the project.
  - "dates": The dates during which the project was active.
  - "achievements": An array of achievements related to the project.

Please return only the tailored resume in JSON format following this structure.
No other extra words or characters or headings like json or something. I want the output to contain only the json object.
`;

    const resumeFile = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(resumeFilePath)).toString("base64"),
        mimeType: 'application/pdf',
      },
    };

    const result = await model.generateContent([prompt, resumeFile]);

    console.log("Gemini API result:", result.response.text());

    // Check if the result contains the expected response
    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini API");
    }

    // Return the tailored resume as plain text (for now, until we handle PDFs properly)
    return result.response.text();
  } catch (error) {
    console.error("Error with Gemini API:", error.message);
    throw new Error('Error generating tailored resume');
  }
};

export default tailorResume;
