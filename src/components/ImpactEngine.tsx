"use client";

import React, { useState, useEffect, memo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Zap, Network, ArrowRight, DollarSign, Clock } from "lucide-react";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type EngineMode = "connect" | "hire";

export default function ImpactEngine() {
  const [mode, setMode] = useState<EngineMode>("connect");

  return (
    // 1. BACKGROUND FIX: Kept transparent so App.tsx's #050505 shows through.
    // Removed the heavy glowing divs that were washing out the neon black.
    <section className="relative w-full py-32 overflow-hidden bg-transparent flex flex-col items-center select-none border-t border-white/5">
      
      {/* Subtle Noise Texture only - No color overlays */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container relative z-10 px-4 mx-auto flex flex-col items-center gap-12">
        
        {/* 2. The Hook */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            Don't just hire a Dev. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
              Simulate the Outcome.
            </span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Switch the engine below to calculate your ROI.
          </p>
        </div>

        {/* 3. The Controller */}
        <div className="relative p-1 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center gap-1 shadow-2xl">
          <SwitchButton 
            active={mode === "connect"} 
            onClick={() => setMode("connect")} 
            icon={<Network size={16} />}
            label="Connect (Clarity)"
          />
          <SwitchButton 
            active={mode === "hire"} 
            onClick={() => setMode("hire")} 
            icon={<Zap size={16} />}
            label="Hire (Velocity)"
          />
        </div>

        {/* 4. The Active Simulator - PERFORMANCE ARCHITECTURE */}
        {/* We use a fixed height container. Both cards exist. We just fade opacity. */}
        <div className="w-full max-w-5xl h-[600px] md:h-[550px] relative mt-4">
            
            {/* CARD 1: CONNECT */}
            <div 
                className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out transform",
                    mode === "connect" ? "opacity-100 translate-y-0 z-20" : "opacity-0 translate-y-4 z-10 pointer-events-none"
                )}
            >
                <GlassContainer mode="connect">
                    <ConnectSimulator />
                </GlassContainer>
            </div>

            {/* CARD 2: HIRE */}
            <div 
                className={cn(
                    "absolute inset-0 transition-all duration-500 ease-in-out transform",
                    mode === "hire" ? "opacity-100 translate-y-0 z-20" : "opacity-0 translate-y-4 z-10 pointer-events-none"
                )}
            >
                <GlassContainer mode="hire">
                    <HireSimulator />
                </GlassContainer>
            </div>

        </div>

      </div>
    </section>
  );
}

// --- SUB-COMPONENTS ---

const SwitchButton = memo(({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300 z-10 outline-none",
      active ? "text-black" : "text-gray-500 hover:text-white"
    )}
  >
    {active && (
      // Using a simple div instead of motion layoutId for instant performant snap
      <div className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
    )}
    {icon}
    {label}
  </button>
));
SwitchButton.displayName = "SwitchButton";


