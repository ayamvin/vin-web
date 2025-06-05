import React from 'react';
import SkillItem from './SkillItem.tsx';
import '../../styles/SkillsSection.css';

const skills = [
  { name: 'JavaScript', level: 90, icon: 'js' },
  { name: 'TypeScript', level: 85, icon: 'ts' },
  { name: 'React', level: 90, icon: 'react' },
  { name: 'Node.js', level: 80, icon: 'node' },
  { name: 'HTML/CSS', level: 95, icon: 'html' },
  { name: 'Python', level: 75, icon: 'python' },
  { name: 'SQL', level: 80, icon: 'sql' },
  { name: 'Git', level: 85, icon: 'git' },
];

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="skills-section">
      <div className="section-header">
        <h2 className="section-title">My Skills</h2>
        <p className="section-subtitle">Technologies I work with</p>
      </div>
      
      <div className="skills-container">
        {skills.map((skill, index) => (
          <SkillItem 
            key={index}
            name={skill.name}
            level={skill.level}
            icon={skill.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;