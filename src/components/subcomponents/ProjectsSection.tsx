import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard.tsx';
import '../../styles/ProjectsSection.css';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github_link: string;
  demo_link: string;
  image_url: string;
}

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  return (
    <section id="projects" className="projects-section">
      <div className="section-header">
        <h2 className="section-title">My Projects</h2>
        {/* <p className="section-subtitle">Some of my recent work</p> */}
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={{
            ...project,
            githubLink: project.github_link,
            demoLink: project.demo_link,
            imageUrl: project.image_url
          }} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
