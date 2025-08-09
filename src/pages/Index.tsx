// src/pages/Index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, FileText, ChevronRight } from 'lucide-react';

// --- Define your image URLs here ---
const profileImageOpen = '/images/image1.webp';
const profileImageClosed = '/images/image2.webp';

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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const blinkTimeout = useRef<NodeJS.Timeout | null>(null);
  const nextBlinkTimeout = useRef<NodeJS.Timeout | null>(null);

  // Preload profile images for faster display and wait for both to load before showing
  useEffect(() => {
    let loaded = 0;
    const handleLoad = () => {
      loaded += 1;
      if (loaded === 2) setImagesLoaded(true);
    };
    const openImg = new window.Image();
    const closedImg = new window.Image();
    openImg.onload = handleLoad;
    closedImg.onload = handleLoad;
    openImg.src = profileImageOpen;
    closedImg.src = profileImageClosed;
    // In case images are cached and load event doesn't fire
    if (openImg.complete) handleLoad();
    if (closedImg.complete) handleLoad();
    // Cleanup not needed for Image objects
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    // Smooth, more frequent blinking
    // Eyes closed for 80ms, open for 600-1000ms (randomized)
    // Now: more double blinks (70%) than single (30%)

    const doSingleBlink = () => {
      setIsBlinking(true);
      blinkTimeout.current = setTimeout(() => {
        setIsBlinking(false);
      }, 50); // eyes closed for 80ms
    };

    const doDoubleBlink = () => {
      setIsBlinking(true);
      blinkTimeout.current = setTimeout(() => {
        setIsBlinking(false);
        blinkTimeout.current = setTimeout(() => {
          setIsBlinking(true);
          blinkTimeout.current = setTimeout(() => {
            setIsBlinking(false);
          }, 80); // second blink closed for 80ms
        }, 120); // open between blinks for 120ms
      }, 80); // first blink closed for 80ms
    };

    const scheduleBlink = () => {
      // More often: open interval 600-1000ms
      const openDuration = 3000 + Math.random() * 2000;
      nextBlinkTimeout.current = setTimeout(() => {
        if (Math.random() < 0.7) {
          doDoubleBlink();
          // double blink total closed+open+closed = 80+120+80 = 280ms
          nextBlinkTimeout.current = setTimeout(scheduleBlink, 280);
        } else {
          doSingleBlink();
          // single blink closed = 80ms
          nextBlinkTimeout.current = setTimeout(scheduleBlink, 80);
        }
      }, openDuration);
    };

    scheduleBlink();

    return () => {
      if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
      if (nextBlinkTimeout.current) clearTimeout(nextBlinkTimeout.current);
    };
  }, [imagesLoaded]);

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
                Cybersecurity Researcher (Steganography)
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
            {/* Updated image container with optimized image loading */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/10 animate-float">
              {/* Show a blank or skeleton until images are loaded */}
              {!imagesLoaded ? (
                <div className="w-full h-full bg-white/10 animate-pulse" />
              ) : (
                <picture>
                  <source 
                    srcSet={isBlinking ? profileImageClosed : profileImageOpen} 
                    type="image/webp" 
                  />
                  <img
                    src={isBlinking ? profileImageClosed.replace('.webp', '.jpg') : profileImageOpen.replace('.webp', '.jpg')}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    width="320"
                    height="320"
                  />
                </picture>
              )}
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
              I'm Karmugil, a PhD Researcher specializing in video steganography. My work involves intricate data embedding and extraction within both compressed and uncompressed video streams, leveraging advanced techniques like upscaling and frame generation to enhance capacity and robustness.
              </p>
              <p className="text-primary">
              My passion lies in pushing the boundaries of information hiding, where my creativity and curiosity drive me to develop novel solutions. I thrive on diving into complex challenges that expand my knowledge and foster collaborative environments aimed at advancing cybersecurity.
              </p>
              <p className="text-primary">
              In my free time, I enjoy building electronic hardware, rock climbing, immersing myself in books, and appreciating the tactile satisfaction of my mechanical keyboard.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-white/80 mb-6">Education</h2>
            <div className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                Currently pursuing PhD in Computer Science
                </h3>
                <p className="text-white/80">Vellore Institute of Technology 
                </p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  MSc Computer Science
                </h3>
                <p className="text-white/80">Indian Arts and Science College</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  BSc Computer Science
                </h3>
                <p className="text-white/80">Voorhees College</p>
              </div>
              {/* <div className="transform transition-all duration-300 hover:translate-x-2">
                <h3 className="text-primary font-semibold">
                  Associate Producer
                </h3>
                <p className="text-white/80">FableVision Studios</p>
              </div> */}

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
              <h3 className="text-xl text-primary mb-3">Infinite Storage Glitch</h3>
              <p className="text-white/90 mb-4">
                Use YouTube as cloud storage by converting any zip file into a video, uploading it, and later retrieving and restoring your files. Inspired by DvorakDwarf's Infinite-Storage-Glitch, this Python version lets you archive files to zip, turn them into a video, upload to YouTube (unlisted), and recover your data by downloading and decoding the video. Only one zip file should be in the directory at a time. The program uses large pixel blocks to reduce corruption risk and provides simple functions to convert files to binary, create videos, and restore files from videos.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-white/70">Python</span>
              </div>
              <a
                href="https://github.com/KKarmugil/Infinite_Storage_Glitch"
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
              href="mailto:k@karmugil.com"
              className="text-primary hover:underline"
            >
              k@karmugil.com
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