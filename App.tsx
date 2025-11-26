import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import TheLab from './components/TheLab';
import LinkedInHighlights from './components/LinkedInHighlights';
import FallingStarBarrage from './components/FallingStarBarrage';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-void min-h-screen relative selection:bg-neon-cyan selection:text-void overflow-hidden">
      
      {/* GLOBAL VISUAL POLISH: Falling Star Barrage (Meteor Shower) */}
      <FallingStarBarrage />

      {/* NEBULA LAYER (Neon Galaxy Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Top Left - Deep Purple/Blue */}
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen opacity-60" />
          
          {/* Bottom Right - Neon Pink/Purple */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/20 blur-[100px] rounded-full mix-blend-screen opacity-50" />
          
          {/* Center - Subtle Cyan Hue */}
          <div className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen opacity-40" />
      </div>

      {/* GLOBAL NOISE OVERLAY - Adds texture/grit to avoid flat plastic look */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Global Cursor/Ambient Light Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.04), transparent 80%)`
        }}
      />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-pink to-neon-cyan transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation / Contact Float */}
      <nav className="fixed top-6 right-6 z-40 flex gap-4 backdrop-blur-md bg-void/50 p-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <a href="https://github.com/aditya452007" target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-neon-cyan transition-colors">
          <Github size={20} />
        </a>
        <a href="https://linkedin.com/in/aaditya-thakur-1a8842332" target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-neon-pink transition-colors">
          <Linkedin size={20} />
        </a>
        <a href="mailto:adityathakur452007@gmail.com" className="p-2 text-gray-400 hover:text-neon-purple transition-colors">
          <Mail size={20} />
        </a>
      </nav>

      <main className="relative z-10 flex flex-col gap-32 pb-32">
        <Hero />
        <Projects />
        <LinkedInHighlights />
        <Experience />
        <TheLab />
        
        <footer className="w-full py-12 border-t border-white/10 mt-20 flex flex-col items-center justify-center text-gray-500 font-mono text-sm relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-cyan/5 pointer-events-none" />
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-neon-cyan" />
            <span>Bhopal, India (Remote Ready)</span>
          </div>
          <p>© 2025 Aaditya Thakur. Built with React & Framer Motion.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;