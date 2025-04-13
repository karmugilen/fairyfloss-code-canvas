
import React from 'react';
import { Mail, Github, Linkedin, Heart } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="bg-white">
      <div className="content-container">
        <div className="code-block mb-6 inline-block">
          <span className="text-fairy-dark-purple">// Let's work together</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-12 text-gradient">contact<span className="text-fairy-purple">()</span></h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-fairy-gradient rounded-lg p-8 shadow-md">
            <div className="font-mono mb-6">
              <div>
                <span className="text-fairy-dark-purple">{`console.log(`}</span>
                <span className="text-fairy-teal">message</span>
                <span className="text-fairy-dark-purple">{`)`}</span>
                <span className="text-fairy-dark-purple">;</span>
              </div>
              <div className="pl-4 mt-2">
                <span>// "</span>
                <span className="text-fairy-yellow">I'm currently open to new opportunities! If you're interested in working together, have a question, or just want to say hi, feel free to reach out to me!</span>
                <span>"</span>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <a 
                href="mailto:contact@janedeveloper.com"
                className="bg-fairy-purple hover:bg-fairy-dark-purple text-white px-6 py-3 rounded-md transition duration-300 flex items-center gap-2"
              >
                <Mail size={20} />
                contact@janedeveloper.com
              </a>
            </div>
            
            <div className="flex justify-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-light-purple/20 hover:bg-fairy-light-purple/40 text-fairy-dark-purple p-3 rounded-full transition duration-300"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-fairy-light-purple/20 hover:bg-fairy-light-purple/40 text-fairy-dark-purple p-3 rounded-full transition duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm text-fairy-dark-purple/60">
            <p className="flex items-center justify-center gap-1">
              Designed & Built with <Heart size={16} className="text-fairy-purple" /> by Jane Developer
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