// PERFORMANCE FIX: Removed heavy backdrop-blur-xl. 
// Uses high opacity background color to fake the glass effect without the GPU cost.
const GlassContainer = ({ children, mode }: { children: React.ReactNode, mode: EngineMode }) => {
  const isConnect = mode === "connect";
  const borderColor = isConnect ? "border-cyan-500/20" : "border-fuchsia-500/20";
  const glowColor = isConnect ? "shadow-[0_0_40px_-10px_rgba(6,182,212,0.1)]" : "shadow-[0_0_40px_-10px_rgba(192,38,211,0.1)]";

  return (
    <div className={cn(
        "w-full h-full rounded-3xl border flex flex-col md:flex-row overflow-hidden",
        "bg-[#050505]/90", // High opacity dark background matches the theme
        borderColor,
        glowColor
    )}>
       {/* Inner subtle noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      {children}
    </div>
  );
};


// ------------------------------------------
// 1. CONNECT SIMULATOR
// ------------------------------------------
const ConnectSimulator = memo(() => {
  return (
    <>
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-cyan-950/10 to-transparent">
        <DecoderText />
        <div className="mt-8 flex gap-2 items-center">
           <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" />
           <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Analyzing Intent...</span>
        </div>
      </div>
      
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          I translate <span className="text-cyan-400">Chaos</span> into <span className="text-cyan-400">Roadmaps.</span>
        </h3>
        <p className="text-gray-400 mb-8 leading-relaxed">
           Most projects fail due to communication gaps. I act as an "Intellectual Sparring Partner," decoding your scattered requirements into crystal-clear technical specifications.
        </p>
        
        <div className="space-y-4">
           <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden">
              <div className="text-xs text-gray-500 mb-1 font-mono uppercase">You Say (The Vibe):</div>
              <div className="text-sm text-gray-300 italic">"I need an AI that talks to my database but keeps it secure..."</div>
           </div>
           
           <div className="flex justify-center">
              <ArrowRight className="text-cyan-500 rotate-90" size={20} />
           </div>
           
           <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/30 relative overflow-hidden shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]">
              <div className="text-xs text-cyan-400 mb-1 font-mono uppercase relative z-10">I Build (The System):</div>
              <div className="text-sm text-white font-medium relative z-10">"RAG Pipeline with Vector Embeddings & Role-Based Access Control."</div>
           </div>
        </div>
      </div>
    </>
  );
});
ConnectSimulator.displayName = "ConnectSimulator";

const DecoderText = () => {
  const [text, setText] = useState("????????????");
  const target = "CLARITY";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(prev => 
        prev.split("").map((letter, index) => {
          if (index < iteration) return target[index];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join("")
      );
      
      if (iteration >= target.length) clearInterval(interval);
      iteration += 1/4; 
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center border border-cyan-500/20 rounded-full bg-black/50">
      <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[spin_10s_linear_infinite]" />
      <h1 className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 tracking-widest">
        {text}
      </h1>
    </div>
  )
}


// ------------------------------------------
// 2. HIRE SIMULATOR
// ------------------------------------------
const HireSimulator = memo(() => {
  const [hours, setHours] = useState(10);
  const value = hours * 100 * 52; 
  // Faster calculation, less JS overhead
  const spinDuration = Math.max(0.5, 4 - (hours / 10));

  return (
    <>
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative z-10">
        <div className="mb-2 flex items-center gap-2 text-fuchsia-400 font-mono text-xs uppercase tracking-wider">
           <Clock size={14} />
           Input Calibration
        </div>
        <h3 className="text-2xl font-bold text-white mb-6">
           Hours spent on manual loops?
        </h3>

        <div className="mb-8 relative">
            <div className="flex justify-between text-gray-400 font-mono text-xs mb-2">
                <span>0 hrs/wk</span>
                <span className="text-fuchsia-400 font-bold">{hours} Hours / Week</span>
                <span>40 hrs/wk</span>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={hours} 
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 outline-none"
            />
        </div>

        <div className="p-6 bg-gradient-to-r from-fuchsia-950/20 to-black rounded-xl border border-fuchsia-500/30 relative overflow-hidden">
             
            <div className="text-gray-400 text-sm mb-1 font-medium z-10 relative">Annual Value Unlocked</div>
            <div className="text-4xl md:text-5xl font-bold text-white flex items-center gap-1 z-10 relative">
                <span className="text-fuchsia-500">$</span>
                <span>{value.toLocaleString()}</span>
            </div>
            <div className="text-xs text-fuchsia-500/60 mt-2 font-mono uppercase tracking-wider z-10 relative">
               *Capital Recaptured via Automation
            </div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8 bg-gradient-to-bl from-fuchsia-950/10 to-transparent overflow-hidden">
         <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Core */}
            <div 
               className="absolute w-24 h-24 bg-fuchsia-600 rounded-full blur-[40px] opacity-80 transition-all duration-300"
               style={{ transform: `scale(${1 + hours/100})`, filter: `brightness(${1 + hours/50})` }}
            />
            
            {/* Outer Rings - using CSS animation for better performance than JS frame loop */}
            <div
               className="absolute w-56 h-56 rounded-full border-2 border-dashed border-fuchsia-500/30 border-t-white/80 animate-[spin_4s_linear_infinite]"
               style={{ animationDuration: `${spinDuration}s` }}
            />
            <div
               className="absolute w-40 h-40 rounded-full border border-fuchsia-400/20 border-b-fuchsia-400 animate-[spin_6s_linear_infinite_reverse]"
               style={{ animationDuration: `${spinDuration * 1.5}s` }}
            />
             
             <div className="z-10 bg-black p-4 rounded-full border border-fuchsia-500/50 shadow-[0_0_30px_fuchsia]">
                <DollarSign className="text-white" size={32} />
             </div>
         </div>
      </div>
    </>
  );
});
HireSimulator.displayName = "HireSimulator";