import React, { useState, useRef, useEffect } from 'react';
import { FaDownload, FaEye, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../../styles/ResumeSection.css';
import resumeFile from '../../assets/pdf/resumeManalang.pdf';
import { supabase } from './supabaseClient.ts';
import { motion, AnimatePresence } from 'framer-motion';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Message {
  content: string;
  sender_type: 'user' | 'bot';
  created_at: string;
}

const ResumeSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sessionId = 'user-session-id'; // In a real app, generate or get this dynamically

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typingMessage]);

  // Fetch conversation history on mount
  useEffect(() => {
    const fetchConversationHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('content, sender_type, created_at')
        .eq('conversation.user_id.session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversation history:', error);
      } else {
        setMessages(data as Message[]);
      }
    };

    fetchConversationHistory();
  }, []);

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
      // Get or create user
      let { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('session_id', sessionId)
        .single();

      if (!user) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({ session_id: sessionId, ip_address: 'unknown', user_agent: navigator.userAgent })
          .select('id')
          .single();
        user = newUser;
      }

      // Track download
      if (user) {
        await supabase
          .from('resume_downloads')
          .insert({
            user_id: user.id,
            ip_address: 'unknown',
            user_agent: navigator.userAgent,
          });
      } else {
        console.error('User not found or creation failed');
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

  const getBotResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    // Check bot_responses table
    const { data: responseData } = await supabase
      .from('bot_responses')
      .select('response_text')
      .contains('trigger_phrases', [lowerMessage])
      .order('trigger_phrases', { ascending: false })
      .limit(1);

    if (responseData && responseData.length > 0) {
      return responseData[0].response_text;
    }

    // Fallback responses
    if (lowerMessage.includes("name") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
      return "Hi I'm Malvin A. Manalang, nice to meet you!";
    } else if (lowerMessage.includes("age")) {
      return "I'm currently in my early 20s.";
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone")) {
      return "You can contact me via email at manalangmalvin@gmail.com or reach me by phone at 0916-299-1409.";
    }

    return "I'm happy to answer questions about my experience, projects, skills, education, or anything else from my resume. Just ask!";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { content: inputMessage, sender_type: 'user' as const, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsBotTyping(true);

    try {
      // Get or create user
      let { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('session_id', sessionId)
        .single();

      if (!user) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({ session_id: sessionId, ip_address: 'unknown', user_agent: navigator.userAgent })
          .select('id')
          .single();
        user = newUser;
      }
      if (!user) {
        console.error('User is null');
        return;
      }

      // Create conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({ user_id: user.id })
        .select('id')
        .single();

      // Save user message
      if (conversation) { 
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            content: inputMessage,
            sender_type: 'user',
          });
      } else {
        console.error('Conversation not created');
      }
      // Get and save bot response
      const botResponse = await getBotResponse(inputMessage);
      
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation!.id,
          content: botResponse,
          sender_type: 'bot',
        });

      setTimeout(() => {
        setIsBotTyping(false);
        typeMessage(botResponse, () => {
          setMessages(prev => [...prev, { content: botResponse, sender_type: 'bot', created_at: new Date().toISOString() }]);
          setTypingMessage('');
        });
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsBotTyping(false);
      setMessages(prev => [...prev, { content: "Sorry, I encountered an error. Please try again.", sender_type: 'bot', created_at: new Date().toISOString() }]);
    }
  };

  return (
    <section id="resume" className="resume-section">
      <div className="section-resume-header">
        <motion.h2 
          className="section-resume-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Resume
        </motion.h2>
        <motion.p 
          className="section-resume-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Professional background and experience
        </motion.p>
      </div>
      
      <div className="resume-container">
        <motion.div 
          className="resume-preview-container"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
            <motion.button 
              onClick={handleDownload} 
              className="resume-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="button-icon" /> Download PDF
            </motion.button>
            <motion.button 
              onClick={toggleModal} 
              className="resume-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye className="button-icon" /> View Full Resume
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="resume-chatbot"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
                  <motion.div 
                    key={index} 
                    className={`chat-message ${message.sender_type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.content}
                  </motion.div>
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
            <motion.button 
              type="submit" 
              disabled={!inputMessage.trim()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPaperPlane />
            </motion.button>
          </form>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="resume-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <motion.button 
                onClick={toggleModal} 
                className="close-button"
                whileHover={{ rotate: 90 }}
              >
                <FaTimes />
              </motion.button>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ResumeSection;