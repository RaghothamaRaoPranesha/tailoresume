import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Resume = () => {
  const data = {
    name: "Raghothama Rao Pranesha",
    contact: {
      email: "raghothama.raop@gmail.com",
      phone: "+19452091822",
      location: "Dallas, Texas, United States, 75248",
      linkedin: "Raghothama",
      portfolio: "Portfolio"
    },
    summary: "Experienced Software Engineer specializing in automation, testing, DevOps, IT security, and full-stack development. Proficient in Python, scripting, React, Next.js, Node.js, AI models, NLP and LLMs, AWS, Databases, data structures and algorithms, distributed systems and knowledgeable in Kubernetes and Docker, with a passion for creating impactful solutions. Adept at solving complex problems, implementing clear and maintainable solutions, and driving innovation in dynamic environments.",
    experience: [
      {
        company: "Itron",
        position: "DevOps Engineer Intern – TechOps Automate",
        dates: "Sep 2023 - May 2024",
        responsibilities: [
          "Engineered Ansible automation PaaS, leveraging Infrastructure as Code and reducing task completion time by 70%.",
          "Automated end-to-end customer operations with shell scripts, cutting manual task time from 16 hours to 3 hours.",
          "Architected and implemented a secure backend database in MySQL, reducing query response time by 40%.",
          "Developed a full stack application utilizing React.JS, Next.JS, Typescript and Node.JS to elevate user experience.",
          "Created custom API endpoints, integrated with RabbitMQ and employed proxies throughout backend processing, boosting security and data integrity and deployed containerized builds on to servers using Docker."
        ]
      },
      // Other experience entries...
    ],
    education: [
      {
        institution: "University of Texas at Dallas",
        degree: "MS, Information Technology and Management (STEM)",
        dates: "Aug 2022 - May 2024",
        gpa: "3.88",
        relatedCourses: [
          "Object Oriented Programming in Python",
          "Database Foundations (SQL & MongoDB)",
          // Other courses...
        ]
      }
    ],
    skills: {
      languages: ["Python", "SQL", "Java", "Git"],
      webTechnology: ["HTML", "CSS", "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js"],
      // Other skills...
    },
    projects: [
      {
        title: "Tailoresume",
        description: "AWS+Gemini application to tailor resumes based on Job description",
        dates: "Jul 2024 - Present",
        achievements: [
          "Developed, an AI-driven application using GeminiAPI, Google AI, and AWS to dynamically tailor resumes.",
          // Other achievements...
        ]
      }
    ]
  };

  const generatePDF = () => {
    const input = document.getElementById('resume');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('resume.pdf');
      });
  };

  return (
    <div>
      <div id="resume" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>{data.name}</h1>
        <p>Email: {data.contact.email}</p>
        <p>Phone: {data.contact.phone}</p>
        <p>Location: {data.contact.location}</p>
        <p>LinkedIn: {data.contact.linkedin}</p>
        <p>Portfolio: {data.contact.portfolio}</p>
        <h2>Summary</h2>
        <p>{data.summary}</p>
        <h2>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index}>
            <h3>{exp.position} @ {exp.company}</h3>
            <p>{exp.dates}</p>
            <ul>
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
        <h2>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index}>
            <h3>{edu.degree} @ {edu.institution}</h3>
            <p>{edu.dates} - GPA: {edu.gpa}</p>
            <p>Courses: {edu.relatedCourses.join(', ')}</p>
          </div>
        ))}
        <h2>Skills</h2>
        <p>Languages: {data.skills.languages.join(', ')}</p>
        <p>Web Technologies: {data.skills.webTechnology.join(', ')}</p>
        <h2>Projects</h2>
        {data.projects.map((proj, index) => (
          <div key={index}>
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <p>{proj.dates}</p>
            <ul>
              {proj.achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={generatePDF} style={{ marginTop: '20px' }}>Download Resume as PDF</button>
    </div>
  );
};

export default Resume;
