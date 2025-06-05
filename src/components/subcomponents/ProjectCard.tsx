import React from 'react';
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
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { theme } = useTheme();

  return (
    <div className={`project-card ${theme}`}>
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