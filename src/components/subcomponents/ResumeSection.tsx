import React, { useState } from 'react';
import { FaDownload, FaEye, FaTimes } from 'react-icons/fa';
import '../../styles/ResumeSection.css';

const ResumeSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    // In a real app, this would trigger a download
    console.log('Downloading resume...');
    // window.open('/resume.pdf', '_blank');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <section id="resume" className="resume-section">
      <div className="section-header">
        <h2 className="section-title">My Resume</h2>
        <p className="section-subtitle">Professional background and experience</p>
      </div>
      
      <div className="resume-actions">
        <button onClick={handleDownload} className="resume-button">
          <FaDownload className="button-icon" /> Download PDF
        </button>
        <button onClick={toggleModal} className="resume-button">
          <FaEye className="button-icon" /> View Resume
        </button>
      </div>
      
      {showModal && (
        <div className="resume-modal">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              <FaTimes />
            </button>
            <div className="resume-embed">
              {/* In a real app, this would be an iframe or PDF viewer */}
              <h3>Resume Preview</h3>
              <p>This would display your resume in a modal</p>
              {/* <iframe src="/resume.pdf" title="Resume" className="resume-iframe"></iframe> */}
            </div>
          </div>
        </div>
      )}
      
      {/* Optional: AI Chatbot Integration */}
      <div className="resume-chatbot">
        <p>Ask our AI assistant about my skills or experience:</p>
        <button className="chatbot-button">Open Resume Assistant</button>
      </div>
    </section>
  );
};

export default ResumeSection;