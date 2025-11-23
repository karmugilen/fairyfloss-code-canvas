import React from 'react';
import { PROJECTS_DATA } from '../data/portfolio';

const ProjectsSection = () => {
    return (
        <section id="projects" className="py-16">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl text-white/80 mb-12">Projects</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {PROJECTS_DATA.map((project, index) => (
                        <div
                            key={index}
                            className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-fairy-purple/20 p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                            <h3 className="text-xl text-primary mb-3">{project.title}</h3>
                            <p className="text-white/90 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map((tag, tagIndex) => (
                                    <React.Fragment key={tagIndex}>
                                        <span className="text-white/70">{tag}</span>
                                        {tagIndex < project.tags.length - 1 && (
                                            <span className="text-white/70">•</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <a
                                href={project.link}
                                className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded transition-colors"
                            >
                                visit
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;
