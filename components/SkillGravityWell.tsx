
import React, { useEffect, useRef } from 'react';

// Color Palette Definitions
const PALETTE = {
  // AI & GenAI (Ethereal Purple/Blue)
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  // Python & Backend (Toxic Green/Yellow)
  lime: '#84cc16',
  green: '#10b981',
  // Cloud & Data (Hot Pink/Orange)
  pink: '#ec4899',
  orange: '#f97316',
};

interface Skill {
  name: string;
  tier: 1 | 2 | 3; // 1 = Heavy/Fast, 2 = Medium, 3 = Light/Slow
  color: string;
}

const SKILL_DATA: Skill[] = [
  // --------------------------
  // Tier 1: Heavy (Core Tech)
  // --------------------------
  { name: 'Python', tier: 1, color: PALETTE.lime },
  { name: 'GenAI', tier: 1, color: PALETTE.violet },
  { name: 'AI Agents', tier: 1, color: PALETTE.cyan },
  { name: 'Prompt Eng', tier: 1, color: PALETTE.violet },
  { name: 'RAG Systems', tier: 1, color: PALETTE.pink },
  { name: 'Google Cloud', tier: 1, color: PALETTE.orange },
  { name: 'Machine Learning', tier: 1, color: PALETTE.pink },
  { name: 'Automation', tier: 1, color: PALETTE.green },
  // --------------------------
  // Tier 2: Medium (Tools/Platforms)
  // --------------------------
  { name: 'RAG Pipeline', tier: 2, color: PALETTE.cyan },
  { name: 'Data Science', tier: 2, color: PALETTE.pink },
  { name: 'MCP Protocol', tier: 2, color: PALETTE.violet },
  { name: 'LangChain', tier: 2, color: PALETTE.cyan },
  // --------------------------
  // Tier 3: Light (Infra/Misc)
  // --------------------------
  { name: 'Docker', tier: 3, color: PALETTE.lime },
  { name: 'SQL', tier: 3, color: PALETTE.orange },
  { name: 'Git', tier: 3, color: PALETTE.green },
  { name: 'Cloud Architecture', tier: 3, color: PALETTE.pink },
];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  mass: number;
  text: string;
  friction: number;
  tier: number;
  angle: number; // For pulse animation

  constructor(canvasWidth: number, canvasHeight: number, skill: Skill) {
    this.x = Math.random() * (canvasWidth - 100) + 50;
    this.y = Math.random() * (canvasHeight - 100) + 50;
    this.text = skill.name;
    this.tier = skill.tier;
    this.color = skill.color;
    this.angle = Math.random() * Math.PI * 2;

    // Physics Properties based on Tier - SIZES INCREASED for visibility
    if (skill.tier === 1) {
      this.mass = 6;
      this.baseRadius = 50; 
      this.friction = 0.95; 
    } else if (skill.tier === 2) {
      this.mass = 4;
      this.baseRadius = 40; 
      this.friction = 0.93;
    } else {
      this.mass = 2;
      this.baseRadius = 32; 
      this.friction = 0.90; 
    }
    this.radius = this.baseRadius;

    // Initial Drift
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update(
    ctx: CanvasRenderingContext2D, 
    mouse: { x: number; y: number; isActive: boolean; isDown: boolean },
    canvasWidth: number,
    canvasHeight: number,
    allParticles: Particle[]
  ) {
    // 0. Pulsing Animation (Breathing effect)
    this.angle += 0.02;
    const pulse = Math.sin(this.angle) * 2;
    this.radius = this.baseRadius + pulse;

    // 1. Calculate External Forces (Mouse)
    if (mouse.isActive) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      if (mouse.isDown) {
        // SINGULARITY (Click & Hold) - Strong Pull
        const force = 5 / (Math.max(dist, 50) * 0.05);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      } else {
        // EVENT HORIZON (Hover) - Gentle Orbit
        const force = (this.mass * 0.2) / (Math.max(dist, 150) * 0.01);
        
        if (dist > 60) {
            this.vx += Math.cos(angle) * force * 0.8;
            this.vy += Math.sin(angle) * force * 0.8;
            // Tangent force for rotation
            this.vx -= Math.sin(angle) * force * 0.5;
            this.vy += Math.cos(angle) * force * 0.5;
        }
      }
    }

    // 2. Resolve Collisions (Particle vs Particle)
    for (const other of allParticles) {
        if (other === this) continue;

        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.radius + other.radius + 5; // +5 padding

        if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDistance - distance;
            
            const moveX = Math.cos(angle) * overlap * 0.5;
            const moveY = Math.sin(angle) * overlap * 0.5;
            this.x -= moveX;
            this.y -= moveY;
            other.x += moveX;
            other.y += moveY;

            // Elastic Bounce
            const nx = dx / distance;
            const ny = dy / distance;
            const dvx = this.vx - other.vx;
            const dvy = this.vy - other.vy;
            const p = 2 * (nx * dvx + ny * dvy) / (this.mass + other.mass);

            this.vx -= p * other.mass * nx * 0.8;
            this.vy -= p * other.mass * ny * 0.8;
            other.vx += p * this.mass * nx * 0.8;
            other.vy += p * this.mass * ny * 0.8;
        }
    }

    // 3. Update Physics
    this.vx *= this.friction;
    this.vy *= this.friction;
    
    // Clamp max speed
    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    const maxSpeed = mouse.isDown ? 15 : 2.5; 
    if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    // 4. Wall Collisions
    const padding = this.radius;
    if (this.x < padding) { this.x = padding; this.vx *= -1; }
    if (this.x > canvasWidth - padding) { this.x = canvasWidth - padding; this.vx *= -1; }
    if (this.y < padding) { this.y = padding; this.vy *= -1; }
    if (this.y > canvasHeight - padding) { this.y = canvasHeight - padding; this.vy *= -1; }

    // 5. Draw
    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 1. Outer Glow (Bioluminescence)
    ctx.shadowBlur = 25;
    ctx.shadowColor = this.color;

    // 2. Orb Body (Glass Effect with Radial Gradient)
    // Center: Semi-transparent white | Edge: Neon Color | Outside: Transparent
    const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.2, this.x, this.y, this.radius);
    
    // Core Highlight (Glass reflection)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); 
    // Body Color (Semi-transparent)
    gradient.addColorStop(0.5, this.color + '66'); // ~40% opacity hex
    // Edge (Fade out)
    gradient.addColorStop(1, this.color + '00'); // 0% opacity

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 3. Subtle Rim Light (Stroke)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color + '88'; // Semi-transparent border
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reset shadow for text to prevent muddying
    ctx.shadowBlur = 0;

    // 4. Text Rendering
    ctx.fillStyle = '#ffffff';
    const fontSize = Math.max(11, this.radius * 0.35); 
    ctx.font = `800 ${fontSize}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Heavy Black Shadow/Stroke for readability against light background
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    const words = this.text.split(' ');
    
    if (words.length > 1 && this.radius > 30) {
        const lineHeight = fontSize * 1.1;
        const totalHeight = lineHeight * words.length;
        let startY = this.y - (totalHeight / 2) + (lineHeight / 2);
        
        words.forEach((word, index) => {
            const yPos = startY + (index * lineHeight);
            ctx.strokeText(word, this.x, yPos); 
            ctx.fillText(word, this.x, yPos); 
        });
    } else {
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
    }
  }

  explode(mouse: { x: number; y: number }) {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const angle = Math.atan2(dy, dx);
    const force = (30 + Math.random() * 20); 
    this.vx = Math.cos(angle) * force;
    this.vy = Math.sin(angle) * force;
  }
}

const SkillGravityWell: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      if (particlesRef.current.length === 0) {
        initParticles();
      }
    };

    const initParticles = () => {
      particlesRef.current = SKILL_DATA.map(skill => 
        new Particle(canvas.width, canvas.height, skill)
      );
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const allParticles = particlesRef.current;
      allParticles.forEach(p => {
        p.update(ctx, mouseRef.current, canvas.width, canvas.height, allParticles);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => { mouseRef.current.isActive = true; };
    const handleMouseLeave = () => { mouseRef.current.isActive = false; mouseRef.current.isDown = false; };
    const handleMouseDown = () => { mouseRef.current.isDown = true; };
    const handleMouseUp = () => { 
        if (mouseRef.current.isDown) {
            particlesRef.current.forEach(p => p.explode(mouseRef.current));
        }
        mouseRef.current.isDown = false; 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[600px] bg-[#050505] overflow-hidden flex flex-col items-center justify-center border-t border-b border-white/5">
        
        {/* Header Overlay */}
        <div className="absolute top-8 z-10 text-center pointer-events-none select-none">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
                Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Singularity</span>
            </h2>
            <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase mt-2">
                Interactive Gravity Well • Hold Click to Collapse
            </p>
        </div>

        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 cursor-crosshair touch-none"
        />
        
        {/* Mobile Hint */}
        <div className="absolute bottom-4 text-white/20 font-mono text-[9px] uppercase tracking-widest pointer-events-none md:hidden">
            Touch & Hold to Interact
        </div>
    </section>
  );
};

export default SkillGravityWell;