import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  Zap
} from 'lucide-react';

const ContactVault: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [clicks, setClicks] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shake, setShake] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Form State
  const [formStatus, setFormStatus] = useState<'IDLE' | 'PROCESSING' | 'SENT'>('IDLE');
  const [focusedField, setFocusedField] = useState<number>(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  // Animation Controls
  const crateControls = useAnimation();
  const scannerControls = useAnimation();

  // --- AUDIO ENGINE ---
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playSound = (type: 'impact' | 'servo' | 'success') => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;

    if (type === 'impact') {
        const baseFreq = 100 + (clicks * 35); 
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.1);
        osc.type = clicks > 15 ? 'sawtooth' : 'square';
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start();
        osc.stop(now + 0.1);
    } else if (type === 'servo') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
    } else if (type === 'success') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 1);
        osc.start();
        osc.stop(now + 1);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
  };

  // --- LOGIC ---
  const handleClick = () => {
    if (isUnlocked) return;
    initAudio();
    const newClicks = clicks + 1;
    setClicks(newClicks);
    playSound('impact');
    setShake(prev => prev + 1);

    if (newClicks >= 20) {
      setTimeout(() => {
        setIsUnlocked(true);
        playSound('success');
      }, 200);
    }
  };

  const integrity = Math.max(0, 100 - (clicks * 5));
  const isValidEmail = formData.email.includes('@') && formData.email.includes('.');
  const isFormReady = formData.name.length > 0 && isValidEmail && formData.message.length > 0;

  const handleSend = async () => {
    if (!isFormReady || formStatus !== 'IDLE') return;
    
    setFormStatus('PROCESSING');
    playSound('servo');

    // 1. Move Crate to Scanner (Center)
    await crateControls.start({ 
        left: '50%', 
        x: '-50%',
        transition: { duration: 1, ease: "easeInOut" } 
    });
    
    // 2. Scan Effect
    await scannerControls.start({ opacity: [0, 1, 0, 1, 0], transition: { duration: 0.6 } });
    playSound('success'); // Beep on scan
    
    // 3. Move Crate to Server (End)
    await crateControls.start({ 
        left: '100%', 
        x: '-100%', 
        scale: 0, 
        opacity: 0, 
        transition: { duration: 0.8, ease: "backIn" } 
    });

    // 4. Finalize
    setFormStatus('SENT');

    // 5. Trigger Mail Client
    const subject = encodeURIComponent(`Cyberpunk Portfolio Contact: ${formData.name}`);
    const body = encodeURIComponent(`From: ${formData.email}\n\nMessage:\n${formData.message}`);
    
    setTimeout(() => {
        window.location.assign(`mailto:adityathakur452007@gmail.com?subject=${subject}&body=${body}`);
    }, 800);
  };

  return (
    <section className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center bg-[#050505] overflow-hidden min-h-screen">
      
      {/* Dynamic Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            // --- LOCKED STATE ---
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 text-center space-y-2">
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center justify-center gap-3">
                    <ShieldAlert className="text-red-500 animate-pulse" />
                    SYSTEM LOCKED
                 </h2>
                 <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: `${integrity}%` }}
                        className={`h-full ${integrity < 30 ? 'bg-red-500' : 'bg-[#00f0ff]'}`}
                    />
                 </div>
                 <p className="text-red-500/80 font-mono text-xs uppercase tracking-widest">
                    Firewall Integrity: {integrity}%
                 </p>
              </div>

              <motion.button
                onClick={handleClick}
                key={shake}
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-64 h-64 md:w-80 md:h-80 bg-black border-2 border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col items-center justify-center group cursor-pointer overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <Lock size={64} className={`text-white mb-4 transition-all duration-300 ${clicks > 15 ? 'text-red-500 animate-bounce' : ''}`} />
                    <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest border border-[#00f0ff]/30 px-2 py-1 bg-black/80 backdrop-blur-sm">
                        {clicks === 0 ? "Click to Breach" : "Brute Forcing..."}
                    </span>
                </div>

                {/* Cracks Visuals */}
                {clicks > 5 && <div className="absolute top-10 left-10 w-24 h-[1px] bg-white/40 rotate-45" />}
                {clicks > 10 && <div className="absolute bottom-10 right-10 w-32 h-[1px] bg-white/40 -rotate-12" />}
                {clicks > 15 && <div className="absolute inset-0 border-4 border-red-500/50 animate-pulse rounded-xl" />}
              </motion.button>
              
              <p className="mt-8 text-gray-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                {20 - clicks} interactions remaining
              </p>
            </motion.div>
          ) : (
            // --- UNLOCKED STATE (FORM) ---
            <motion.div
              key="unlocked"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#00f0ff]/20 shadow-[0_0_100px_rgba(0,240,255,0.1)] rounded-2xl overflow-hidden relative flex flex-col"
            >
                {/* Header */}
                <div className="w-full bg-white/5 border-b border-white/10 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#00f0ff] font-mono text-[10px] md:text-xs uppercase tracking-widest">
                        <Terminal size={14} />
                        <span>Uplink // {formStatus === 'IDLE' ? 'READY' : formStatus}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className={`w-2 h-2 rounded-full ${formStatus === 'SENT' ? 'bg-green-500 animate-pulse' : 'bg-green-500/50'}`} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 flex-grow relative min-h-[450px]">
                    
                    {formStatus === 'SENT' ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center py-8"
                        >
                             <div className="w-24 h-24 bg-[#00f0ff]/10 rounded-full flex items-center justify-center mb-6 border border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                                <CheckCircle size={48} className="text-[#00f0ff]" />
                             </div>
                             <h2 className="text-3xl font-black text-white mb-2">PACKET SENT</h2>
                             <p className="text-gray-400 max-w-sm mb-8 font-mono text-sm">
                                Opening your primary mail client...<br/>
                                If nothing happens, utilize manual override:
                             </p>

                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                                <SocialButton href="https://linkedin.com/in/aaditya-thakur-1a8842332" icon={<Linkedin size={20} />} label="LinkedIn" />
                                <SocialButton href="https://github.com/aditya452007" icon={<Github size={20} />} label="GitHub" />
                                <SocialButton href="mailto:adityathakur452007@gmail.com" icon={<Mail size={20} />} label="Email" highlight />
                             </div>
                        </motion.div>
                    ) : (
                        <div className="relative flex flex-col h-full">
                            
                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
                                <InputGroup 
                                    label="Identifier (Name)" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    onFocus={() => { setFocusedField(0); playSound('servo'); }}
                                    placeholder="Cyber_User_01"
                                    disabled={formStatus === 'PROCESSING'}
                                />
                                <InputGroup 
                                    label="CommLink (Email)" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    onFocus={() => { setFocusedField(1); playSound('servo'); }}
                                    placeholder="user@net.com"
                                    type="email"
                                    isValid={isValidEmail}
                                    disabled={formStatus === 'PROCESSING'}
                                />
                                <div className="col-span-1 md:col-span-2 space-y-2 group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#00f0ff] transition-colors">
                                        Payload (Message)
                                    </label>
                                    <textarea 
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        onFocus={() => { setFocusedField(2); playSound('servo'); }}
                                        disabled={formStatus === 'PROCESSING'}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none focus:bg-[#00f0ff]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all font-mono text-sm resize-none"
                                        placeholder="Initiate collaboration protocols..."
                                    />
                                </div>
                            </div>

                            {/* ANIMATION TRACK & BUTTON AREA */}
                            <div className="mt-auto pt-10">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    
                                    {/* The Track */}
                                    <div className="relative flex-grow w-full h-16 bg-white/5 rounded-lg border border-white/10 flex items-center px-4 overflow-hidden">
                                        
                                        {/* Background Lines */}
                                        <div className="absolute inset-0 flex justify-between px-2 opacity-20">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className="w-[1px] h-full bg-white skew-x-12" />
                                            ))}
                                        </div>

                                        {/* Hopper (Start) */}
                                        <div className="absolute left-4 z-10 opacity-50">
                                            <Box size={24} className="text-gray-500" />
                                        </div>

                                        {/* The Crate (Moving Element) */}
                                        <motion.div 
                                            animate={crateControls}
                                            initial={{ left: '1rem', x: 0, opacity: 1, scale: 1 }}
                                            className="absolute z-20 top-1/2 -translate-y-1/2"
                                        >
                                            <div className={`w-10 h-10 ${isFormReady ? 'bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]' : 'bg-gray-800 border border-gray-600'} rounded flex items-center justify-center transition-all duration-300`}>
                                                <Terminal size={16} className={isFormReady ? "text-black" : "text-gray-500"} />
                                            </div>
                                        </motion.div>

                                        {/* Scanner (Middle) */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex flex-col items-center justify-center z-10">
                                            <motion.div 
                                                animate={scannerControls} 
                                                className="w-1 h-full bg-red-500/50 absolute shadow-[0_0_10px_red]"
                                                initial={{ opacity: 0 }}
                                            />
                                            <Scan size={20} className="text-gray-600 relative z-10" />
                                        </div>

                                        {/* Server (End) */}
                                        <div className="absolute right-4 z-10 opacity-50">
                                            <Server size={24} className="text-gray-500" />
                                        </div>
                                    </div>

                                    {/* ACTION BUTTON - MOVED HERE FOR Z-INDEX SAFETY */}
                                    <button
                                        onClick={handleSend}
                                        disabled={!isFormReady || formStatus === 'PROCESSING'}
                                        className={`
                                            relative h-14 px-8 rounded-lg font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 shrink-0 w-full md:w-auto
                                            transition-all duration-300 border
                                            ${isFormReady 
                                                ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer' 
                                                : 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'}
                                        `}
                                    >
                                        {formStatus === 'PROCESSING' ? (
                                            <>
                                                <Cpu size={18} className="animate-spin" />
                                                <span>Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Initialize</span>
                                                <Zap size={18} className={isFormReady ? "fill-current" : ""} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

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

// --- SUB COMPONENTS FOR CLEANER CODE ---

const InputGroup = ({ label, type = "text", isValid, ...props }: any) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#00f0ff] transition-colors flex justify-between">
            <span>{label}</span>
            {isValid && <CheckCircle size={12} className="text-green-500 shadow-[0_0_10px_rgba(0,255,0,0.5)]" />}
        </label>
        <input 
            type={type} 
            className={`w-full bg-black/40 border ${isValid ? 'border-green-500/50' : 'border-white/10'} rounded-lg p-3 text-white focus:border-[#00f0ff] focus:outline-none focus:bg-[#00f0ff]/5 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all font-mono text-sm`}
            {...props}
        />
    </div>
);

const SocialButton = ({ href, icon, label, highlight }: any) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        className={`flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-lg group transition-all duration-300
        ${highlight ? 'hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10' : 'hover:border-white/50 hover:bg-white/10'}
        `}
    >
        <div className={`text-gray-400 mb-2 transition-colors ${highlight ? 'group-hover:text-[#00f0ff]' : 'group-hover:text-white'}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-mono uppercase text-gray-500 ${highlight ? 'group-hover:text-[#00f0ff]' : 'group-hover:text-white'}`}>
            {label}
        </span>
    </a>
);

export default ContactVault;
