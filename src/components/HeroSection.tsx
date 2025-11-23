import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../data/portfolio';

const HeroSection = () => {
    const [timestamp, setTimestamp] = useState(Date.now());
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleBlinkClick = () => {
        // Force GIF reload by adding timestamp to prevent caching
        setTimestamp(Date.now());
        setImageLoaded(false); // Reset loading state
    };

    return (
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
                                        <link.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div
                        className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white/10 animate-float cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        onClick={handleBlinkClick}
                        onTouchStart={handleBlinkClick}
                    >
                        <div className="relative w-full h-full">
                            {/* Loading placeholder */}
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                            )}

                            {/* Actual GIF image */}
                            <img
                                src={`/images/blink.gif?t=${timestamp}`}
                                alt="Profile"
                                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                loading="eager"
                                width="320"
                                height="320"
                                onLoad={() => setImageLoaded(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
