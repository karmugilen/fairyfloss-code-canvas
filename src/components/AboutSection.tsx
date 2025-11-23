import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ABOUT_DATA } from '../data/portfolio';

const AboutSection = () => {
    return (
        <section id="about" className="pt-0 pb-16 md:py-16">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl text-white/80 mb-6">About</h2>
                    <div className="space-y-4">
                        {ABOUT_DATA.paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-primary">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl text-white/80 mb-6">Education</h2>
                    <div className="space-y-6">
                        {ABOUT_DATA.education.map((edu, index) => (
                            <div
                                key={index}
                                className="transform transition-all duration-300 hover:translate-x-2"
                            >
                                <h3 className="text-primary font-semibold">{edu.degree}</h3>
                                <p className="text-white/80">{edu.institution}</p>
                            </div>
                        ))}

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
    );
};

export default AboutSection;
