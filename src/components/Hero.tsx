import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

/**
 * SparklesCore Component
 *
 * Renders an animated particle background using HTML5 Canvas.
 * Creates a "sparkle" or "starfield" effect with neon cyan particles
 * that bounce off the screen edges.
 */
const SparklesCore = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    let animationId: number;

    const createParticles = () => {
      const particleCount = 100;
      particles = []; // Clear existing particles
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random(),
        });
      }
    };

    const resize = () => {
      // High DPI (Retina) Display Support
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Scale context to ensure drawing operations match CSS pixels
      ctx.scale(dpr, dpr);
      
      // Re-initialize particles to fit new bounds
      createParticles();
    };

    const animate = () => {
      // Clear canvas (using logic width/height not physical)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Bounce off walls
        if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * 0.5})`; // Neon Cyan #00f0ff
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Occasional shimmer
        if (Math.random() > 0.995) {
            p.opacity = Math.random();
        }
      });
      animationId = requestAnimationFrame(animate);
    };

    // Initial setup
    resize();
    animate();
    
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50 pointer-events-none" />;
};

/**
 * Hero Component
 *
 * The main landing section of the portfolio.
 *
 * Features:
 * - Full-screen layout.
 * - Interactive particle background (`SparklesCore`).
 * - Typewriter effect for the tagline.
 * - "Ghost" text heading with gradient effects.
 * - Social media links.
 * - Status indicators (Available for Hire, Remote Ready).
 */
const Hero: React.FC = () => {
  // Typewriter State
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Building Autonomous Agents & Scalable AI Systems";
  const typingSpeed = 60; // refined speed (ms per char)
  const deletingSpeed = 30; // fast delete
  const pauseTime = 3500; // wait time before delete

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleType = () => {
      const currentIdx = displayText.length;

      if (!isDeleting) {
        // Typing Phase
        if (currentIdx < fullText.length) {
          setDisplayText(fullText.substring(0, currentIdx + 1));
          timer = setTimeout(handleType, typingSpeed);
        } else {
          // Finished typing, wait before deleting
          timer = setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting Phase
        if (currentIdx > 0) {
          setDisplayText(fullText.substring(0, currentIdx - 1));
          timer = setTimeout(handleType, deletingSpeed);
        } else {
          // Finished deleting, restart loop
          setIsDeleting(false);
          timer = setTimeout(handleType, typingSpeed);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);


  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <SparklesCore />
      
      {/* Social Navigation - Stuck to Hero */}
      <nav className="absolute top-6 right-6 z-50 flex gap-4 backdrop-blur-md bg-black/50 p-2 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <a href="https://github.com/aditya452007" target="_blank" rel="noreferrer" aria-label="GitHub Profile" className="p-2 text-gray-400 hover:text-[#00f0ff] transition-colors">
          <Github size={20} />
        </a>
        <a href="https://linkedin.com/in/aaditya-thakur-1a8842332" target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="p-2 text-gray-400 hover:text-[#ff0099] transition-colors">
          <Linkedin size={20} />
        </a>
        <a href="mailto:adityathakur452007@gmail.com" aria-label="Send Email" className="p-2 text-gray-400 hover:text-[#bd00ff] transition-colors">
          <Mail size={20} />
        </a>
      </nav>
      
      {/* ✅ FIX 1: Increased max-width to 7xl to allow text to spread out */}
      <div className="z-10 text-center px-4 max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block mb-8"
        >
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#ff0099] opacity-20 blur-lg animate-pulse"></div>
          <span className="relative px-4 py-1 rounded-full border border-[#00f0ff]/30 bg-black/80 text-[#00f0ff] font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            Open to Work • AI Automation Engineer
          </span>
        </motion.div>

        {/* Ghost Text Heading */}
        <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            /* ✅ FIX 2: Added 'whitespace-nowrap' to force single line */
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 cursor-default whitespace-nowrap"
        >
          {/* ✅ FIX 3: Changed gradient from-white/5 to from-neutral-400 so name is visible */}
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-700 hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] selection:bg-[#ff0099] selection:text-white">
            AADITYA THAKUR
          </span>
        </motion.h1>

        {/* Animated Typewriter Tagline */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-24 md:h-16 flex items-center justify-center"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono tracking-tight">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff0099]">
               {displayText}
             </span>
             <span className="inline-block w-3 h-8 md:h-10 ml-1 bg-[#ff0099]/80 animate-pulse align-middle shadow-[0_0_10px_rgba(255,0,170,0.5)]" />
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center gap-6 text-xs md:text-sm font-mono text-gray-600 uppercase tracking-widest"
        >
            <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                Available for Hire
            </span>
             <span className="hidden md:inline opacity-30">|</span>
             <span>Based in India</span>
             <span className="hidden md:inline opacity-30">|</span>
             <span>Remote Native</span>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;