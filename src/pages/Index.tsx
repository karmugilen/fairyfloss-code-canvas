// src/pages/Index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, FileText, ChevronRight } from 'lucide-react';

// --- Define your image URLs here ---
const profileImageOpen =
  'https://github.com/karmugilen/fairyfloss-code-canvas/blob/main/src/pages/image1.png?raw=true';
// Provide a valid "eyes closed" image URL or fallback to open image
const profileImageClosed ='https://github.com/karmugilen/fairyfloss-code-canvas/blob/main/src/pages/image2.png?raw=true';

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/karmugilen',
    label: 'GitHub',
    icon: <Github size={20} />,
  },
  {
    href: '/resume.pdf',
    label: 'Resume',
    icon: <FileText size={20} />,
  },
  {
    href: 'https://www.linkedin.com/in/karmugil-k-a0a1131a3/',
    label: 'LinkedIn',
    icon: <Linkedin size={20} />,
  },
];

const Index = () => {
  const [isBlinking, setIsBlinking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const singleBlink = () => {
      setIsBlinking(true);
      timeoutRef.current = setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    };

    const doubleBlink = () => {
      setIsBlinking(true);
      timeoutRef.current = setTimeout(() => {
        setIsBlinking(false);
        timeoutRef.current = setTimeout(() => {
          setIsBlinking(true);
          timeoutRef.current = setTimeout(() => {
            setIsBlinking(false);
          }, 120);
        }, 120);
      }, 120);
    };

    const scheduleNextBlink = () => {
      const blinkInterval = 3000 + Math.random() * 2000;
      intervalRef.current = setTimeout(() => {
        // Randomly choose single or double blink (e.g., 70% single, 30% double)
        if (Math.random() < 0.7) {
          singleBlink();
        } else {
          doubleBlink();
        }
        scheduleNextBlink();
      }, blinkInterval);
    };

    scheduleNextBlink();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

      {/* Hero Section */}
      <section id="hero" className="min-h-[70vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in">
            <div className="code-block mb-6">
              <div className="text-white/60">
                function <span className="text-primary">karmugil</span>() {'{'}
              </div>
              <div className="pl-8 py-6">
                <div className="text-primary animate-typing">
                  full-stack software engineer
                </div>
              </div>
              <div className="text-white/60">{'}'}</div>
            </div>

            <div className="mt-8 code-block">
              <div className="text-white/60">
                console.log(github, resume, linkedin)
              </div>
              <div className="mt-2 flex space-x-4">
                <span className="text-white/60"></span>
                <div className="flex space-x-4">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-primary transition-colors transform hover:scale-110 duration-200"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Updated image container */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/10 animate-float">
              <img
                src={isBlinking ? profileImageClosed : profileImageOpen}
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="pt-0 pb-16 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl text-white/80 mb-6">About</h2>
            <div className="space-y-4">
              <p className="text-primary">
                I'm Karmugil, a full-stack software engineer. I'm interested in
                contributing to projects where my creativity and curiosity can
                be expressed, and my knowledge expanded. Teams where everyone --
                my co-collaborators, stakeholders, leaders -- share a common
                goal in making an awesome product that delights its users.
              </p>
              <p className="text-primary">
                I thrive on diving into projects that push my boundaries and
                spark interest. For me, it's all about mixing it up, whether
                it's coding, collaborating, or learning something totally new.
              </p>
              <p className="text-primary">
                In my free time, I dabble in building electronic hardware, rock
                climbing, reading, and mooning over my mechanical keyboard.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-white/80 mb-6">Work Experience</h2>
            <div className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  Full-stack Software Engineer
                </h3>
                <p className="text-white/80">Mainstay</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  Frontend Software Engineer
                </h3>
                <p className="text-white/80">The Atlas for Cities</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  Software Engineer, Contract
                </h3>
                <p className="text-white/80">FableVision Studios</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  Associate Producer
                </h3>
                <p className="text-white/80">FableVision Studios</p>
              </div>

              <a
                href="#"
                className="text-white/80 hover:text-primary inline-flex items-center group transition-colors"
              >
                view more{' '}
                <ChevronRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl text-white/80 mb-12">Projects</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-fairy-purple/20 p-4 rounded-lg">
              <h3 className="text-xl text-primary mb-3">MarketEdge</h3>
              <p className="text-white/90 mb-4">
                Data dashboard for B2G companies to track active RFP procurement
                opportunities and other vital information for their sales &
                marketing efforts. Link below links to a marketing website for
                the MarketEdge application, as the application itself is a paid
                product.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/70">Vue3</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">TypeScript</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Pinia</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Laravel</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Cypress</span>
              </div>
              <a
                href="#"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded transition-colors"
              >
                visit
              </a>
            </div>

            <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-fairy-purple/20 p-4 rounded-lg">
              <h3 className="text-xl text-primary mb-3">The Atlas</h3>
              <p className="text-white/90 mb-4">
                LinkedIn style community for local government officials to
                connect and share resources. Includes posting functionality,
                private messaging, and case study article creator/editor and
                viewer.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/70">Vue</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Options API</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Nuxt</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">TypeScript</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Vuex</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Cypress</span>
              </div>
              <a
                href="#"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded transition-colors"
              >
                visit
              </a>
            </div>

            <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-fairy-purple/20 p-4 rounded-lg">
              <h3 className="text-xl text-primary mb-3">Thinking Money 4 Kids</h3>
              <p className="text-white/90 mb-4">
                Suite of browser-based games and activities built for The
                American Library Association &amp; FINRA to teach kids about
                financial literacy. My work on this project also included
                creating android applications.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/70">HTML/CSS/JS</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Android</span>
              </div>
              <a
                href="#"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded transition-colors"
              >
                visit
              </a>
            </div>

            <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-fairy-purple/20 p-4 rounded-lg">
              <h3 className="text-xl text-primary mb-3">
                Digital Garden Client &amp; API
              </h3>
              <p className="text-white/90 mb-4">
                Simple personal website used to blog about dev projects, and
                other things that are on my mind.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/70">Node.js</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Express</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">PostgreSQL</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Sequelize</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">TypeScript</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Vue3</span>
                <span className="text-white/70">•</span>
                <span className="text-white/70">Pinia</span>
              </div>
              <a
                href="#"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded transition-colors"
              >
                visit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl text-white/80 mb-8">Contact</h2>

          <p className="text-white/80 mb-2">
            Please reach out to me at{' '}
            <a
              href="mailto:karmugil251@gmail.com"
              className="text-primary hover:underline"
            >
              karmugil251@gmail.com
            </a>{' '}
            for inquiries.
          </p>

          <div className="mt-8 space-y-1 text-white/70">
            <div>console.log(credits, goodbye)</div>
            <div>
              &gt;&gt; design inspired by my favorite text editor theme,
              fairyfloss
            </div>
            <div>&gt;&gt; thanks for visiting! :)</div>
            <div className="mt-4 flex space-x-4">
              <span>&gt;&gt;</span>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-primary transition-colors transform hover:scale-110 duration-200"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;