import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import TheLab from './components/TheLab';
import LinkedInHighlights from './components/LinkedInHighlights';
import ContactVault from './components/ContactVault';
import SkillGravityWell from './components/SkillGravityWell';
import ManVsMachine from './components/ManVsMachine';
import PipelineParadox from './components/PipelineParadox';
import TerminalOfTruth from './components/TerminalOfTruth';
import AdityaAI from './components/AdityaAI';
import { MapPin } from 'lucide-react';

const App: React.FC = () => {
  const scrollContainerRef = useRef<HTMLElement>(null);
  
  // Target the specific container for scroll progress instead of window
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  
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
    // Root container must correspond to #root height: 100%
    <div className="bg-void h-full w-full relative selection:bg-neon-cyan selection:text-void font-sans">
      
      {/* --- STATIC BACKGROUND LAYER (Z-INDEX 0) --- */}
      
      {/* Global Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Global Ambient Light Cursor */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.04), transparent 80%)`
        }}
      />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-pink to-neon-cyan transform origin-left z-50"
        style={{ scaleX: scaleX as any }}
      />

      {/* --- SCROLL SNAP CONTAINER --- */}
      <main 
        ref={scrollContainerRef}
        className="snap-container"
      >
        
        {/* SLIDE 1: Hero */}
        <section className="snap-section">
          <Hero />
        </section>

        {/* SLIDE 2: Projects */}
        <section className="snap-section bg-void">
          <Projects />
        </section>

        {/* SLIDE 3: Man Vs Machine */}
        <section className="snap-section bg-void">
          <ManVsMachine />
        </section>

        {/* SLIDE 4: Pipeline Paradox */}
        <section className="snap-section bg-void">
          <PipelineParadox />
        </section>

        {/* SLIDE 5: Social Signals */}
        <section className="snap-section bg-void">
          <LinkedInHighlights />
        </section>

        {/* SLIDE 6: Experience */}
        <section className="snap-section bg-void">
          <Experience />
        </section>

        {/* SLIDE 7: Skills */}
        <section className="snap-section bg-void">
          <SkillGravityWell />
        </section>

        {/* SLIDE 8: The Lab */}
        <section className="snap-section bg-void">
          <TheLab />
        </section>

        {/* SLIDE 9: Contact & Footer */}
        <section id="contact-section" className="snap-section bg-void !justify-between">
            <div className="flex-grow flex items-center justify-center w-full">
                <ContactVault />
            </div>
            
            <footer className="w-full py-8 border-t border-white/10 flex flex-col items-center justify-center text-gray-500 font-mono text-sm relative bg-void">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-cyan/5 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-neon-cyan" />
                    <span>Bhopal, India (Remote Ready)</span>
                </div>
                <p>© 2025 Aaditya Thakur. Built with React & Framer Motion.</p>
            </footer>
        </section>

      </main>

      {/* --- GOD MODE: TERMINAL OF TRUTH (Bottom Right) --- */}
      <TerminalOfTruth />

      {/* --- AI ASSISTANT: ADITYA CHATBOT (Bottom Left) --- */}
      <AdityaAI />
    </div>
  );
};

export default App;