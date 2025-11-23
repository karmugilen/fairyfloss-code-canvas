import React, { Suspense } from 'react';
import HeroSection from '../components/HeroSection';

const AboutSection = React.lazy(() => import('../components/AboutSection'));
const ProjectsSection = React.lazy(() => import('../components/ProjectsSection'));
const ContactSection = React.lazy(() => import('../components/ContactSection'));

const LoadingFallback = () => (
  <div className="py-16 flex justify-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Header/Navigation */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-white opacity-70 animate-pulse-slow">
            <span className="text-2xl">✧</span>
          </div>
          <nav>
            <ul className="flex space-x-8 text-white/80">
              <li>
                <a
                  href="#about"
                  className="hover:text-primary transition-colors nav-link"
                >
                  about
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-primary transition-colors nav-link"
                >
                  projects
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary transition-colors nav-link"
                >
                  contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <HeroSection />

      <Suspense fallback={<LoadingFallback />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ContactSection />
      </Suspense>
    </div>
  );
};

export default Index;