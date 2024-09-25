import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; 
import fs from 'fs';


// Function to create a PDF from tailored resume data
const createPDF = async (resumeData) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter size
  
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
    const lineHeight = 14;  
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
          const wordWidth = font.widthOfTextAtSize(word + ' ');
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
  
    // --- Name ---
    drawText(resumeData.name, margin, 18, fonts.name, colors.black);
    y -= lineHeight; // Extra space below name
  
    // --- Contact Information ---
    const contactInfo = `${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.contact.location}`;
    drawText(contactInfo, margin, 10, fonts.body, colors.black); 
    y -= sectionSpacing * 2;
  
    // --- Summary ---
    drawText('Summary', margin, 12, fonts.heading, colors.darkGray);
    drawText(resumeData.summary, margin, 10, fonts.body, colors.black); 
    y -= sectionSpacing;
  
    // --- Experience ---
    drawText('Experience', margin, 12, fonts.heading, colors.darkGray);
    resumeData.experience.forEach(exp => {
      drawText(`${exp.position} at ${exp.company}`, margin, 10, fonts.body, colors.black);
      drawText(exp.dates, margin, 10, fonts.body, colors.darkGray);
      exp.responsibilities.forEach(res => drawText(`• ${res}`, margin, 10, fonts.body, colors.black));
      y -= sectionSpacing;
    });
  
    // --- Education ---
    drawText('Education', margin, 12, fonts.heading, colors.darkGray);
    resumeData.education.forEach(edu => {
      drawText(`${edu.degree}, ${edu.institution}`, margin, 10, fonts.body, colors.black);
      drawText(edu.dates, margin, 10, fonts.body, colors.darkGray);
      y -= sectionSpacing;
    });
  
    // --- Skills ---
    drawText('Skills', margin, 12, fonts.heading, colors.darkGray);
    const skillsList = Object.entries(resumeData.skills).flatMap(([category, skills]) => `${category}: ${skills.join(', ')}`);
    skillsList.forEach(skill => drawText(skill, margin, 10, fonts.body, colors.black));
    y -= sectionSpacing;
  
    // --- Projects ---
    drawText('Projects', margin, 12, fonts.heading, colors.darkGray);
    resumeData.projects.forEach(project => {
      drawText(`${project.title} - ${project.description}`, margin, 10, fonts.body, colors.black);
      project.achievements.forEach(ach => drawText(`• ${ach}`, margin, 10, fonts.body, colors.black));
      y -= sectionSpacing;
    });
  
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

