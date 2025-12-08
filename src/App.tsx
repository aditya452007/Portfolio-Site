import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MapPin } from 'lucide-react';

// Component Imports
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import TheLab from './components/TheLab';
import LinkedInHighlights from './components/LinkedInHighlights';
import ContactVault from './components/ContactVault';
import SkillGravityWell from './components/SkillGravityWell';
import ManVsMachine from './components/ManVsMachine';
import TerminalOfTruth from './components/TerminalOfTruth';
import AdityaAI from './components/AdityaAI';

const App: React.FC = () => {
  // Track window scroll for the top progress bar
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Ref for the background gradient (Performance Optimization)
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM update to avoid re-rendering the entire React tree on every pixel move
      if (backgroundRef.current) {
        backgroundRef.current.style.background = `radial-gradient(800px at ${e.clientX}px ${e.clientY}px, rgba(0, 240, 255, 0.04), transparent 80%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen w-full relative selection:bg-[#00f0ff] selection:text-black font-sans">
      
      {/* --- BACKGROUND LAYERS --- */}
      {/* Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Spotlight Effect (Optimized) */}
      <div 
        ref={backgroundRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(800px at 50% 50%, rgba(0, 240, 255, 0.04), transparent 80%)` }}
      />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#bd00ff] to-[#00f0ff] transform origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* --- CONTENT --- */}
      <main className="w-full relative z-10">
        
        {/* HERO: Full Screen */}
        <section className="min-h-screen w-full flex items-center justify-center">
            <Hero />
        </section>

        {/* PROJECTS */}
        <section className="min-h-screen w-full py-20">
            <Projects />
        </section>

        {/* MAN VS MACHINE (Automation Demo) */}
        <section className="min-h-screen w-full py-20 overflow-hidden">
            <ManVsMachine />
        </section>

        {/* EXPERIENCE (Solar System) */}
        <section className="min-h-screen w-full py-20">
            <Experience />
        </section>

        {/* SKILLS (Gravity Well) */}
        <section className="h-[80vh] min-h-[600px] w-full relative overflow-hidden">
            <SkillGravityWell />
        </section>

        {/* LAB & EXPERIMENTS */}
        <section className="min-h-screen w-full py-20">
            <TheLab />
        </section>

        {/* SOCIAL PROOF */}
        <section className="min-h-[50vh] w-full py-20">
            <LinkedInHighlights />
        </section>

        {/* CONTACT & FOOTER */}
        <section id="contact-section" className="flex flex-col min-h-screen justify-between bg-[#0a0a0a]">
            <ContactVault />
            
            <footer className="w-full py-8 border-t border-white/10 flex flex-col gap-4 items-center justify-center text-gray-500 font-mono text-xs">
                 <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <MapPin size={14} className="text-[#00f0ff]" />
                    <span>Indore / Bhopal, India (Remote Ready)</span>
                 </div>
                 <p>© 2025 Aaditya Thakur. All Systems Operational.</p>
            </footer>
        </section>

      </main>

      {/* --- OVERLAYS --- */}
      <TerminalOfTruth />
      <AdityaAI />
    </div>
  );
};

export default App;