import React from 'react';
import { SOCIAL_LINKS } from '../data/portfolio';

const ContactSection = () => {
    return (
        <section id="contact" className="py-16">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl text-white/80 mb-8">Contact</h2>

                <div className="flex flex-col gap-8">
                    <div>
                        <p className="text-white/80 text-base">
                            Please reach out to me at{' '}
                            <a
                                href="mailto:k@karmugil.com"
                                className="text-primary hover:underline"
                            >
                                k@karmugil.com
                            </a>{' '}
                            for inquiries.
                        </p>
                    </div>

                    <div className="space-y-1 text-white/70 code-block text-base">
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
                                        <link.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
