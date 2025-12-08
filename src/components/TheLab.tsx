import React, { useEffect, useRef } from 'react';
import { ExternalLink, Zap, FlaskConical } from 'lucide-react';

// ==============================================================================
// TYPES & DATA
// ==============================================================================

/**
 * Represents a project in "The Lab".
 */
interface LabProject {
  /** Unique ID of the project. */
  id: string;
  /** Title of the project. */
  title: string;
  /** URL to the project/experiment. */
  url: string;
  /** Tailwind class for start of gradient. */
  gradientFrom: string; 
  /** Tailwind class for end of gradient. */
  gradientTo: string;
  /** RGBA color string for the glow effect. */
  glowColor: string; 
}

const projects: LabProject[] = [
  { 
    id: 'n8n', 
    title: 'N8N AI AGENTS', 
    url: 'https://github.com/aditya452007/N8N_AI_AGENTS',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-blue-600',
    glowColor: 'rgba(34, 211, 238, 0.8)' 
  },
  { 
    id: 'gemini', 
    title: 'Gemini 3 Pro Game', 
    url: 'https://github.com/aditya452007/Ai-Experiment',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.8)'
  },
  { 
    id: 'support', 
    title: 'Customer Support Agent', 
    url: 'https://github.com/aditya452007/Ai-Agents/blob/main/Google%20Adk/customer-support-agent.ipynb',
    gradientFrom: 'from-lime-400',
    gradientTo: 'to-green-600',
    glowColor: 'rgba(163, 230, 53, 0.8)'
  },
  { 
    id: 'rag', 
    title: 'RAG Agents', 
    url: 'https://github.com/aditya452007/Ai-Agents/tree/main/RAG',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-rose-600',
    glowColor: 'rgba(236, 72, 153, 0.8)'
  },
  { 
    id: 'chat', 
    title: 'Av-Chatfriends', 
    url: 'https://github.com/aditya452007/Ai-Agents/tree/main/Av-Chatfriends',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-indigo-600',
    glowColor: 'rgba(96, 165, 250, 0.8)'
  },
  { 
    id: 'prompt', 
    title: 'Prompt Library', 
    url: 'https://github.com/aditya452007/Prompt-Library',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-orange-500',
    glowColor: 'rgba(250, 204, 21, 0.8)'
  },
];

/**
 * Represents a physics particle for the floating effect.
 */
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

// ==============================================================================
// COMPONENT
// ==============================================================================

/**
 * TheLab Component
 *
 * A physics-based "zero-gravity" playground where experimental projects float around.
 * The projects are represented as cards that bounce off the walls and each other.
 * Hovering over a card pauses its motion.
 */
const TheLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const elementsRef = useRef<(HTMLAnchorElement | null)[]>([]); 
  const requestRef = useRef<number>(0);

  // Initialize Physics
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initParticles = () => {
      const { width, height } = container.getBoundingClientRect();
      const particleSize = 160; 
      const radius = particleSize / 2;

      particlesRef.current = projects.map((project, i) => ({
        x: Math.random() * (width - particleSize - 40) + radius + 20,
        y: Math.random() * (height - particleSize - 40) + radius + 20,
        vx: (Math.random() - 0.5) * 1.0, 
        vy: (Math.random() - 0.5) * 1.0,
        radius: radius,
        element: elementsRef.current[i] || null, 
        id: project.id,
        isHovered: false,
      }));
    };

    initParticles();

    const animate = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const particles = particlesRef.current;

      // 1. Update Positions & Wall Collisions
      particles.forEach(p => {
        if (p.isHovered) return;

        p.x += p.vx;
        p.y += p.vy;

        // Wall Bounce
        if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; }
        else if (p.x + p.radius > width) { p.x = width - p.radius; p.vx *= -1; }

        if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; }
        else if (p.y + p.radius > height) { p.y = height - p.radius; p.vy *= -1; }
      });

      // 2. Object Collisions
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          if (p1.isHovered || p2.isHovered) continue;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = p1.radius + p2.radius;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const nx = dx / distance;
            const ny = dy / distance;
            
            p1.x -= nx * overlap * 0.5;
            p1.y -= ny * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;

            const v1n = p1.vx * nx + p1.vy * ny;
            const v2n = p2.vx * nx + p2.vy * ny;
            const tx = -ny;
            const ty = nx;
            const v1t = p1.vx * tx + p1.vy * ty;
            const v2t = p2.vx * tx + p2.vy * ty;

            p1.vx = v2n * nx + v1t * tx;
            p1.vy = v2n * ny + v1t * ty;
            p2.vx = v1n * nx + v2t * tx;
            p2.vy = v1n * ny + v2t * ty;
          }
        }
      }

      // 3. Render
      particles.forEach(p => {
        if (p.element) {
          const domX = p.x - p.radius;
          const domY = p.y - p.radius;
          p.element.style.transform = `translate3d(${domX}px, ${domY}px, 0)`;
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
       // Optional: Logic to re-center particles on resize
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
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#050505] flex flex-col items-center justify-center py-12">
      
      {/* Background Decor - RGB Plasma Field */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] animate-pulse delay-700" />
      </div>
      
      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="z-20 text-center mb-8 pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white flex items-center justify-center gap-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <FlaskConical size={40} className="text-[#00f0ff] animate-bounce" />
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bd00ff]">LAB</span>
        </h2>
        <p className="text-gray-500 font-mono text-xs md:text-sm tracking-[0.4em] uppercase mt-4">
            Zero-G Experiments • Floating Data
        </p>
      </div>

      {/* Physics Container */}
      <div 
        ref={containerRef} 
        className="relative w-full max-w-7xl h-full mx-auto overflow-hidden"
      >
        {projects.map((project, index) => (
            <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                ref={(el) => (elementsRef.current[index] = el)}
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={() => handleMouseLeave(project.id)}
                className={`
                    absolute top-0 left-0 w-[160px] h-[160px] 
                    flex flex-col items-center justify-center p-1 text-center cursor-pointer 
                    transition-all duration-300 hover:scale-125 hover:z-50 group will-change-transform
                `}
            >
                {/* 1. RGB SPINNING BORDER (The Lightning) */}
                <div 
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.gradientFrom} ${project.gradientTo} opacity-40 blur-md group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse`} 
                />
                
                {/* 2. THE CARD BODY */}
                <div className="relative w-full h-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Pulsifactor (Inner Breathing Glow) */}
                    <div 
                        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at center, ${project.glowColor}, transparent 70%)` }}
                    />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 p-4">
                        <div className={`w-12 h-1 mb-3 rounded-full bg-gradient-to-r ${project.gradientFrom} ${project.gradientTo}`} />
                        <h3 className="text-xs md:text-sm font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all uppercase tracking-wider">
                            {project.title}
                        </h3>
                    </div>

                    {/* Corner Tech Decorations */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                    
                    {/* Hover Reveal Icon */}
                    <div className="absolute bottom-2 right-2 opacity-30 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-45">
                        <ExternalLink size={12} className="text-white" />
                    </div>
                </div>
            </a>
        ))}
      </div>

      <div className="absolute bottom-8 text-gray-600 font-mono text-[10px] uppercase tracking-widest pointer-events-none flex items-center gap-2">
          <Zap size={12} className="text-[#00f0ff] animate-pulse" /> 
          Subject to Elastic Collision
          <Zap size={12} className="text-[#00f0ff] animate-pulse" /> 
      </div>
    </section>
  );
};

export default TheLab;