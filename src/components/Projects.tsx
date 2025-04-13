
import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-featured online shopping platform with product catalog, cart functionality, and payment integration.",
      techStack: ["React", "Node.js", "MongoDB", "Stripe API"],
      liveUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/janedeveloper/ecommerce",
      image: "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "Task Management App",
      description: "A productivity application for managing tasks, with drag-and-drop functionality and real-time updates.",
      techStack: ["React", "TypeScript", "Firebase", "TailwindCSS"],
      liveUrl: "https://example.com/taskmanager",
      githubUrl: "https://github.com/janedeveloper/taskmanager",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2944&auto=format&fit=crop"
    },
    {
      title: "Weather Dashboard",
      description: "A weather application that displays current conditions and forecasts based on user location.",
      techStack: ["JavaScript", "APIs", "CSS", "HTML"],
      liveUrl: "https://example.com/weather",
      githubUrl: "https://github.com/janedeveloper/weather-app",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2865&auto=format&fit=crop"
    },
    {
      title: "Portfolio Website",
      description: "A personal portfolio website built with modern web technologies and animations.",
      techStack: ["React", "TailwindCSS", "Vite"],
      githubUrl: "https://github.com/janedeveloper/portfolio",
      image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2864&auto=format&fit=crop"
    },
    {
      title: "Movie Database App",
      description: "An application for browsing movies and TV shows, with search and filtering capabilities.",
      techStack: ["React", "Redux", "TMDb API"],
      liveUrl: "https://example.com/moviedb",
      githubUrl: "https://github.com/janedeveloper/moviedb",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2940&auto=format&fit=crop"
    },
    {
      title: "Fitness Tracker",
      description: "A web application for tracking workouts, setting goals, and monitoring progress over time.",
      techStack: ["React", "Node.js", "MongoDB", "Chart.js"],
      liveUrl: "https://example.com/fitness",
      githubUrl: "https://github.com/janedeveloper/fitness",
      image: "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=2940&auto=format&fit=crop"
    },
  ];

  return (
    <section id="projects" className="bg-fairy-gradient">
      <div className="content-container">
        <div className="code-block mb-6 inline-block">
          <span className="text-fairy-dark-purple">// Check out my latest work</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-12 text-gradient">projects<span className="text-fairy-purple">()</span></h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              title={project.title}
              description={project.description}
              techStack={project.techStack}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
              image={project.image}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
