import React, { useState } from 'react';
import { HiOutlineMail, HiOutlineUser, HiOutlineDocumentText } from 'react-icons/hi';
import '../../styles/ContactSection.css';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the form data to your backend or EmailJS
      console.log('Form submitted:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitMessage('Sorry, something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-header">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">Have a project or question? Send me a message</p>
      </div>
      
      <div className="contact-container">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">
              <HiOutlineUser className="input-icon" /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              <HiOutlineMail className="input-icon" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className={`form-group ${errors.message ? 'error' : ''}`}>
            <label htmlFor="message">
              <HiOutlineDocumentText className="input-icon" /> Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows={5}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>
          
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}
        </form>
        
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>Feel free to reach out through any of these channels:</p>
          
          <div className="info-item">
            <HiOutlineMail className="info-icon" />
            <span>john.doe@example.com</span>
          </div>
          
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;