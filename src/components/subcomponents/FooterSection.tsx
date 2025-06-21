import React, { useEffect } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer: React.FC = () => {
    useEffect(() => {
    const animateFooter = () => {
      const footerContainer = document.querySelector('.footer-container');
      const footerLogo = document.querySelector('.footer-logo');
      const footerText = document.querySelector('.footer-text');
      const footerSocial = document.querySelector('.footer-social');
      const footerLinks = document.querySelectorAll('.footer-links li');
      const newsletterForm = document.querySelector('.newsletter-form');
      const footerBottom = document.querySelector('.footer-bottom');
      
      if (footerContainer) footerContainer.classList.add('animate');
      if (footerLogo) footerLogo.classList.add('animate');
      if (footerText) footerText.classList.add('animate');
      if (footerSocial) footerSocial.classList.add('animate');
      footerLinks.forEach((link, index) => {
        setTimeout(() => {
          link.classList.add('animate');
        }, index * 100);
      });
      if (newsletterForm) newsletterForm.classList.add('animate');
      if (footerBottom) footerBottom.classList.add('animate');
    };

    const timer = setTimeout(animateFooter, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">Malvin Manalang</div>
          <p className="footer-text">
            Full Stack Developer creating modern web applications with cutting-edge technologies.
          </p>
          
          <div className="footer-social">
            <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <FaGithub className="social-icon" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          <h3 className="links-title">Quick Links</h3>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#resume">Resume</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Newsletter</h3>
          <p>Subscribe to my newsletter for the latest updates.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Malvin Manalang. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;