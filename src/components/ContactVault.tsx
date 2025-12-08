import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Lock, 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Cpu, 
  ShieldAlert, 
  Box, 
  Server, 
  CheckCircle, 
  Scan, 
  ArrowRight 
} from 'lucide-react';

/**
 * ContactVault Component
 *
 * A unique, interactive contact section.
 * - Initial state: A "locked" monolith that requires repeated clicking to "break".
 * - Unlocked state: An "assembly line" form interface to send a message.
 *
 * Features:
 * - Interactive click-to-unlock mechanic with audio feedback.
 * - Form submission simulation with an animated assembly line.
 * - Directs users to the native mail client upon "sending".
 */
const ContactVault: React.FC = () => {
  // --- PRESERVED MONOLITH STATE ---
  const [clicks, setClicks] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- NEW ASSEMBLY LINE STATE ---
  const [formStatus, setFormStatus] = useState<'IDLE' | 'PROCESSING' | 'SENT'>('IDLE');
  const [focusedField, setFocusedField] = useState<number>(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  // Controls for the animation sequence
  const crateControls = useAnimation();
  const scannerControls = useAnimation();

  /**
   * Initializes the AudioContext for sound effects.
   * Handles browser restrictions on auto-playing audio.
   */
  const initAudio = () => {
    if (!audioContextRef.current) {
      // Cross-browser support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    // Fix: Resume context if browser suspended it (common in Chrome)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  /**
   * Plays a sound effect when the vault is clicked.
   * Pitch increases as the vault gets closer to breaking.
   * @param {number} progress - The current click count.
   */
  const playImpactSound = (progress: number) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Pitch rises as you get closer to breaking the vault
    const baseFreq = 100 + (progress * 35); 
    
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.1);
    
    // Sound gets "sharper" (sawtooth) as damage increases
    osc.type = progress > 15 ? 'sawtooth' : 'square';
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  /**
   * Plays a mechanical servo sound for UI interactions.
   */
  const playServoSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);
    osc.type = 'triangle';
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  /**
   * Plays a success sound when the vault opens or message is sent.
   */
  const playSuccessSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  /**
   * Handles the click on the locked vault.
   * Increments click count and triggers unlock if threshold is reached.
   */
  const handleClick = () => {
    if (isUnlocked) return;
    initAudio();
    const newClicks = clicks + 1;
    setClicks(newClicks);
    playImpactSound(newClicks);
    setShake(prev => prev + 1);

    if (newClicks >= 20) {
      setTimeout(() => {
        setIsUnlocked(true);
        playSuccessSound();
      }, 200);
    }
  };

  const integrity = Math.max(0, 100 - (clicks * 5));

  // --- NEW ASSEMBLY LINE LOGIC ---
  const isValidEmail = formData.email.includes('@') && formData.email.includes('.');
  const isFormReady = formData.name && isValidEmail && formData.message;

  /**
   * Simulates the message sending process with animations and
   * opens the user's email client.
   */
  const handleSend = async () => {
    if (!isFormReady) return;
    
    setFormStatus('PROCESSING');
    playServoSound();

    // 1. Move Crate to Scanner
    await crateControls.start({ x: '45%', transition: { duration: 1, ease: "easeInOut" } });
    
    // 2. Scan Effect
    await scannerControls.start({ opacity: [0, 1, 0, 1, 0], transition: { duration: 0.5 } });
    
    // 3. Move Crate to Server (Dispatch)
    await crateControls.start({ x: '100%', scale: 0, opacity: 0, transition: { duration: 0.8, ease: "backIn" } });

    // 4. Success State & REAL MAIL TRIGGER
    playSuccessSound();
    setFormStatus('SENT');

    // Trigger Mail Client
    const subject = encodeURIComponent(`Access Request: ${formData.name}`);
    const body = encodeURIComponent(`Sender: ${formData.email}\n\nMessage:\n${formData.message}`);
    
    // Delay slightly to allow animation to register visually
    setTimeout(() => {
        window.location.href = `mailto:adityathakur452007@gmail.com?subject=${subject}&body=${body}`;
    }, 1000);
  };

  return (
    <section className="relative w-full py-32 flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            // --- LOCKED STATE (THE MONOLITH) ---
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 text-center">
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-3">
                    <ShieldAlert className="text-red-500 animate-pulse" />
                    SYSTEM LOCKED
                 </h2>
                 <p className="text-red-500/80 font-mono text-sm uppercase tracking-widest">
                    Firewall Integrity: {integrity}%
                 </p>
              </div>

              <motion.button
                onClick={handleClick}
                key={shake}
                initial={{ x: 0 }}
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-64 h-64 md:w-80 md:h-80 bg-black border-4 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col items-center justify-center group cursor-crosshair overflow-hidden"
              >
                <div 
                    className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100" 
                    style={{ clipPath: `inset(${Math.random()*100}% 0 ${Math.random()*100}% 0)` }}
                />
                
                <div className="relative z-10 flex flex-col items-center">
                    <Lock size={64} className={`text-white mb-4 transition-all duration-300 ${clicks > 15 ? 'text-red-500 animate-bounce' : ''}`} />
                    <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest border border-[#00f0ff]/30 px-2 py-1 bg-black/50">
                        {clicks === 0 ? "Click to Breach" : "Brute Forcing..."}
                    </span>
                </div>

                {clicks > 5 && <div className="absolute top-10 left-10 w-20 h-[1px] bg-white/20 rotate-45" />}
                {clicks > 10 && <div className="absolute bottom-10 right-10 w-32 h-[1px] bg-white/20 -rotate-12" />}
                {clicks > 15 && <div className="absolute inset-0 border-2 border-red-500/50 animate-pulse" />}
              </motion.button>
              
              <p className="mt-8 text-gray-600 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                {20 - clicks} interactions remaining
              </p>
            </motion.div>
          ) : (
            // --- UNLOCKED STATE (ASSEMBLY LINE) ---
            <motion.div
              key="unlocked"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full bg-[#0a0a0a] border border-white/10 shadow-[0_0_100px_rgba(0,240,255,0.1)] rounded-2xl overflow-hidden relative"
            >
                {/* Header / Top Bar */}
                <div className="w-full bg-white/5 border-b border-white/10 px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-xs uppercase tracking-widest">
                        <Terminal size={14} />
                        <span>Transmission Uplink // {formStatus === 'IDLE' ? 'READY' : formStatus}</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className={`w-2 h-2 rounded-full ${formStatus === 'SENT' ? 'bg-green-500 animate-pulse' : 'bg-green-500/50'}`} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:p-12 min-h-[400px] flex flex-col relative">
                    
                    {formStatus === 'SENT' ? (
                        // --- SUCCESS / RECEIPT VIEW ---
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center py-12"
                        >
                             <div className="w-20 h-20 bg-[#00f0ff]/10 rounded-full flex items-center justify-center mb-6 border border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                                <CheckCircle size={40} className="text-[#00f0ff]" />
                             </div>
                             <h2 className="text-3xl font-black text-white mb-4">PACKET DISPATCHED</h2>
                             <p className="text-gray-400 max-w-md mb-10 font-mono text-sm">
                                Opening your primary mail client to complete the handshake. If it fails, initiate manual override via the links below.
                             </p>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                                <a href="https://linkedin.com/in/aaditya-thakur-1a8842332" target="_blank" rel="noreferrer" className="flex flex-col items-center p-4 bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 rounded-lg group transition-all">
                                    <Linkedin size={24} className="text-gray-400 group-hover:text-white mb-2" />
                                    <span className="text-xs font-mono uppercase text-gray-500 group-hover:text-[#00f0ff]">LinkedIn</span>
                                </a>
                                <a href="https://github.com/aditya452007" target="_blank" rel="noreferrer" className="flex flex-col items-center p-4 bg-white/5 border border-white/10 hover:border-white/50 hover:bg-white/10 rounded-lg group transition-all">
                                    <Github size={24} className="text-gray-400 group-hover:text-white mb-2" />
                                    <span className="text-xs font-mono uppercase text-gray-500 group-hover:text-white">GitHub</span>
                                </a>
                                <a href="mailto:adityathakur452007@gmail.com" className="flex flex-col items-center p-4 bg-white/5 border border-white/10 hover:border-[#bd00ff]/50 hover:bg-[#bd00ff]/10 rounded-lg group transition-all">
                                    <Mail size={24} className="text-gray-400 group-hover:text-white mb-2" />
                                    <span className="text-xs font-mono uppercase text-gray-500 group-hover:text-[#bd00ff]">Email</span>
                                </a>
                             </div>
                        </motion.div>
                    ) : (
                        // --- ASSEMBLY LINE FORM VIEW ---
                        <div className="relative flex flex-col h-full">
                            
                            {/* Visual Gantry Arm (Decoration) */}
                            <motion.div 
                                animate={{ x: focusedField === 0 ? 0 : focusedField === 1 ? '50%' : '100%' }}
                                className="absolute -top-6 left-0 w-1/3 h-8 border-b-2 border-[#00f0ff] flex justify-center items-end transition-all duration-500 ease-out z-0 hidden md:flex"
                            >
                                <div className="w-1 h-4 bg-[#00f0ff]" />
                                <div className="absolute bottom-0 w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                            </motion.div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-auto">
                                {/* Name */}
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#00f0ff]">Identifier (Name)</label>
                                    <input 
                                        type="text" 
                                        disabled={formStatus === 'PROCESSING'}
                                        onFocus={() => { setFocusedField(0); playServoSound(); }}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-[#00f0ff] focus:outline-none focus:bg-[#00f0ff]/5 transition-all font-mono text-sm"
                                        placeholder="User_ID_01"
                                    />
                                </div>
                                {/* Email */}
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#00f0ff] flex justify-between">
                                        <span>CommLink (Email)</span>
                                        {isValidEmail && <CheckCircle size={10} className="text-green-500" />}
                                    </label>
                                    <input 
                                        type="email" 
                                        disabled={formStatus === 'PROCESSING'}
                                        onFocus={() => { setFocusedField(1); playServoSound(); }}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`w-full bg-black/40 border ${isValidEmail ? 'border-green-500/50' : 'border-white/10'} rounded p-3 text-white focus:border-[#00f0ff] focus:outline-none focus:bg-[#00f0ff]/5 transition-all font-mono text-sm`}
                                        placeholder="user@network.com"
                                    />
                                </div>
                                {/* Message */}
                                <div className="col-span-1 md:col-span-2 space-y-2 group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#00f0ff]">Payload (Message)</label>
                                    <textarea 
                                        rows={3}
                                        disabled={formStatus === 'PROCESSING'}
                                        onFocus={() => { setFocusedField(2); playServoSound(); }}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-[#00f0ff] focus:outline-none focus:bg-[#00f0ff]/5 transition-all font-mono text-sm resize-none"
                                        placeholder="Initiate collaboration protocols..."
                                    />
                                </div>
                            </div>

                            {/* THE CONVEYOR BELT (Bottom Animation) */}
                            <div className="relative mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                                
                                {/* Track Graphics */}
                                <div className="absolute inset-0 top-1/2 h-[2px] bg-white/10 flex justify-between px-10">
                                    <div className="w-[1px] h-2 bg-white/20" />
                                    <div className="w-[1px] h-2 bg-white/20" />
                                    <div className="w-[1px] h-2 bg-white/20" />
                                    <div className="w-[1px] h-2 bg-white/20" />
                                    <div className="w-[1px] h-2 bg-white/20" />
                                </div>

                                {/* START: The Hopper */}
                                <div className="relative z-10 flex flex-col items-center gap-2 text-gray-600">
                                    <div className="w-12 h-12 border-2 border-dashed border-white/20 rounded flex items-center justify-center bg-[#0a0a0a]">
                                        <Box size={20} />
                                    </div>
                                    <span className="text-[9px] font-mono uppercase mt-2">Assembler</span>
                                </div>

                                {/* MOVING PART: The Data Crate */}
                                <motion.div 
                                    className="absolute left-6 z-20 top-1/2 -translate-y-1/2"
                                    animate={crateControls}
                                    initial={{ x: 0 }}
                                >
                                    <div className={`w-10 h-10 ${isValidEmail && formData.name ? 'bg-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.5)] border-white' : 'bg-gray-800 border-gray-600'} border-2 rounded flex items-center justify-center transition-colors duration-300`}>
                                        <Terminal size={16} className={isValidEmail ? "text-black" : "text-gray-500"} />
                                    </div>
                                </motion.div>

                                {/* MIDDLE: The Scanner */}
                                <div className="relative z-10 flex flex-col items-center gap-2 text-gray-600">
                                    <motion.div 
                                        animate={scannerControls} 
                                        className="w-2 h-16 border-l border-r border-[#00f0ff]/30 absolute -top-4 opacity-0" 
                                    />
                                    <div className="bg-[#0a0a0a] p-1 rounded">
                                        <Scan size={24} className="text-gray-500" />
                                    </div>
                                    <span className="text-[9px] font-mono uppercase mt-2">Validator</span>
                                </div>

                                {/* END: The Server */}
                                <div className="relative z-10 flex flex-col items-center gap-2 text-gray-600">
                                    <div className="w-12 h-12 border border-white/10 bg-black rounded flex items-center justify-center">
                                        <Server size={20} />
                                    </div>
                                    <span className="text-[9px] font-mono uppercase mt-2">Uplink</span>
                                </div>

                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                onClick={handleSend}
                                disabled={!isFormReady || formStatus === 'PROCESSING'}
                                className={`
                                    absolute bottom-1 right-0 px-6 py-2 rounded-full font-mono text-xs uppercase tracking-widest flex items-center gap-2
                                    transition-all duration-300 z-30
                                    ${isFormReady 
                                        ? 'bg-[#00f0ff] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                                        : 'bg-white/5 text-gray-500 cursor-not-allowed'}
                                `}
                            >
                                {formStatus === 'PROCESSING' ? (
                                    <>Processing <Cpu size={14} className="animate-spin" /></>
                                ) : (
                                    <>Initialize Sequence <ArrowRight size={14} /></>
                                )}
                            </button>

                        </div>
                    )}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactVault;