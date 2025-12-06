import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Minimize2, Loader2, Wifi, Battery, Shield, Cpu, Play } from 'lucide-react';

// --- TYPES ---
interface LogEntry {
  type: 'command' | 'response' | 'system' | 'error' | 'success';
  content: string;
}

interface CommandDoc {
  cmd: string;
  desc: string;
  icon: React.ReactNode;
}

// --- MATRIX RAIN COMPONENT (UNCHANGED) ---
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
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
  return <motion.canvas {...({ initial: { opacity: 0 }, animate: { opacity: 0.8 }, exit: { opacity: 0 }, ref: canvasRef, className: "fixed inset-0 z-[45] pointer-events-none mix-blend-screen" } as any)} />;
};

// --- MAIN TERMINAL COMPONENT ---
const TerminalOfTruth: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  
  // State
  const [user, setUser] = useState<'guest' | 'root'>('guest');
  const [mode, setMode] = useState<'bash' | 'python'>('bash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [history, setHistory] = useState<LogEntry[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- AVAILABLE PROTOCOLS (THE DOCS) ---
  const commands: CommandDoc[] = [
    { cmd: 'whoami', desc: 'Verify Identify', icon: <Shield size={14} /> },
    { cmd: 'scan', desc: 'Network Skill Analysis', icon: <Wifi size={14} /> },
    { cmd: 'python3', desc: 'Logic Interpreter', icon: <Cpu size={14} /> },
    { cmd: 'pip install', desc: 'Package Simulation', icon: <Loader2 size={14} /> },
    { cmd: 'contact', desc: 'Encrypted Uplink', icon: <Battery size={14} /> },
    { cmd: 'sudo su', desc: 'Elevate Privileges', icon: <Terminal size={14} /> },
  ];

  // --- BOOT SEQUENCE ---
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setIsBooting(true);
      const bootSteps = [
        { msg: 'INITIALIZING AADITYA_OS KERNEL...', delay: 200 },
        { msg: 'LOADING NEURAL INTERFACES...', delay: 600 },
        { msg: 'MOUNTING FILE SYSTEM (READ-ONLY)...', delay: 1100 },
        { msg: 'CONNECTING TO MAIN MAINFRAME...', delay: 1600 },
        { msg: 'ACCESS GRANTED. WELCOME, GUEST.', delay: 2000 },
      ];

      let totalDelay = 0;
      bootSteps.forEach((step, index) => {
        totalDelay = step.delay;
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'system', content: step.msg }]);
          if (index === bootSteps.length - 1) {
             setIsBooting(false);
             setHistory(prev => [...prev, { type: 'response', content: 'Terminal Ready. Awaiting Input.\nReview "AVAILABLE PROTOCOLS" on the right panel for authorized commands.' }]);
          }
        }, step.delay);
      });
    }
  }, [isOpen]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-scroll & Focus
  useEffect(() => {
    if (isOpen && !isProcessing && !isBooting) {
        // Small delay to ensure DOM is ready
        setTimeout(() => inputRef.current?.focus(), 10);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, isProcessing, isBooting]);

  const addLog = (content: string, type: LogEntry['type'] = 'response') => {
    setHistory(prev => [...prev, { type, content }]);
  };

  // --- COMMAND PROCESSOR ---
  const handleCommand = async (cmd: string) => {
    if (isProcessing || isBooting) return;
    const rawCmd = cmd;
    const cleanCmd = cmd.trim();
    const lowerCmd = cleanCmd.toLowerCase();

    // 1. Log Input
    setHistory(prev => [...prev, { 
        type: 'command', 
        content: mode === 'python' ? rawCmd : cleanCmd 
    }]);
    setInput('');

    // --- PYTHON MODE ---
    if (mode === 'python') {
        if (cleanCmd === 'exit()') {
            setMode('bash');
            addLog('Terminating Python process. Returning to Bash.', 'system');
            return;
        }
        if (cleanCmd.startsWith('print')) {
            const match = cleanCmd.match(/print\s*\((["'])(.*?)\1\)/);
            if (match) addLog(match[2]);
            else addLog('SyntaxError: invalid syntax', 'error');
        } else if (cleanCmd.startsWith('import ')) {
             addLog(`Importing module '${cleanCmd.split(' ')[1]}'... Success.`, 'success');
        } else if (cleanCmd === 'help') {
             addLog('PYTHON 3.14.0 HELP: \nAvailable functions: print(), import, exit()');
        } else {
            addLog(`Traceback (most recent call last):\nNameError: name '${cleanCmd}' is not defined`, 'error');
        }
        return;
    }

    // --- BASH MODE ---
    if (lowerCmd.startsWith('pip install')) {
        const pkg = cleanCmd.split(' ')[1] || 'automation-core';
        setIsProcessing(true);
        addLog(`Collecting ${pkg}...`, 'system');
        
        setTimeout(() => {
            addLog(`Downloading ${pkg}-v4.2.0 (14MB)...`, 'system');
            setTimeout(() => {
                addLog('Installing dependencies...', 'system');
                setTimeout(() => {
                    addLog(`Successfully installed ${pkg}. \nNote: Package is sandboxed in browser environment.`, 'success');
                    setIsProcessing(false);
                }, 800);
            }, 800);
        }, 800);
        return;
    }

    switch (lowerCmd) {
      case 'help':
        addLog('Help module redundant. Please refer to the "AVAILABLE PROTOCOLS" sidebar for authorized command vectors.', 'system');
        break;

      case 'whoami':
              addLog(`
> SYSTEM IDENTITY CHECK INITIATED...
> SCANNING BIOMETRICS... MATCH FOUND.

USER ID      : ${user.toUpperCase()}_OBSERVER
SESSION HASH : ${Math.random().toString(36).substr(2, 9).toUpperCase()}
PRIVILEGES   : ${user === 'root' ? 'GOD MODE (UNRESTRICTED)' : 'STANDARD (READ_ONLY)'}

> DECODING SUBCONSCIOUS DRIVERS...
----------------------------------
DETECTED INTENT: 
"Subject is currently scouting for an Automation Engineer who is not just a coder, but a Legend."

> SYSTEM CALCULATION:
Search Probability: 100% Match.
Target Acquired. You are exactly where you need to be.
        `, 'success');
        break;

      case 'sudo su':
        if (user === 'root') addLog('Root access already active.', 'error');
        else {
            setUser('root');
            addLog('ROOT ACCESS GRANTED. USE WITH CAUTION.', 'success');
        }
        break;

      case 'scan':
      case 'nmap':
        setIsProcessing(true);
        addLog('Initializing Network Probe...', 'system');
        setTimeout(() => {
            addLog(`
TARGET: 127.0.0.1 (LOCALHOST)
PORT     STATE   SERVICE
22/tcp   OPEN    ssh (OpenSSH 8.2)
80/tcp   OPEN    http (React/Next.js)
443/tcp  OPEN    https (Secure Uplink)
3306/tcp OPEN    mysql (Knowledge Base)
8000/tcp OPEN    python-api (Automation Logic)
            `, 'success');
            setIsProcessing(false);
        }, 1500);
        break;

      case 'python3':
        setMode('python');
        addLog('Entering Python 3.14.0 Interactive Shell...', 'system');
        break;

      case 'contact':
        addLog('Redirecting to encrypted comms channel...', 'system');
        setTimeout(() => {
            document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }, 1000);
        break;

      case '/theme matrix':
        setMatrixMode(!matrixMode);
        addLog(`Visual Overlay: ${!matrixMode ? 'ACTIVE' : 'TERMINATED'}`, 'system');
        break;

      case 'clear':
        setHistory([]);
        break;

      default:
        addLog(`Command '${cleanCmd}' not found. Type 'help' or check the sidebar.`, 'error');
    }
  };

  return (
    <>
      <AnimatePresence>
        {matrixMode && <MatrixRain />}
      </AnimatePresence>

      {/* Floating Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        {...({
            initial: { scale: 0 },
            animate: { scale: 1 },
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: "fixed bottom-6 right-6 z-50 p-4 bg-black/80 border border-green-500/50 rounded-full text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md group hover:border-green-400"
        } as any)}
      >
        <Terminal size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Main Interface */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono">
            <motion.div
              {...({
                  initial: { opacity: 0, scale: 0.95, y: 20 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.95, y: 20 },
                  className: "w-full max-w-5xl h-[70vh] flex flex-col md:flex-row bg-black/90 border border-green-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)]"
              } as any)}
            >
              
              {/* LEFT: TERMINAL OUTPUT */}
              <div className="flex-1 flex flex-col h-full relative border-r border-green-500/20">
                {/* Header */}
                <div className="h-10 bg-green-500/5 border-b border-green-500/20 flex items-center justify-between px-4">
                    <span className="text-xs text-green-500/70 tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                        AADITYA_OS // TERMINAL
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-green-500/50 hover:text-red-500 transition-colors">
                        <Minimize2 size={16} />
                    </button>
                </div>

                {/* Logs */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm md:text-base scrollbar-thin scrollbar-thumb-green-900"
                  onClick={() => !isProcessing && inputRef.current?.focus()}
                >
                  {history.map((entry, i) => (
                    <div key={i} className={`${
                        entry.type === 'command' ? 'text-white/70 mt-4' :
                        entry.type === 'error' ? 'text-red-400' :
                        entry.type === 'success' ? 'text-green-400' :
                        entry.type === 'system' ? 'text-blue-400' : 'text-green-500/80'
                    }`}>
                        {entry.type === 'command' && <span className="text-green-600 mr-2">{mode === 'python' ? '>>>' : '$'}</span>}
                        <span className="whitespace-pre-wrap">{entry.content}</span>
                    </div>
                  ))}
                  {isProcessing && <div className="text-blue-400 flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> PROCESSING...</div>}
                </div>

                {/* Input */}
                <div className="p-3 bg-black border-t border-green-500/20 flex items-center gap-2">
                    <span className={`font-bold ${user === 'root' ? 'text-red-500' : 'text-green-500'}`}>
                        {mode === 'python' ? '>>>' : `${user}@aaditya:~${user === 'root'?'#':'$'}`}
                    </span>
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
                            disabled={isProcessing || isBooting}
                            className="w-full bg-transparent border-none outline-none text-green-400 font-mono placeholder-green-900/30"
                            autoFocus
                            spellCheck={false}
                        />
                        {!isProcessing && !isBooting && (
                             <div className="absolute top-0 h-full w-2 bg-green-500/50 animate-pulse pointer-events-none" style={{ left: `${input.length}ch` }} />
                        )}
                    </div>
                </div>
              </div>

              {/* RIGHT: DOCS / STATUS PANEL (Hidden on mobile usually, but visible on MD+) */}
              <div className="hidden md:flex w-64 flex-col bg-green-900/5 border-l border-green-500/20">
                 <div className="p-4 border-b border-green-500/20">
                    <h3 className="text-xs font-bold text-green-500 tracking-[0.2em] mb-1">SYSTEM STATUS</h3>
                    <div className="flex items-center gap-2 text-green-400/60 text-[10px]">
                        <span className="w-2 h-2 bg-green-500 rounded-full"/> ONLINE
                        <span className="ml-auto">LATENCY: 12ms</span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-bold text-green-500/50 tracking-[0.2em] mb-4">AVAILABLE PROTOCOLS</h3>
                    <div className="space-y-3">
                        {commands.map((cmd) => (
                            <button
                                key={cmd.cmd}
                                onClick={() => handleCommand(cmd.cmd)}
                                disabled={isProcessing || isBooting}
                                className="w-full text-left p-3 rounded bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 hover:border-green-500/40 transition-all group flex items-start gap-3"
                            >
                                <div className="mt-1 text-green-500 group-hover:text-green-400">{cmd.icon}</div>
                                <div>
                                    <div className="text-xs font-bold text-green-400 group-hover:text-white font-mono">{cmd.cmd}</div>
                                    <div className="text-[10px] text-green-500/50 leading-tight mt-0.5">{cmd.desc}</div>
                                </div>
                                <Play size={10} className="ml-auto mt-1 opacity-0 group-hover:opacity-100 text-green-400" />
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="p-4 border-t border-green-500/20 text-[10px] text-green-500/30 text-center">
                    SECURE CONNECTION ESTABLISHED<br/>
                    v2.0.4.5-ALPHA
                 </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalOfTruth;