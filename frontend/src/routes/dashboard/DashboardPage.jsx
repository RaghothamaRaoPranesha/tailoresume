import { useState, useRef, useEffect } from 'react';
import './dashboardPage.css';
// import dotenv from 'dotenv'


const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const endRef = useRef(null);
  const formRef = useRef(null);

  // Handles file upload change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("event:", e);
  };

  // Handles job description change
  const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitted
    setError(null); // Reset any previous errors

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tailor`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error tailoring the resume');
      }

      // Handle PDF response instead of JSON
      const blob = await response.blob();  // Get the PDF as a blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tailored_resume.pdf'; // Download the file
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      setError(error.message); // Display error if any
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set loading to false once the request is complete
    }
  };

  // Scroll to the end when the page loads
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className='dashboard'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <h1>Tailor Resume</h1>
        </div>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="file-upload">
            <label htmlFor="file-input" className='input'>
              <img src="/attachment.png" alt="Upload" className="upload-icon" />
              {file ? file.name : ''}
            </label>
            <input 
              type="file" 
              id="file-input" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleFileChange} 
              hidden 
            />
          </div>
          <textarea
            name="text"
            placeholder='Paste the job description here.'
            value={jobDescription}
            onChange={handleDescriptionChange}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : <img src="/arrow.png" alt="Submit" />}
          </button>
        </form>
      </div>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="endChat" ref={endRef}></div>
    </div>
  );
};

export default DashboardPage;