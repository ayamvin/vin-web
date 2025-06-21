import React, { useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../../styles/ProjectCard.css';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  demoLink: string;
  imageUrl: string;
}

interface ProjectCardProps {
  project: Project;
  animationDelay?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, animationDelay = 0 }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`project-card ${theme}`}
      style={{
        '--delay': `${animationDelay}s`
      } as React.CSSProperties}
    >
      <div className="project-image-container">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="project-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/project-placeholder.jpg';
          }}
        />
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="project-technologies">
          {project.technologies.map((tech, index) => (
            <span key={index} className="technology-tag">{tech}</span>
          ))}
        </div>
        
        <div className="project-links">
          <a 
            href={project.githubLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link"
            aria-label="GitHub Repository"
          >
            <FaGithub className="link-icon" /> Code
          </a>
          {project.demoLink && (
            <a 
              href={project.demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
              aria-label="Live Demo"
            >
              <FaExternalLinkAlt className="link-icon" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;