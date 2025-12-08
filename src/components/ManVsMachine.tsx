import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import gsap from "gsap";
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from "gsap/ScrollTrigger"; 

import { 
    MousePointer, FolderOpen, FileText, Sheet, Zap, CheckCircle2, 
    Database, Globe, Cpu, Clock, Webhook, Filter, Brain, FileJson, 
    Gem, Image as ImageIcon, Video, DollarSign, ArrowLeft, Activity
} from 'lucide-react';

// REGISTER THE PLUGIN
gsap.registerPlugin(ScrollTrigger);

// --- PIPELINE CONSTANTS ---
const NODES = [
  { id: 'ingest', label: 'Ingest', icon: Webhook },
  { id: 'clean', label: 'Clean', icon: Filter },
  { id: 'ai', label: 'Inference', icon: Brain },
  { id: 'structure', label: 'Structure', icon: FileJson },
  { id: 'value', label: 'Value', icon: Gem }
];

const INPUTS = [
  { id: 'text', label: 'Raw Text', icon: FileText, color: '#f87171' },
  { id: 'img', label: 'Images', icon: ImageIcon, color: '#fb923c' },
  { id: 'vid', label: 'Video', icon: Video, color: '#facc15' },
  { id: 'audio', label: 'Audio', icon: Activity, color: '#22d3ee' },
];

const OUTPUTS = [
  { id: 'db', label: 'Database', icon: Database, color: '#00f0ff' }, 
  { id: 'money', label: 'Profit', icon: DollarSign, color: '#00ff9c' }, 
  { id: 'time', label: 'Time Saved', icon: Clock, color: '#bd00ff' }, 
];

/**
 * PipelineView Component
 *
 * Displays the "Automated" state of the workflow.
 * Uses GSAP for complex timeline-based animations of data flowing through nodes.
 *
 * @param {Object} props - Component props.
 * @param {() => void} props.onBack - Callback to return to the manual view.
 */
