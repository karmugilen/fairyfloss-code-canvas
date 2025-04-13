
import React, { useEffect, useState } from 'react';
import { Github, Linkedin, FileText } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = "Building elegant solutions to complex problems";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center bg-fairy-gradient pt-20">
      <div className="content-container">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="w-full md:w-3/5 animate-fade-in">
            <div className="mb-2 font-mono">
              <span className="text-fairy-dark-purple/80">// Hello World! I am</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-2 font-mono">
              <span className="text-fairy-teal">const</span>{" "}
              <span className="text-fairy-vivid-purple">developer</span>{" "}
              <span className="text-fairy-dark-purple">=</span>{" "}
              <span className="text-fairy-teal">{"() => {"}</span>
            </h1>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 ml-6 md:ml-12 text-gradient">
              Jane Developer
            </h2>
            
            <div className="ml-6 md:ml-12 mb-6 font-mono">
              <span className="text-fairy-dark-purple">return</span>{" "}
              <span className="code-string">"{displayText}"</span>
              <span className="animate-cursor-blink ml-1">|</span>
            </div>
            
            <div className="font-mono">
              <span className="text-fairy-teal">{"}"}</span>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-purple hover:bg-fairy-dark-purple text-white p-3 rounded-full transition duration-300"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-purple hover:bg-fairy-dark-purple text-white p-3 rounded-full transition duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="/resume.pdf" 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-purple hover:bg-fairy-dark-purple text-white p-3 rounded-full transition duration-300"
                aria-label="Resume"
              >
                <FileText size={20} />
              </a>
            </div>
          </div>
          
          {/* Image */}
          <div className="w-56 h-56 md:w-72 md:h-72 relative animate-fade-in">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-fairy-purple/50 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop" 
                alt="Jane Developer" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fairy-purple to-fairy-teal opacity-30 blur -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
