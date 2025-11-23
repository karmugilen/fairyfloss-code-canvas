import React, { useState, useEffect } from 'react';
import { SOCIAL_LINKS, PROFILE_IMAGES } from '../data/portfolio';
import { useBlink } from '../hooks/useBlink';

const HeroSection = () => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const { isBlinking, triggerBlink } = useBlink(imagesLoaded);

    useEffect(() => {
        let loaded = 0;
        const handleLoad = () => {
            loaded += 1;
            if (loaded === 2) setImagesLoaded(true);
        };

        const images = [
            PROFILE_IMAGES.open,
            PROFILE_IMAGES.closed,
        ];

        images.forEach((src) => {
            const img = new window.Image();
            img.onload = handleLoad;
            img.src = src;
            if (img.complete) handleLoad();
        });
    }, []);

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
                        onClick={triggerBlink}
                        onTouchStart={triggerBlink}
                    >
                        <div className="relative w-full h-full">
                            {/* Loading placeholder - simple fade out */}
                            <div
                                className={`absolute inset-0 bg-white/10 transition-opacity duration-500 ${imagesLoaded ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />

                            {/* Open eyes image - instant switch, no transition */}
                            <img
                                src={PROFILE_IMAGES.open}
                                alt="Profile"
                                className={`absolute inset-0 w-full h-full object-cover ${imagesLoaded && !isBlinking ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                                width="320"
                                height="320"
                            />

                            {/* Closed eyes image - instant switch for blinking */}
                            <img
                                src={PROFILE_IMAGES.closed}
                                alt="Profile blinking"
                                className={`absolute inset-0 w-full h-full object-cover ${imagesLoaded && isBlinking ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
                                loading="eager"
                                decoding="async"
                                width="320"
                                height="320"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
