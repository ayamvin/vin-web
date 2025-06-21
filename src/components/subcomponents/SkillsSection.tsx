import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import '../../styles/SkillsSection.css';
import { supabase } from './supabaseClient.ts';

// Language colors for the cards
const languageColors: Record<string, string> = {
  'JavaScript': '#f0db4f',
  'TypeScript': '#3178c6',
  'React': '#61dafb',
  'Node.js': '#68a063',
  'HTML/CSS': '#e34c26',
  'Python': '#3776ab',
  'SQL': '#f29111',
  'Git': '#f14e32'
};

interface Skills {
  name: string;
  years: number;
  icon: string;
}

const SkillsSection: React.FC = () => {
  const { theme } = useTheme();
  const [skills, setSkills] = useState<Skills[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*');

      if (error) {
        console.error('Failed to fetch skills:', error.message);
      } else {
        setSkills(data as Skills[]);
      }
    };

    fetchSkills();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`custom-tooltip ${theme}`}>
          <p className="tooltip-label">{payload[0].payload.name}</p>
          <p className="tooltip-value">{payload[0].value} years</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="skills" 
      className={`skills-section ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="section-header">
        <h2 className="section-title">My Experience</h2>
        <p className="section-subtitle">Years working with each technology</p>
        <div className="section-divider"></div>
      </div>

      <div className="language-cards-container">
        {skills.map((skill, index) => (
          <div 
            key={skill.name}
            className="language-card"
            style={{ 
              backgroundColor: languageColors[skill.name],
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="language-icon">
              <span className={`icon-${skill.icon}`}>{skill.icon}</span>
            </div>
            <div className="language-name">{skill.name}</div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={skills}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 2.5]} 
              tick={{ fill: theme === 'dark' ? '#ccd6f6' : '#333' }}
              tickFormatter={(value) => `${value}y`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: theme === 'dark' ? '#ccd6f6' : '#333' }}
              width={100}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: theme === 'dark' ? 'rgba(100, 255, 218, 0.1)' : 'rgba(52, 152, 219, 0.1)' }}
            />
            <Bar
              dataKey="years"
              name="Experience"
              animationDuration={1500}
              fill={theme === 'dark' ? '#64ffda' : '#3498db'}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SkillsSection;