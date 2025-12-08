import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Terminal, Cpu, Brain, X, GraduationCap, ChevronRight } from 'lucide-react';

// ==============================================================================
// TYPES & DATA INTERFACES
// ==============================================================================

interface ExperienceItem {
  id: string;
  title: string;
  role: string;
  timeframe: string;
  description: string;
  icon: React.ElementType;
  color: string;        // Tailwind text color class
  borderColor: string;  // Tailwind border color class
  shadowColor: string;  // Hex code for box-shadow generation
  orbitSize: number;    // Width/Height in pixels
  speed: number;        // Seconds for one full rotation
}

// ==============================================================================
// DATA SOURCE
// ==============================================================================

// The Sun (Center Node)
const RGPV_DATA: ExperienceItem = {
    id: 'rgpv',
    title: 'University',
    role: 'B.Tech CSE (AI & ML)',
    timeframe: '2024 - 2028',
    description: 'Specializing in Artificial Intelligence and Machine Learning. Building a strong foundation in algorithms, data structures, and neural network architectures while actively deploying production-grade projects.',
    icon: GraduationCap,
    color: 'text-white',
    borderColor: 'border-white',
    shadowColor: '#ffffff',
    orbitSize: 0,
    speed: 0
};

// Orbiting Planets
const PLANETS: ExperienceItem[] = [
  {
    id: 'automation',
    title: 'AI Automation',
    role: 'AI Automation Engineer',
    timeframe: 'Present',
    description: 'Architecting autonomous agents and self-healing operational loops. Bridging the gap between static scripts and intelligent, decision-making workflows using LangChain and n8n.',
    icon: Terminal,
    color: 'text-[#00f0ff]', // Fixed hex for consistency if tailwind config missing
    borderColor: 'border-[#00f0ff]',
    shadowColor: '#00f0ff',
    orbitSize: 300,
    speed: 20
  },
  {
    id: 'gcp',
    title: 'Google Cloud',
    role: 'Google Cloud Engineer',
    timeframe: '2025',
    description: 'Arcade Champion. Orchestrating enterprise-scale intelligence. Verified mastery in deploying GenAI pipelines, BigQuery clusters, and scalable cloud infrastructure.',
    icon: Cloud,
    color: 'text-blue-400',
    borderColor: 'border-blue-400',
    shadowColor: '#60a5fa',
    orbitSize: 450,
    speed: 30
  },
  {
    id: 'ibm',
    title: 'IBM',
    role: 'Data Science Intern',
    timeframe: 'July 2025',
    description: 'Developed predictive models for HR Analytics using Python/Scikit-Learn. Focused on advanced feature engineering, data preprocessing pipelines, and model optimization.',
    icon: Brain,
    color: 'text-[#bd00ff]',
    borderColor: 'border-[#bd00ff]',
    shadowColor: '#bd00ff',
    orbitSize: 600,
    speed: 40
  },
  {
    id: 'shell',
    title: 'Shell',
    role: 'Green Tech Intern',
    timeframe: 'June 2025',
    description: 'Applied regression algorithms to predict carbon emissions. Optimized model performance through rigorous hyperparameter tuning and validation strategies.',
    icon: Cpu,
    color: 'text-green-400',
    borderColor: 'border-green-400',
    shadowColor: '#4ade80',
    orbitSize: 750,
    speed: 50
  }
];