// --- Example usage ---
const sampleResumeText = `json
{
  "name": "Raghothama Rao Pranesha",
  "contact": {
    "email": "raghothama.raop@gmail.com",
    "phone": "+19452091822",
    "location": "Dallas, Texas, United States, 75248",
    "linkedin": "Raghothama",
    "portfolio": "Portfolio"
  },
  "summary": "Experienced Software Engineer specializing in automation, testing, DevOps, IT security, and full-stack development. Proficient in Python, scripting, React, Next.js, Node.js, AI models, NLP and LLMs, AWS, Databases, data structures and algorithms, distributed systems and knowledgeable in Kubernetes and Docker, with a passion for creating impactful solutions. Adept at solving complex problems, implementing clear and maintainable solutions, and driving innovation in dynamic environments.",
  "experience": [
    {
      "company": "Itron",
      "position": "DevOps Engineer Intern – TechOps Automate",
      "location": null,
      "dates": "Sep 2023 - May 2024",
      "responsibilities": [
        "Engineered Ansible automation PaaS, leveraging Infrastructure as Code and reducing task completion time by 70%.",
        "Automated end-to-end customer operations with shell scripts, cutting manual task time from 16 hours to 3 hours.",
        "Architected and implemented a secure backend database in MySQL, reducing query response time by 40%.",
        "Developed a full stack application utilizing React.JS, Next.JS, Typescript and Node.JS to elevate user experience.",
        "Created custom API endpoints, integrated with RabbitMQ and employed proxies throughout backend processing, boosting security and data integrity and deployed containerized builds on to servers using Docker."
      ]
    },
    {
      "company": "Forcepoint",
      "position": "IT Intern - Business Applications",
      "location": null,
      "dates": "Jun 2023 - Aug 2023",
      "responsibilities": [
        "Collaborated cross-functionally to automate payment processing using Salesforce integrated with Boomi, reducing weekly manual work by 12 hours.",       
        "Rectified a system loophole in company code application post-order completion, using Boomi to save 4 hours weekly.",
        "Improved Salesforce transaction-level dates on invoices and credit notes across various time zones for enhanced accuracy."
      ]
    },
    {
      "company": "Mphasis Ltd, India",
      "position": "Software Engineer",
      "location": null,
      "dates": "Jul 2021-Jun 2022",
      "responsibilities": [
        "Enhanced testing efficiency by 94% with automated testing using TestRail, Python Robot Framework, and Selenium, ensuring comprehensive test coverage and Agile management.",
        "Integrated Jenkins with Jira and TestRail, reducing manual tasks by 32 hours weekly and boosting team productivity.",
        "Reduced backlogs by 48% through developing automated performance dashboards with Python, Jira, TestRail, and SQL on Jenkins via GitHub, providing real-time, data-driven insights.",
        "Automated UI operations with computer vision, eliminating manual tasks and improving team efficiency by 4%.",
        "Engineered ETL processes and automated hourly updating dashboards, integrating with Jenkins for CI/CD, aiding in backlog analysis and decision-making." 
      ]
    }
  ],
  "education": [
    {
      "institution": "University of Texas at Dallas",
      "degree": "MS, Information Technology and Management (STEM)",
      "location": null,
      "dates": "Aug 2022 - May 2024",
      "gpa": "3.88",
      "relatedCourses": [
        "Object Oriented Programming in Python",
        "Database Foundations (SQL & MongoDB)",
        "Intelligent Enterprise Systems with SAP",
        "Big Data",
        "Advanced statistics for Data Science",
        "Cybersecurity Fundamentals"
      ]
    }
  ],
  "skills": {
    "languages": [
      "Python",
      "SQL",
      "Java",
      "Git"
    ],
    "webTechnology": [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Node.js",
      "REST-API",
      "Containerization"
    ],
    "frameworksTools": [
      "RobotFramework",
      "Ansible",
      "Spark",
      "Docker",
      "Hadoop",
      "Kubernetes",
      "Tableau",
      "TensorFlow",
      "RabbitMQ",
      "UNIX Shell Scripting"
    ],
    "databases": [
      "MySQL",
      "MS SQL",
      "MongoDB"
    ],
    "certifications": [
      "Python",
      "SQL",
      "Data Science Foundation",
      "Cybersecurity Essentials",
      "DevOps Foundations",
      "Google-Generative AI"
    ]
  },
  "projects": [
    {
      "title": "Tailoresume",
      "description": "AWS+Gemini application to tailor resumes based on Job description",
      "dates": "Jul 2024 - Present",
      "achievements": [
        "Developed, an AI-driven application using GeminiAPI, Google AI, and AWS to dynamically tailor resumes, increasing efficiency by 50% and reducing manual editing time by 70%.",
        "Designed a user-friendly frontend interface saving an overall 70% of time in application."
      ]
    },
    {
      "title": "AutoPlat",
      "description": "SaaS Automation Builder",
      "dates": "Apr 2024 - May 2024",
      "achievements": [
        "Developed AutoPlat, a SaaS application for workflow automation, using Node.js, Next.js, TypeScript, and more, featuring a drag-and-drop interface and integration with platforms like Discord and Slack.",
        "Implemented a billing system within the app for a subscription-based model. Integrated Stripe to allow users to purchase credits and utilize the platform's workflow automation capabilities"
      ]
    },
    {
      "title": "Smart Vineyard using ML",
      "description": "Enhancing viticulture by implementing Machine Learning",
      "dates": "May 2020 - Jul 2020",
      "achievements": [
        "Spearheaded the development of a highly effective machine learning model for viticulture optimization using Convolutional Neural Network (CNN) algorithm and Python, involving preprocessing and analysis of large datasets.",
        "Achieved an 87.76% efficiency rate in predicting and optimizing viticulture parameters during simulation."
      ]
    }
  ]
    }
  

`
const jsonString = sampleResumeText.replace("json", '').trim();
const resumeData = JSON.parse(jsonString);
console.log("resume data is : ",resumeData)
createPDF(resumeData)
  .then((pdfBytes) => {
    // Write the PDF to a file
    fs.writeFileSync('tailored_resume.pdf', pdfBytes); 
    console.log('PDF resume created successfully!');
  })
  .catch((error) => {
    console.error('Error creating PDF:', error);
  });
