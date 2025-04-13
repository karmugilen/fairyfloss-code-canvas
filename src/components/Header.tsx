
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="content-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-mono text-xl font-bold text-gradient">
              <span className="text-fairy-purple">{`<`}</span>
              dev
              <span className="text-fairy-purple">{`/>`}</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="nav-link">about()</button>
            <button onClick={() => scrollToSection('projects')} className="nav-link">projects()</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">contact()</button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-fairy-purple hover:bg-fairy-dark-purple text-white px-4 py-2 rounded-md transition duration-300"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-fairy-dark-purple" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            <button onClick={() => scrollToSection('about')} className="nav-link py-2">about()</button>
            <button onClick={() => scrollToSection('projects')} className="nav-link py-2">projects()</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link py-2">contact()</button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-fairy-purple hover:bg-fairy-dark-purple text-white px-4 py-2 rounded-md transition duration-300 text-center"
            >
              Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