const Experience: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Logic to determine which data to show in the modal
  const activeItem = activeId === 'rgpv' ? RGPV_DATA : PLANETS.find(p => p.id === activeId);
  const isPaused = activeId !== null;

  return (
    <section className="relative w-full h-[100dvh] bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center border-t border-b border-white/5 snap-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      
      {/* Header */}
      <div className="absolute top-8 md:top-12 left-0 w-full text-center z-10 pointer-events-none px-4">
         <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
            Evolution <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bd00ff]">Protocol</span>
         </h2>
         <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
            Interactive Cyber-Solar System • Click nodes to Decrypt
         </p>
      </div>

      {/* SOLAR SYSTEM CONTAINER */}
      {/* Scaled down for mobile, full size for desktop to ensure visibility */}
      <div className="relative flex items-center justify-center transform scale-[0.4] md:scale-[0.65] lg:scale-[0.8] xl:scale-90 transition-transform duration-500">
        
        {/* --- CENTER SUN: RGPV (Clickable) --- */}
        <button
            onClick={() => setActiveId('rgpv')}
            className={`
                absolute z-20 w-40 h-40 rounded-full bg-[#0a0a0a] border-4 border-white/10 
                flex flex-col items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.15)] 
                relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:border-white/30
            `}
            aria-label="View RGPV University Details"
        >
            {/* Pulsing Rings */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 pointer-events-none" />
            <div className="absolute -inset-4 rounded-full border border-white/5 animate-[spin_10s_linear_infinite] pointer-events-none" />
            
            <GraduationCap size={40} className="text-white mb-2 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            <div className="text-center relative z-10">
                <h3 className="text-2xl font-black text-white leading-none tracking-tighter">RGPV</h3>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1 block">University</span>
            </div>
            
            <div className="absolute -bottom-16 w-max px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                Click for Details
            </div>
        </button>

        {/* --- ORBITS & PLANETS LOOP --- */}
        {PLANETS.map((planet) => (
            <React.Fragment key={planet.id}>
                
                {/* 1. Visible Orbital Path (Ring) */}
                <div 
                    className="absolute rounded-full border border-white/10 pointer-events-none"
                    style={{
                        width: planet.orbitSize,
                        height: planet.orbitSize,
                        boxShadow: activeId === planet.id ? `0 0 30px ${planet.shadowColor}40` : 'none',
                        transition: 'box-shadow 0.5s ease'
                    }}
                />

                {/* 2. Rotating Wrapper (The Orbit Animation) */}
                {/* pointer-events-none ensures the invisible rotating box doesn't block clicks on other elements */}
                <div 
                    className="absolute rounded-full flex items-start justify-center pointer-events-none"
                    style={{
                        width: planet.orbitSize,
                        height: planet.orbitSize,
                        animation: `orbit ${planet.speed}s linear infinite`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                        zIndex: activeId === planet.id ? 50 : 30
                    }}
                >
                    {/* 3. The Planet Node (Counter-Rotating) */}
                    {/* pointer-events-auto re-enables clicking on the button itself */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveId(planet.id);
                        }}
                        className={`
                            pointer-events-auto
                            relative -mt-[30px] w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full bg-[#0a0a0a] 
                            border-2 ${planet.borderColor} flex items-center justify-center 
                            transition-all duration-300 group cursor-pointer
                            hover:scale-125 hover:shadow-[0_0_40px_${planet.shadowColor}]
                            ${activeId === planet.id ? 'scale-125 shadow-[0_0_60px_' + planet.shadowColor + ']' : 'shadow-[0_0_15px_' + planet.shadowColor + '40]'}
                        `}
                        style={{
                            // Counter-rotate to keep icon upright
                            animation: `counter-orbit ${planet.speed}s linear infinite`,
                            animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                        aria-label={`View ${planet.title} Experience`}
                    >
                        {/* Glow effect inside planet */}
                        <div className={`absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity ${planet.color.replace('text-', 'bg-')}`} />
                        
                        <planet.icon size={28} className={`${planet.color} relative z-10`} />

                        {/* Label Badge (Hidden when active to show modal instead) */}
                        {activeId !== planet.id && (
                            <div className={`
                                absolute top-full mt-3 px-3 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md
                                text-[9px] font-mono uppercase tracking-widest text-white whitespace-nowrap
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                            `}>
                                {planet.title}
                            </div>
                        )}
                    </button>
                </div>
            </React.Fragment>
        ))}
      </div>

      {/* --- GLASSMORPHISM DETAIL MODAL --- */}
      <AnimatePresence>
        {activeItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setActiveId(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 50, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        w-full max-w-lg bg-[#0a0a0a] border ${activeItem.borderColor} 
                        rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden
                    `}
                    style={{ boxShadow: `0 0 100px -20px ${activeItem.shadowColor}80` }}
                >
                    {/* Animated Modal Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_6s_linear_infinite] pointer-events-none" />
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => setActiveId(null)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors hover:rotate-90 duration-300"
                    >
                        <X size={24} />
                    </button>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                            <div className={`
                                p-5 rounded-2xl bg-white/5 border border-white/10 
                                ${activeItem.color} shadow-[0_0_30px_${activeItem.shadowColor}20]
                            `}>
                                <activeItem.icon size={36} />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{activeItem.role}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeItem.color} bg-white/5 border ${activeItem.borderColor}`}>
                                        {activeItem.title}
                                    </span>
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                                        {activeItem.timeframe}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pl-6 border-l-2 border-white/10 space-y-4">
                            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Mission Briefing</h4>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                {activeItem.description}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/10">
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                Status: <span className="text-green-400">Mission Accomplished</span>
                            </span>
                            <button 
                                onClick={() => setActiveId(null)}
                                className={`
                                    flex items-center gap-2 text-xs font-bold uppercase tracking-wider 
                                    ${activeItem.color} hover:brightness-125 transition-all
                                `}
                            >
                                Resume Orbit <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes counter-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Experience;