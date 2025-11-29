import { Github, Linkedin, FileText } from 'lucide-react';

export const SOCIAL_LINKS = [
    {
        href: 'https://github.com/karmugilen',
        label: 'GitHub',
        icon: Github,
    },
    {
        href: '/Resume.pdf',
        label: 'Resume',
        icon: FileText,
    },
    {
        href: 'https://www.linkedin.com/in/karmugil-k-a0a1131a3/',
        label: 'LinkedIn',
        icon: Linkedin,
    },
];

export const PROFILE_IMAGES = {
    open: '/images/image1.jpg',
    closed: '/images/image2.jpg',
    jxlOpen: '/images/jxl/image1.jxl',
    jxlClosed: '/images/jxl/image2.jxl',
};

export const ABOUT_DATA = {
    paragraphs: [
        "I'm Karmugil, a PhD Researcher specializing in video steganography. My work involves intricate data embedding and extraction within both compressed and uncompressed video streams, leveraging advanced techniques like upscaling and frame generation to enhance capacity and robustness.",
        "My passion lies in pushing the boundaries of information hiding, where my creativity and curiosity drive me to develop novel solutions. I thrive on diving into complex challenges that expand my knowledge and foster collaborative environments aimed at advancing cybersecurity.",
        "In my free time, I enjoy building electronic hardware, rock climbing, immersing myself in books, and appreciating the tactile satisfaction of my mechanical keyboard.",
    ],
    education: [
        {
            degree: 'Currently pursuing PhD in Computer Science',
            institution: 'Vellore Institute of Technology',
        },
        {
            degree: 'MSc Computer Science',
            institution: 'Indian Arts and Science College',
        },
        {
            degree: 'BSc Computer Science',
            institution: 'Voorhees College',
        },
    ],
};

export const PROJECTS_DATA = [
    {
        title: 'Infinite Storage Glitch',
        description:
            "A Python tool that exploits YouTube for unlimited cloud storage by converting files into videos. Inspired by DvorakDwarf, it encodes binary data into RGB frames (black/white pixels) using MoviePy and Pillow. Features include file-to-video encoding with configurable pixel sizes to resist compression artifacts, video-to-file decoding, and an integrated YouTube downloader using Pytube.",
        tags: ['Python', 'MoviePy', 'Pillow', 'Pytube', 'NumPy'],
        link: 'https://github.com/KKarmugil/Infinite_Storage_Glitch',
    },
    {
        title: 'LSB-Steganography-Toolkit',
        description:
            'Easy way to hide secret messages in images. Real-time capacity tracking and quality analysis. Features include hiding messages in PNG/BMP, extracting messages, multiple LSB support (1-4 bits), real-time capacity monitoring, and quality analysis (PSNR/SSIM).',
        tags: ['Python', 'PyQt6', 'Pillow', 'NumPy'],
        link: 'https://github.com/karmugilen/LSB-Steganography-Toolkit',
    },
    {
        title: 'ImagestoAVIF Converter',
        description:
            'A lightweight, drag-and-drop GUI that converts PNG, JPEG, WebP, and other common formats to AVIF—delivering smaller file sizes without visible quality loss. Features include real-time progress bar, non-blocking UI, and cross-platform support.',
        tags: ['Python', 'PyQt6', 'Pillow', 'pillow-avif-plugin'],
        link: 'https://github.com/karmugilen/Images-to-Avif-Converter',
    },
    {
        title: 'Stock Market Trend Analyzer',
        description:
            'A Python-based tool that leverages Google Trends data to analyze market interest in various Indian and US stocks. It automates data collection, combines datasets, and generates detailed analytical reports comparing current trends against historical averages to identify significant market movements.',
        tags: [
            'Python',
            'Pytrends',
            'Pandas',
            'Google Trends',
            'Automation',
        ],
        link: 'https://github.com/karmugilen/trendAnalyser',
    },
];
