import React from 'react';
import { Link } from 'react-scroll';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import '../../styles/TopBar.css';

const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Define navigation items for cleaner code
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`topbar ${theme}`}>
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
              offset={-70} // Adjust this based on your header height
            >
              {item.label}
            </Link>
          ))}
        </div>
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
    </nav>
  );
};

export default TopBar;