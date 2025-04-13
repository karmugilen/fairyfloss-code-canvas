
import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl: string;
  image: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  liveUrl,
  githubUrl,
  image,
  index
}) => {
  const animationDelay = `${(index + 1) * 100}ms`;

  return (
    <div 
      className="group card-glow bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-slide-in"
      style={{ animationDelay }}
    >
      <div className="p-1">
        <div className="aspect-video w-full overflow-hidden bg-fairy-light-purple/10">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gradient">
            {title}
          </h3>
          
          <p className="text-sm text-fairy-dark-purple/80 mb-4">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="bg-fairy-light-purple/20 text-fairy-dark-purple px-2 py-1 rounded-md text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex gap-3">
            {liveUrl && (
              <a 
                href={liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-purple hover:bg-fairy-dark-purple text-white px-4 py-2 rounded-md transition duration-300 text-sm flex items-center gap-1"
              >
                <ExternalLink size={16} /> Visit
              </a>
            )}
            
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noreferrer"
              className="bg-fairy-light-purple/20 hover:bg-fairy-light-purple/30 text-fairy-dark-purple px-4 py-2 rounded-md transition duration-300 text-sm flex items-center gap-1"
            >
              <Github size={16} /> Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
