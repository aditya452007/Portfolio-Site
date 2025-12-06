import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';

interface LabProject {
  id: string;
  title: string;
  url: string;
  color: string; // Tailwind border color class
  glow: string; // CSS shadow string
}

const projects: LabProject[] = [
  { 
    id: 'n8n', 
    title: 'N8N AI AGENTS', 
    url: 'https://github.com/aditya452007/N8N_AI_AGENTS',
    color: 'border-neon-cyan',
    glow: 'rgba(0, 240, 255, 0.4)'
  },
  { 
    id: 'gemini', 
    title: 'Gemini 3 Pro Game', 
    url: 'https://github.com/aditya452007/Ai-Experiment',
    color: 'border-neon-purple',
    glow: 'rgba(189, 0, 255, 0.4)'
  },
  { 
    id: 'support', 
    title: 'Customer Support Agent', 
    url: 'https://github.com/aditya452007/Ai-Agents/blob/main/Google%20Adk/customer-support-agent.ipynb',
    color: 'border-lime-400',
    glow: 'rgba(163, 230, 53, 0.4)'
  },
  { 
    id: 'rag', 
    title: 'RAG Agents', 
    url: 'https://github.com/aditya452007/Ai-Agents/tree/main/RAG',
    color: 'border-neon-pink',
    glow: 'rgba(255, 0, 170, 0.4)'
  },
  { 
    id: 'chat', 
    title: 'Av-Chatfriends', 
    url: 'https://github.com/aditya452007/Ai-Agents/tree/main/Av-Chatfriends',
    color: 'border-blue-400',
    glow: 'rgba(96, 165, 250, 0.4)'
  },
  { 
    id: 'prompt', 
    title: 'Prompt Library', 
    url: 'https://github.com/aditya452007/Prompt-Library',
    color: 'border-yellow-400',
    glow: 'rgba(250, 204, 21, 0.4)'
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  element: HTMLAnchorElement | null;
  id: string;
  isHovered: boolean;
}

const TheLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  // Initialize Physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initParticles = () => {
      const { width, height } = container.getBoundingClientRect();
      const particleSize = 140; // Approx width/height of the square
      const radius = particleSize / 2;

      particlesRef.current = projects.map((project) => ({
        x: Math.random() * (width - particleSize) + radius,
        y: Math.random() * (height - particleSize) + radius,
        vx: (Math.random() - 0.5) * 1.5, // Low velocity drift
        vy: (Math.random() - 0.5) * 1.5,
        radius: radius, // Treat as circle for physics math
        element: null, // Linked via ref callback
        id: project.id,
        isHovered: false,
      }));
    };

    initParticles();

    const animate = () => {
      const { width, height } = container.getBoundingClientRect();
      const particles = particlesRef.current;

      // 1. Update Positions & Wall Collisions
      particles.forEach(p => {
        if (p.isHovered) return; // Pause physics on hover

        p.x += p.vx;
        p.y += p.vy;

        // Wall Bounce (X)
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx *= -1;
        } else if (p.x + p.radius > width) {
          p.x = width - p.radius;
          p.vx *= -1;
        }

        // Wall Bounce (Y)
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy *= -1;
        } else if (p.y + p.radius > height) {
          p.y = height - p.radius;
          p.vy *= -1;
        }
      });

      // 2. Object Collisions (Circle Approximation)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = p1.radius + p2.radius;

          if (distance < minDistance) {
            // Collision Detected
            // Resolve Overlap
            const overlap = minDistance - distance;
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Push apart proportional to mass (equal mass here)
            p1.x -= nx * overlap * 0.5;
            p1.y -= ny * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;

            // Elastic Collision Response (Swap Normal Velocities)
            // Normal Velocity
            const v1n = p1.vx * nx + p1.vy * ny;
            const v2n = p2.vx * nx + p2.vy * ny;

            // Tangent Velocity (unchanged)
            const tx = -ny;
            const ty = nx;
            const v1t = p1.vx * tx + p1.vy * ty;
            const v2t = p2.vx * tx + p2.vy * ty;

            // Swap normal components
            const v1nFinal = v2n;
            const v2nFinal = v1n;

            // Convert back to x/y
            p1.vx = v1nFinal * nx + v1t * tx;
            p1.vy = v1nFinal * ny + v1t * ty;
            p2.vx = v2nFinal * nx + v2t * tx;
            p2.vy = v2nFinal * ny + v2t * ty;
          }
        }
      }

      // 3. Render
      particles.forEach(p => {
        if (p.element) {
          // Translate from center to top-left for DOM positioning
          const domX = p.x - p.radius;
          const domY = p.y - p.radius;
          p.element.style.transform = `translate3d(${domX}px, ${domY}px, 0)`;
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
        // Reset particles if resized significantly to prevent getting stuck
        initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    const p = particlesRef.current.find(p => p.id === id);
    if (p) p.isHovered = true;
  };

  const handleMouseLeave = (id: string) => {
    const p = particlesRef.current.find(p => p.id === id);
    if (p) p.isHovered = false;
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-void flex flex-col items-center justify-center py-12">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <div className="z-20 text-center mb-8 pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white flex items-center justify-center gap-3">
            <Code2 className="text-neon-cyan animate-pulse" />
            THE LAB
        </h2>
        <p className="text-gray-500 font-mono text-sm tracking-[0.3em] uppercase mt-2">
            Zero-G Experiments • Floating Data
        </p>
      </div>

      {/* Physics Container */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-6xl h-full border-t border-b border-white/5 bg-white/0 mx-auto overflow-hidden"
      >
        {projects.map((project, index) => (
            <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                ref={(el) => {
                    if (particlesRef.current[index]) {
                        particlesRef.current[index].element = el;
                    }
                }}
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={() => handleMouseLeave(project.id)}
                className={`absolute top-0 left-0 w-[140px] h-[140px] rounded-2xl bg-void/90 backdrop-blur-md border ${project.color} flex flex-col items-center justify-center p-4 text-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 hover:z-50 group will-change-transform`}
                style={{ 
                    // Initial glow
                    boxShadow: `0 0 15px ${project.glow}`
                }}
            >
                {/* Inner Glow on Hover */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                    style={{ backgroundColor: project.glow }}
                />
                
                <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors relative z-10">
                    {project.title}
                </h3>
                
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                    <ExternalLink size={16} className="text-white" />
                </div>

                {/* Decorative Corner Markers */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-white/50" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-white/50" />
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50" />
                <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/50" />
            </a>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-8 text-gray-600 font-mono text-[10px] uppercase tracking-widest pointer-events-none">
          Subject to Elastic Collision
      </div>
    </section>
  );
};

export default TheLab;