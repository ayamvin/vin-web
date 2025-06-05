import React, { useState } from 'react';
import TopBar from './subcomponents/TopBar';
import HeroSection from './subcomponents/HeroSection';
import ProjectsSection from './subcomponents/ProjectsSection';
import SkillsSection from './subcomponents/SkillsSection';
import ResumeSection from './subcomponents/ResumeSection';
import ContactSection from './subcomponents/ContactSection';
import Footer from './subcomponents/FooterSection';
import SplashCursor from './ReactBits/SplashCursor';
import { ThemeContext } from './context/ThemeContext'; // no .tsx extension needed
import '../styles/MainPage.css';

const MainPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <TopBar />
        <main>
          <SplashCursor />
          <HeroSection />
          <ProjectsSection />
          <SkillsSection />
          <ResumeSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default MainPage;
