import React from 'react';
import ProjectCard from './ProjectCard.tsx';
import '../../styles/ProjectsSection.css';

const projects = [
  {
    id: 1,
    title: 'QCONNECT DASHBOARD',
    description: 'QConnect is a modern web dashboard for monitoring and controlling QSeries devices, including QSence (3-phase electrical parameter monitoring), QShield (power factor correction, voltage balancing, harmonic mitigation, FFT analysis), and QAritower (virus-killing air purifier with CNT technology).',
    technologies: ['React', 'Node.js', 'Postgresql', 'Typescript'],
    githubLink: 'https://github.com',
    demoLink: 'https://example.com',
    imageUrl: '/assets/images/qconnect_login.PNG'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates.',
    technologies: ['React', 'Firebase', 'TypeScript', 'Material UI'],
    githubLink: 'https://github.com',
    demoLink: 'https://example.com',
    imageUrl: '/assets/images/qconnect.png'
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Weather application with 5-day forecast and location search.',
    technologies: ['React', 'OpenWeather API', 'Chart.js'],
    githubLink: 'https://github.com',
    demoLink: 'https://example.com',
    imageUrl: '/assets/images/qconnect.png'
  }
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="projects-section">
      <div className="section-header">
        <h2 className="section-title">My Projects</h2>
        <p className="section-subtitle">Some of my recent work</p>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;