import React, { useState, useRef, useEffect } from 'react';
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
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typingMessage]);

  const typeMessage = (message: string, onComplete: () => void) => {
    let i = 0;
    setTypingMessage('');
    const typingInterval = setInterval(() => {
      if (i < message.length) {
        setTypingMessage(prev => prev + message.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        onComplete();
      }
    }, 20);
  };

  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = resumeFile;
    link.download = 'Manalang_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try {
      const response = await fetch('http://localhost:3001/api/track-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'user-session-id',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error tracking download:', error);
    }
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'example-session-id',
          message: inputMessage,
        }),
      });

      const data = await response.json();

      setTimeout(() => {
        setIsBotTyping(false);
        typeMessage(data.response, () => {
          setMessages(prev => [...prev, { text: data.response, sender: 'bot' as const }]);
          setTypingMessage('');
        });
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsBotTyping(false);
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: 'bot' as const }]);
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
              <>
                {messages.map((message, index) => (
                  <div key={index} className={`chat-message ${message.sender}`}>
                    {message.text}
                  </div>
                ))}
                {isBotTyping && (
                  <div className="chat-message bot">
                    <div className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                {typingMessage && (
                  <div className="chat-message bot">
                    {typingMessage}
                  </div>
                )}
              </>
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

export default ResumeSection;