const PipelineView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const outputRefs = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 768;
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

            // --- 1. INITIAL STATE (Reset) ---
            gsap.set(inputRefs.current, { opacity: 1, scale: 1, x: 0, y: 0 });
            gsap.set(outputRefs.current, { opacity: 0, scale: 0, x: 0, y: 0 });
            
            // Lines empty (scale 0)
            gsap.set(lineRefs.current, { 
                scaleX: isMobile ? 1 : 0, 
                scaleY: isMobile ? 0 : 1, 
                opacity: 0.2, 
                transformOrigin: isMobile ? "top" : "left" 
            });
            
            // Nodes dim
            nodeRefs.current.forEach((node) => {
                if (node) {
                    gsap.set(node, { scale: 1, filter: "brightness(0.5)", borderColor: "rgba(255,255,255,0.1)" });
                    const bg = node.querySelector('.node-bg');
                    if (bg) gsap.set(bg, { opacity: 0 });
                    const icon = node.querySelector('.node-icon');
                    if (icon) gsap.set(icon, { color: "white" });
                }
            });

            // --- 2. INPUT INGESTION ---
            tl.to(inputRefs.current, {
                x: isMobile ? 0 : 60,
                y: isMobile ? 60 : 0,
                scale: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.in(1.7)"
            });

            // --- 3. SEQUENTIAL NODE ACTIVATION ---
            NODES.forEach((_, index) => {
                const node = nodeRefs.current[index];
                const line = lineRefs.current[index];

                if (!node) return;

                // Step A: Pulse Node
                tl.to(node, {
                    scale: 1.2,
                    filter: "brightness(1.5)",
                    borderColor: "#00f0ff",
                    duration: 0.2,
                    ease: "power2.out",
                    onStart: () => {
                        gsap.to(node.querySelector('.node-bg'), { opacity: 1, duration: 0.2 });
                        gsap.to(node.querySelector('.node-icon'), { color: "#00f0ff", duration: 0.2 });
                    }
                });
                
                // Step B: Settle Node (Stay Lit)
                tl.to(node, {
                    scale: 1,
                    filter: "brightness(1.2)",
                    duration: 0.2,
                    ease: "power2.in"
                });

                // Step C: Animate Line to Next Node (if exists)
                if (index < NODES.length - 1 && line) {
                    tl.to(line, {
                        scaleX: 1, // Full fill horizontal
                        scaleY: 1, // Full fill vertical
                        opacity: 1, // Bright
                        duration: 0.3, // Speed of travel
                        ease: "none" // Linear flow
                    });
                }
            });

            // --- 4. OUTPUT GENERATION ---
            tl.to(outputRefs.current, {
                opacity: 1,
                scale: 1,
                x: isMobile ? (i) => (i - 1) * 35 : 60,
                y: isMobile ? 60 : (i) => (i - 1) * 40,
                duration: 0.6,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)"
            });

            // Hold before restart
            tl.to({}, { duration: 2 });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative p-8">
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-white transition-all font-mono text-xs uppercase tracking-widest"
            >
                <ArrowLeft size={14} /> Return to Manual
            </button>

            {/* Header */}
            <div className="relative z-10 text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff0099] animate-pulse">Pipeline</span>
                </h2>
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Autonomous Data Transformation</p>
            </div>

            {/* PIPELINE CONTAINER */}
            <div className="relative w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-0">
                
                {/* Inputs */}
                <div className="flex md:flex-col flex-row gap-4 md:mr-10 mb-10 md:mb-0 relative z-20">
                    {INPUTS.map((input, i) => (
                        <div key={input.id} ref={el => { inputRefs.current[i] = el }} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                            <input.icon size={16} style={{ color: input.color }} />
                            <span className="text-[10px] font-mono text-gray-300 uppercase whitespace-nowrap">{input.label}</span>
                        </div>
                    ))}
                </div>

                {/* Nodes Loop */}
                {NODES.map((node, index) => (
                    <React.Fragment key={node.id}>
                        <div className="relative z-10 flex flex-col items-center group mx-1 md:mx-2">
                            {/* Node Card */}
                            <div 
                                ref={el => { nodeRefs.current[index] = el }} 
                                className="w-16 h-16 md:w-24 md:h-24 bg-[#0a0a0a] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 border border-white/10 shadow-lg"
                            >
                                {/* Active Gradient Border */}
                                <div className="absolute inset-0 p-[2px] rounded-2xl opacity-0 transition-opacity duration-300 node-bg">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff0099] bg-[length:400%_400%] animate-[gradient-xy_3s_ease_infinite]" />
                                    <div className="absolute inset-[2px] bg-[#0a0a0a] rounded-xl" />
                                </div>
                                {/* Inner Glow */}
                                <div className="node-bg absolute inset-0 bg-gradient-to-br from-[#00f0ff]/20 to-[#bd00ff]/20 opacity-0 transition-opacity duration-300" />
                                
                                <node.icon size={28} className="node-icon relative z-20 text-white transition-colors duration-300" />
                            </div>
                            
                            <span className="absolute -bottom-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest whitespace-nowrap">{node.label}</span>
                        </div>

                        {/* Connecting Line */}
                        {index < NODES.length - 1 && (
                            <div className="relative w-1 h-12 md:w-16 md:h-1 flex items-center justify-center">
                                {/* Dim Track */}
                                <div className="absolute inset-0 bg-white/5 rounded-full" />
                                
                                {/* Lit Beam (Animated) */}
                                <div 
                                    ref={el => { lineRefs.current[index] = el }} 
                                    className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff0099] shadow-[0_0_15px_rgba(0,240,255,0.5)] rounded-full"
                                    style={{ transformOrigin: 'left' }} 
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {/* Outputs */}
                <div className="flex md:flex-col flex-row gap-4 md:ml-10 mt-12 md:mt-0 relative z-20">
                    {OUTPUTS.map((output, i) => (
                        <div key={output.id} ref={el => { outputRefs.current[i] = el }} className="flex items-center gap-2 px-4 py-3 bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                            <output.icon size={18} style={{ color: output.color }} />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white uppercase leading-none">{output.label}</span>
                                <span className="text-[8px] font-mono text-[#00f0ff]/70">Generated</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
             <style>{`
                @keyframes gradient-xy {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

/**
 * ManualView Component
 *
 * Displays the "Manual" state (The "Before" picture).
 * Shows a slow, manual process with a simulated cursor moving files,
 * contrasting with the high-speed automated version.
 *
 * @param {Object} props - Component props.
 * @param {() => void} props.onAutomate - Callback to trigger the automation transition.
 */
const ManualView: React.FC<{ onAutomate: () => void }> = ({ onAutomate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const folderRef = useRef<HTMLDivElement>(null);
    const docRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Timers
    const [manualTime, setManualTime] = useState("45:00");
    const [autoTime, setAutoTime] = useState("00:00");

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;
        
        const resize = () => { 
            // Robust logic: Use parent size, not window, to avoid breaking layout
            const parent = canvas.parentElement;
            if(parent) {
                canvas.width = parent.offsetWidth; 
                canvas.height = parent.offsetHeight;
            } else {
                canvas.width = window.innerWidth / 2;
                canvas.height = window.innerHeight;
            }
        };
        resize();
        
        const chars = "10";
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

        const draw = () => {
            // Re-check width in case of sudden layout shifts
            if (Math.random() > 0.99) {
                 const parent = canvas.parentElement;
                 if(parent && canvas.width !== parent.offsetWidth) {
                    canvas.width = parent.offsetWidth;
                    canvas.height = parent.offsetHeight;
                 }
            }

            ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00FF9C'; 
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // Cursor Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
            tl.to(cursorRef.current, { x: -80, y: -40, duration: 1, ease: "power2.inOut" })
              .to(folderRef.current, { scale: 1.1, color: '#fff', duration: 0.2, yoyo: true, repeat: 1 })
              .to(cursorRef.current, { x: 0, y: 0, duration: 1.5, ease: "power2.inOut" })
              .to(docRef.current, { scale: 1.1, color: '#fff', duration: 0.2, yoyo: true, repeat: 1 })
              .to(cursorRef.current, { x: 80, y: -20, duration: 1.5, ease: "power2.inOut" })
              .to(sheetRef.current, { scale: 1.1, color: '#fff', duration: 0.2, yoyo: true, repeat: 1 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Timer Logic
    useEffect(() => {
        const mInt = setInterval(() => {
            setManualTime(prev => {
                const [min, sec] = prev.split(':').map(Number);
                let newSec = sec + 1; let newMin = min;
                if (newSec === 60) { newMin++; newSec = 0; }
                return `${newMin}:${newSec.toString().padStart(2, '0')}`;
            });
        }, 1000);
        const aInt = setInterval(() => {
            const ms = Date.now() % 3000;
            setAutoTime(`00:0${Math.floor(ms / 1000)}.${Math.floor((ms % 1000) / 10)}`);
        }, 50);
        return () => { clearInterval(mInt); clearInterval(aInt); };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full flex relative">
             {/* LEFT SIDE: MANUAL */}
             <div className="w-1/2 h-full flex flex-col items-center justify-center bg-[#0a0a0a] border-r border-white/5 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
                <div className="relative w-64 h-48 border border-white/10 rounded-lg bg-black/50 p-4 flex items-center justify-center gap-8 mb-8 shadow-2xl">
                    <div ref={folderRef} className="flex flex-col items-center gap-2 text-gray-500"><FolderOpen size={32} /><div className="h-2 w-8 bg-gray-700 rounded-full" /></div>
                    <div ref={docRef} className="flex flex-col items-center gap-2 text-gray-500"><FileText size={32} /><div className="h-2 w-8 bg-gray-700 rounded-full" /></div>
                    <div ref={sheetRef} className="flex flex-col items-center gap-2 text-gray-500"><Sheet size={32} /><div className="h-2 w-8 bg-gray-700 rounded-full" /></div>
                    <div ref={cursorRef} className="absolute z-50 text-white drop-shadow-md"><MousePointer size={24} fill="white" /></div>
                </div>
                <div className="text-center opacity-70">
                   <h3 className="text-xl font-serif text-gray-400 mb-2 tracking-widest">THE MANUAL WAY</h3>
                   <div className="flex items-center justify-center gap-2 font-mono text-red-500/80 text-lg mb-2"><Clock size={16} /> {manualTime} min</div>
                </div>
             </div>

             {/* RIGHT SIDE: AUTOMATED */}
             <div className="w-1/2 h-full bg-[#0a0a0a] relative flex flex-col items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-8">
                         <div className="w-12 h-12 bg-[#0a0a0a] border border-[#00f0ff] rounded-lg flex items-center justify-center animate-pulse"><Globe size={24} className="text-[#00f0ff]" /></div>
                         <div className="w-8 h-[2px] bg-[#00f0ff]/50" />
                         <div className="w-12 h-12 bg-[#0a0a0a] border border-[#bd00ff] rounded-lg flex items-center justify-center animate-pulse delay-75"><Cpu size={24} className="text-[#bd00ff]" /></div>
                         <div className="w-8 h-[2px] bg-[#bd00ff]/50" />
                         <div className="w-12 h-12 bg-[#00f0ff]/20 border border-[#00f0ff] rounded-lg flex items-center justify-center animate-bounce"><CheckCircle2 size={24} className="text-[#00f0ff]" /></div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">THE AADITYA WAY</h3>
                    <div className="flex items-center justify-center gap-2 font-mono text-[#00f0ff] text-xl mb-4 text-shadow-neon"><Zap size={18} fill="currentColor" /> {autoTime} sec</div>
                </div>
             </div>

             {/* CENTER TRIGGER */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <button
                  onClick={onAutomate}
                  className="group relative flex items-center gap-3 px-8 py-5 bg-black border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] rounded-full text-white font-mono text-xs uppercase tracking-widest hover:scale-110 hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all outline-none select-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#00f0ff]/10 animate-pulse" />
                  <Zap size={18} className="text-[#00f0ff] relative z-10 animate-[spin_3s_linear_infinite]" />
                  <span className="relative z-10 font-bold text-[#00f0ff] group-hover:text-white transition-colors">Automate with Aaditya</span>
                </button>
             </div>
        </div>
    );
};

/**
 * ManVsMachine Component
 *
 * A high-level view switching component that contrasts "Manual Labor" vs "Automated Intelligence".
 *
 * Features:
 * - Two main states: Manual View (split screen) and Pipeline View (full flow).
 * - Animated transitions between states.
 * - Conceptual demonstration of the value of automation.
 */
const ManVsMachine: React.FC = () => {
    const [isAutomating, setIsAutomating] = useState(false);

    return (
        <section className="relative w-full h-[90vh] min-h-[700px] bg-[#0a0a0a] border-t border-b border-white/5 overflow-hidden">
            <AnimatePresence mode="wait">
                {!isAutomating ? (
                    <motion.div 
                        key="manual"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <ManualView onAutomate={() => setIsAutomating(true)} />
                    </motion.div>
                ) : (
                    <motion.div 
                        key="pipeline"
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <PipelineView onBack={() => setIsAutomating(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ManVsMachine;