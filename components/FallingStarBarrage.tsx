import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  trailColor: string;
  opacity: number;
  trailLength: number;
  isLeader: boolean;
}

/**
 * @file Renders a dynamic, full-screen canvas animation of a falling star barrage (meteor shower).
 * @module FallingStarBarrage
 */

/**
 * The FallingStarBarrage component creates a visually stunning, periodic meteor shower effect
 * that plays in the background of the entire application. It uses the HTML Canvas API
 * to render stars with trails and glows, creating a sense of depth and motion.
 *
 * The animation is self-contained and does not require any props.
 *
 * @returns {React.ReactElement} A canvas element that covers the viewport and renders the animation.
 */
const FallingStarBarrage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let animationFrameId: number;
    let lastTime = 0;
    let barrageTimer = 0; 
    const barrageInterval = 10000; // 10 Seconds Delay

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const spawnBarrage = () => {
      // Spawn Origin: Top Right (offscreen)
      // Target Direction: Bottom Left
      
      const startX = canvas.width + 200; // Start further offscreen
      const startY = -200; 
      
      // Calculate a random slight variation in angle
      const speed = 20; // Faster for more impact
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.1; // ~45 degrees
      const vx = -Math.cos(angle) * speed; // Move Left
      const vy = Math.sin(angle) * speed;  // Move Down

      // 1. The Leader Star (Massive, Star-Shaped, Long Trail)
      stars.push({
        x: startX,
        y: startY,
        vx: vx,
        vy: vy,
        size: 8, // Much larger
        color: '#ffffff',
        trailColor: '#ff00aa', 
        opacity: 1,
        trailLength: 600, // Longer trail
        isLeader: true
      });

      // 2. The Followers (Cluster of debris)
      const followerCount = Math.floor(Math.random() * 5) + 6; // 6 to 10 stars
      for (let i = 0; i < followerCount; i++) {
        const lag = (Math.random() * 150) + 50; 
        const spread = (Math.random() - 0.5) * 100; 
        
        stars.push({
          x: startX + lag + spread,
          y: startY - lag + spread, 
          vx: vx * (0.8 + Math.random() * 0.2), 
          vy: vy * (0.8 + Math.random() * 0.2),
          size: Math.random() * 2.5 + 1.5, // Bigger followers
          color: '#ffe6f2', // Pale pink
          trailColor: '#ffb6c1',
          opacity: 1,
          trailLength: 200 + Math.random() * 150,
          isLeader: false
        });
      }
    };

    const drawStarShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
        // Draw a 4-point star (diffraction spike)
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ffffff';
        
        // Core
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Spikes
        ctx.beginPath();
        // Vertical spike
        ctx.moveTo(0, -size * 2);
        ctx.quadraticCurveTo(size * 0.2, 0, 0, size * 2);
        ctx.quadraticCurveTo(-size * 0.2, 0, 0, -size * 2);
        
        // Horizontal spike
        ctx.moveTo(-size * 2, 0);
        ctx.quadraticCurveTo(0, size * 0.2, size * 2, 0);
        ctx.quadraticCurveTo(0, -size * 0.2, -size * 2, 0);
        
        ctx.fill();
        ctx.restore();
    };

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Periodic Timer
      barrageTimer += deltaTime;
      if (barrageTimer > barrageInterval) {
        spawnBarrage();
        barrageTimer = 0;
      }

      // Update & Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.x += star.vx;
        star.y += star.vy;

        // Fade Logic
        if (star.y > canvas.height + 300 || star.x < -300) {
          star.opacity = 0;
        } else if (star.y > canvas.height * 0.6 || star.x < canvas.width * 0.2) {
           star.opacity -= 0.008;
        }

        if (star.opacity > 0) {
            ctx.globalAlpha = Math.max(0, star.opacity);
            
            // Calculate tail
            const vLen = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
            const nx = star.vx / vLen;
            const ny = star.vy / vLen;
            
            const tailX = star.x - (nx * star.trailLength);
            const tailY = star.y - (ny * star.trailLength);

            // Draw Trail
            const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
            gradient.addColorStop(0, star.color);
            if (star.isLeader) {
                 gradient.addColorStop(0.05, '#ffffff');
                 gradient.addColorStop(0.2, '#ff00aa'); // Neon Pink
                 gradient.addColorStop(0.5, '#bd00ff'); // Purple tail
                 gradient.addColorStop(1, 'transparent');
            } else {
                 gradient.addColorStop(0, 'rgba(255,182,193,0.8)');
                 gradient.addColorStop(1, 'transparent');
            }

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.isLeader ? star.size : star.size * 0.8;
            ctx.lineCap = 'round';
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Draw Head
            if (star.isLeader) {
                // Glow
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#00f0ff'; // Cyan glow mix
                drawStarShape(ctx, star.x, star.y, star.size, star.opacity);
                ctx.shadowBlur = 0;
            } else {
                ctx.beginPath();
                ctx.fillStyle = '#ffffff';
                ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Garbage Collection
        if (star.opacity <= 0) {
          stars.splice(i, 1);
          i--;
        }
      }
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
      style={{ mixBlendMode: 'screen' }} 
    />
  );
};

export default FallingStarBarrage;