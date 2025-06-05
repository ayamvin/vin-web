import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../../styles/SkillItem.css';

interface SkillItemProps {
  name: string;
  level: number;
  icon: string;
}

const SkillItem: React.FC<SkillItemProps> = ({ name, level }) => {
  const { theme } = useTheme();

  return (
    <div className={`skill-item ${theme}`}>
      <div className="skill-header">
        <h4 className="skill-name">{name}</h4>
        <span className="skill-percent">{level}%</span>
      </div>
      <div className="skill-bar">
        <div 
          className="skill-progress" 
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillItem;