import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa'; // Import gamepad icon
import '../../styles/TopBar.css';
import SplashCursor from '../ReactBits/SplashCursor';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showCursor, setShowCursor] = useState(false); // State for cursor toggle

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const toggleCursor = () => {
    setShowCursor(prev => !prev);
  };

  return (
    <nav className={`topbar ${theme}`}>
      {showCursor && <SplashCursor />}
      <div className="topbar-container">
        <Link 
          to="hero" 
          smooth={true} 
          duration={500} 
          className="logo-link"
        >
          <div className="logo">DevPortfolio</div>
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              smooth={true}
              duration={500}
              className="nav-link"
              activeClass="active"
              spy={true}
              offset={-70}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="topbar-buttons">
          <button 
            onClick={toggleCursor} 
            className="cursor-toggle"
            aria-label={`${showCursor ? 'Disable' : 'Enable'} splash cursor`}
            data-active={showCursor}
          >
            <FaGamepad size={16} className="cursor-icon" />
            <span>Play Me!</span>
          </button>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <FiSun size={20} className="theme-icon" />
            ) : (
              <FiMoon size={20} className="theme-icon" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;