import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard.tsx';
import '../../styles/ProjectsSection.css';
import { supabase } from './supabaseClient.ts';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data as Project[]);
      }
    };

    fetchProjects();

    // Intersection Observer for scroll animation
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

    const section = document.querySelector('#projects');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="projects" className={`projects-section ${isVisible ? 'visible' : ''}`}>
      <div className="section-header">
        <h2 className="section-title">My Projects</h2>
        {/* <div className="section-divider"></div> */}
      </div>
      
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={{
              ...project,
              githubLink: project.github_link,
              demoLink: project.demo_link,
              imageUrl: project.image_url
            }} 
            animationDelay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;