import React from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import '../../styles/HeroSection.css';
import developerImage from '../../assets/images/vin_bg.png'; // Adjust the path to your image

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Hi, I'm <span className="highlight">Malvin Manalang</span></h1>
        <h2 className="hero-subtitle">Part Time Full Stack Developer</h2>
        <p className="hero-description">
          I build exceptional digital experiences with modern technologies.
          Currently focused on React, TypeScript, and Node.js applications.
        </p>
        
        <div className="hero-cta">
          <Link to="projects" smooth={true} duration={500} className="cta-button">
            View My Work
          </Link>
          <Link to="contact" smooth={true} duration={500} className="cta-button">
            Contact Me
          </Link>
        </div>
        
        <div className="hero-social">
          <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="social-icon" />
          </a>
          <a href="mailto:john@example.com" aria-label="Email">
            <HiOutlineMail className="social-icon" />
          </a>
        </div>
      </div>
      
      <div className="hero-image">
        <div 
          className="developer-illustration"
          style={{ backgroundImage: `url(${developerImage})` }}
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;