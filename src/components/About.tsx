
import React from 'react';

const About = () => {
  const experiences = [
    {
      title: "Senior Front-End Developer",
      company: "Acme Tech Inc.",
      period: "2021 - Present",
      description: "Leading UI/UX development for enterprise applications. Working with React, TypeScript, and GraphQL."
    },
    {
      title: "Front-End Developer",
      company: "Digital Solutions Corp",
      period: "2018 - 2021",
      description: "Built responsive web apps and improved site performance by 40%. Implemented CI/CD pipelines."
    },
    {
      title: "Web Developer Intern",
      company: "StartUp Studio",
      period: "2017 - 2018",
      description: "Assisted in developing modern web applications using React and Redux."
    }
  ];

  return (
    <section id="about" className="bg-white">
      <div className="content-container">
        <div className="code-block mb-6 inline-block">
          <span className="text-fairy-dark-purple">// Who am I and what I do</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-12 text-gradient">about<span className="text-fairy-purple">()</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* About Me Text */}
          <div className="animate-slide-in [animation-delay:100ms]">
            <h3 className="text-xl font-bold mb-4 font-mono text-fairy-purple">$ whoami</h3>
            
            <p className="mb-4">
              I'm a passionate software engineer specializing in front-end development with 5+ years of experience building 
              beautiful, responsive, and user-friendly web applications.
            </p>
            
            <p className="mb-4">
              My expertise includes React, TypeScript, and modern JavaScript frameworks. I'm deeply committed to clean code, 
              accessibility, and creating exceptional user experiences.
            </p>
            
            <p>
              I'm constantly learning new technologies and techniques to stay at the forefront of web development, 
              and I love collaborating with teams to solve complex problems.
            </p>
            
            <div className="mt-8">
              <h4 className="font-mono text-fairy-dark-purple mb-2">$ skills --list</h4>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind", "Redux", "Node.js", "GraphQL", "Jest", "Git", "Figma", "AWS"].map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-fairy-light-purple/20 text-fairy-dark-purple px-3 py-1 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Experience */}
          <div className="animate-slide-in [animation-delay:200ms]">
            <h3 className="text-xl font-bold mb-4 font-mono text-fairy-purple">$ work --experience</h3>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-fairy-purple pl-4 py-1">
                  <h4 className="font-bold text-lg">{exp.title}</h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-fairy-dark-purple">{exp.company}</span>
                    <span className="text-sm text-fairy-dark-purple/60">{exp.period}</span>
                  </div>
                  <p className="text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-fairy-purple hover:text-fairy-dark-purple underline decoration-dotted underline-offset-2"
              >
                View full work history →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
