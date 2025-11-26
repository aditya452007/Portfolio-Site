import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SparklesCore = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = 100;
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity * 0.5})`; // Neon Cyan
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

    resize();
    createParticles();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />;
};

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
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-void">
      <SparklesCore />
      
      <div className="z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block mb-8"
        >
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-pink opacity-20 blur-lg animate-pulse"></div>
          <span className="relative px-4 py-1 rounded-full border border-neon-cyan/30 bg-void/80 text-neon-cyan font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            Open to Work • AI Automation Engineer
          </span>
        </motion.div>

        {/* Ghost Text Heading - Refined to Ethereal Fade */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 cursor-default"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white/5 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-700 hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] selection:bg-neon-pink selection:text-white">
            AADITYA THAKUR
          </span>
        </motion.h1>

        {/* Animated Typewriter Tagline - Refined Gradients */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-24 md:h-16 flex items-center justify-center"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono tracking-tight">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink">
               {displayText}
             </span>
             <span className="inline-block w-3 h-8 md:h-10 ml-1 bg-neon-pink/80 animate-pulse align-middle shadow-[0_0_10px_rgba(255,0,170,0.5)]" />
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
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-void via-void/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;