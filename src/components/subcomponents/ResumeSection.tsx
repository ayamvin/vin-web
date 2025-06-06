import React, { useState, useRef } from 'react';
import { FaDownload, FaEye, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../../styles/ResumeSection.css';
import resumeFile from '../../assets/pdf/resumeManalang.pdf';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = 'Manalang_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoadError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF loading error:', error);
    setPdfLoadError('Failed to load PDF file. Please try downloading instead.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { text: inputMessage, sender: 'user' as const }];
    setMessages(newMessages);
    setInputMessage('');

    setTimeout(() => {
      setMessages([...newMessages, { 
        text: getBotResponse(inputMessage), 
        sender: 'bot' as const 
      }]);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 1000);
  };

  const getBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('experience') || lowerQuestion.includes('work')) {
      return "The candidate has 5 years of experience in web development, with expertise in React, TypeScript, and Node.js. They've worked at several tech companies leading frontend development teams.";
    } else if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology')) {
      return "Key skills include: React, TypeScript, JavaScript, Node.js, HTML/CSS, Python, and cloud technologies like AWS. They're also proficient in UI/UX design principles.";
    } else if (lowerQuestion.includes('education') || lowerQuestion.includes('degree')) {
      return "The candidate holds a Bachelor's degree in Computer Science from a reputable university, graduating with honors.";
    } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('email')) {
      return "You can contact the candidate via email at example@email.com or through their LinkedIn profile.";
    } else {
      return "I can provide information about the candidate's experience, skills, education, and contact details. Please ask about any of these aspects of their resume.";
    }
  };

  return (
    <section id="resume" className="resume-section">
      <div className="section-header">
        <h2 className="section-title">My Resume</h2>
        <p className="section-subtitle">Professional background and experience</p>
      </div>
      
      <div className="resume-container">
        <div className="resume-preview-container">
          <div className="resume-preview">
            <Document
              file={resumeFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="pdf-loading">Loading resume preview...</div>}
              error={<div className="pdf-error">{pdfLoadError || 'Failed to load resume PDF.'}</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                width={300}
                height={400}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="pdf-loading">Loading page...</div>}
              />
            </Document>
          </div>
          
          <div className="resume-page-controls">
            <button 
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span>Page {pageNumber} of {numPages || '--'}</span>
            <button 
              disabled={!!numPages && pageNumber >= numPages}
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev + 1))}
            >
              Next
            </button>
          </div>
          
          <div className="resume-actions">
            <button onClick={handleDownload} className="resume-button">
              <FaDownload className="button-icon" /> Download PDF
            </button>
            <button onClick={toggleModal} className="resume-button">
              <FaEye className="button-icon" /> View Full Resume
            </button>
          </div>
        </div>
        
        <div className="resume-chatbot">
          <h3>Resume Assistant</h3>
          <p>Ask about my skills, experience, or qualifications:</p>
          
          <div className="chat-container" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="chat-placeholder">
                <p>Example questions:</p>
                <ul>
                  <li>What are your main skills?</li>
                  <li>Tell me about your work experience</li>
                  <li>What education do you have?</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.sender}`}>
                  {message.text}
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about my resume..."
            />
            <button type="submit" disabled={!inputMessage.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
      
      {showModal && (
        <div className="resume-modal">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              <FaTimes />
            </button>
            <div className="modal-pdf-container">
              {pdfLoadError ? (
                <div className="pdf-error-modal">
                  {pdfLoadError}
                  <button onClick={handleDownload} className="download-fallback">
                    <FaDownload /> Download Resume Instead
                  </button>
                </div>
              ) : (
                <Document
                  file={resumeFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={<div className="pdf-loading-modal">Loading full resume...</div>}
                  error={<div className="pdf-error-modal">{pdfLoadError || 'Failed to load resume PDF.'}</div>}
                >
                  {Array.from(new Array(numPages || 1), (_, index) => (
                    <div key={`page_${index + 1}`} className="modal-page-container">
                      <Page 
                        pageNumber={index + 1}
                        width={800}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={<div className="pdf-loading">Loading page {index + 1}...</div>}
                      />
                    </div>
                  ))}
                </Document>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
// default
export default ResumeSection;