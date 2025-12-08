import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Minimize2, Loader2, Wifi, Battery, Shield, Cpu, Play, Trash2 } from 'lucide-react';

// ==============================================================================
// TYPES
// ==============================================================================

/**
 * Represents a log entry in the terminal history.
 */
interface LogEntry {
  id: string;
  type: 'command' | 'response' | 'system' | 'error' | 'success';
  content: string;
}

/**
 * Documentation for available commands.
 */
interface CommandDoc {
  cmd: string;
  desc: string;
  icon: React.ReactNode;
}

// ==============================================================================
// MATRIX RAIN COMPONENT
// ==============================================================================

/**
 * MatrixRain Component
 *
 * Renders a falling code "Matrix Rain" effect on an HTML5 Canvas.
 * Used as a background overlay when enabled via the terminal.
 */
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const fontSize = 14;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;':,./<>?";

    const initRain = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.ceil(canvas.width / fontSize);
      dropsRef.current = new Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0'; 
      ctx.font = `${fontSize}px monospace`;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    initRain();
    draw();

    const handleResize = () => initRain();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.canvas 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 0.15 }} 
      exit={{ opacity: 0 }} 
      ref={canvasRef} 
      className="fixed inset-0 z-[45] pointer-events-none mix-blend-screen" 
    />
  );
};

// ==============================================================================
// MAIN TERMINAL COMPONENT
// ==============================================================================

/**
 * TerminalOfTruth Component
 *
 * An interactive, gamified command-line interface (CLI).
 *
 * Features:
 * - Boot sequence simulation.
 * - Command execution (mocked Bash and Python).
 * - "Matrix Mode" toggle.
 * - Sidebar with available commands for discovery.
 * - Interactive typing and scrolling.
 */
const TerminalOfTruth: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);
  
  const [isBooting, setIsBooting] = useState(false);
  const hasBootedRef = useRef(false); // Ref to track boot status across renders
  
  const [user, setUser] = useState<'guest' | 'root'>('guest');
  const [mode, setMode] = useState<'bash' | 'python'>('bash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [history, setHistory] = useState<LogEntry[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const commands: CommandDoc[] = [
    { cmd: 'whoami', desc: 'Verify Identify', icon: <Shield size={14} /> },
    { cmd: 'scan', desc: 'Network Skill Analysis', icon: <Wifi size={14} /> },
    { cmd: 'python3', desc: 'Logic Interpreter', icon: <Cpu size={14} /> },
    { cmd: 'pip install', desc: 'Package Simulation', icon: <Loader2 size={14} /> },
    { cmd: 'contact', desc: 'Encrypted Uplink', icon: <Battery size={14} /> },
    { cmd: 'sudo su', desc: 'Elevate Privileges', icon: <Terminal size={14} /> },
  ];

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addLog = useCallback((content: string, type: LogEntry['type'] = 'response') => {
    setHistory(prev => [...prev, { id: generateId(), type, content }]);
  }, []);

  // --- BOOT SEQUENCE ---
  useEffect(() => {
    // Only run if opened and we haven't booted in this session yet
    if (isOpen && !hasBootedRef.current) {
      setIsBooting(true);
      hasBootedRef.current = true; // Mark as booted immediately

      const bootSteps = [
        { msg: 'INITIALIZING AADITYA_OS KERNEL...', delay: 200 },
        { msg: 'LOADING NEURAL INTERFACES...', delay: 600 },
        { msg: 'MOUNTING FILE SYSTEM (READ-ONLY)...', delay: 1100 },
        { msg: 'CONNECTING TO MAIN MAINFRAME...', delay: 1600 },
        { msg: 'ACCESS GRANTED. WELCOME, GUEST.', delay: 2000 },
      ];

      let timeouts: NodeJS.Timeout[] = [];

      bootSteps.forEach((step, index) => {
        const timeout = setTimeout(() => {
          // Check if user closed terminal mid-boot, but don't break the logic
          addLog(step.msg, 'system');
          
          if (index === bootSteps.length - 1) {
             setIsBooting(false); // ✅ UNLOCK INPUT
             addLog('Terminal Ready. Awaiting Input.\nReview "AVAILABLE PROTOCOLS" on the right panel for authorized commands.', 'response');
             // Auto focus after boot
             setTimeout(() => inputRef.current?.focus(), 50);
          }
        }, step.delay);
        timeouts.push(timeout);
      });

      // Cleanup timeouts if component unmounts (closes)
      return () => timeouts.forEach(clearTimeout);
    }
  }, [isOpen, addLog]);
  // Focus Management
  useEffect(() => {
    if (isOpen && !isBooting && !isProcessing) {
        // Force focus when state settles
        setTimeout(() => inputRef.current?.focus(), 100);
    }
    // Auto-scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, isBooting, isProcessing]);

  // Keyboard toggle
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

  const handleCommand = async (cmd: string) => {
    if (isProcessing || isBooting) return;
    if (!cmd.trim()) return;

    const rawCmd = cmd;
    const cleanCmd = cmd.trim();
    const lowerCmd = cleanCmd.toLowerCase();

    setHistory(prev => [...prev, { 
        id: generateId(),
        type: 'command', 
        content: mode === 'python' ? rawCmd : cleanCmd 
    }]);
    setInput('');

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

    // Bash Commands
    if (lowerCmd.startsWith('pip install')) {
        const pkg = cleanCmd.split(' ')[1] || 'automation-core';
        setIsProcessing(true);
        addLog(`Collecting ${pkg}...`, 'system');
        
        setTimeout(() => {
            addLog(`Downloading ${pkg}-v4.2.0 (14MB)...`, 'system');
            setTimeout(() => {
                addLog('Installing dependencies...', 'system');
                setTimeout(() => {
                    addLog(`Successfully installed ${pkg}. \nNote: Package is sandboxed.`, 'success');
                    setIsProcessing(false);
                    setTimeout(() => inputRef.current?.focus(), 50);
                }, 800);
            }, 800);
        }, 800);
        return;
    }

    switch (lowerCmd) {
      case 'help':
        addLog('Available Commands: whoami, scan, python3, pip install <pkg>, contact, sudo su, clear', 'system');
        break;

      case 'whoami':
        addLog(`USER: ${user.toUpperCase()}_OBSERVER\nACCESS: ${user === 'root' ? 'UNRESTRICTED' : 'READ_ONLY'}\nMISSION: Scouting for Top-Tier Automation Engineers.`, 'success');
        break;

      case 'sudo su':
        if (user === 'root') addLog('Root access already active.', 'error');
        else {
            setUser('root');
            addLog('ROOT ACCESS GRANTED. SYSTEM UNLOCKED.', 'success');
        }
        break;

      case 'scan':
      case 'nmap':
        setIsProcessing(true);
        addLog('Initializing Network Probe...', 'system');
        setTimeout(() => {
            addLog(`TARGET: LOCALHOST\nPORT 22 [SSH]: OPEN\nPORT 80 [HTTP]: OPEN\nPORT 443 [HTTPS]: OPEN\n\nVULNERABILITY SCAN: 0 THREATS FOUND.`, 'success');
            setIsProcessing(false);
            setTimeout(() => inputRef.current?.focus(), 50);
        }, 1500);
        break;

      case 'python3':
        setMode('python');
        addLog('Entering Python 3.14.0 Interactive Shell... (type exit() to quit)', 'system');
        break;

      case 'contact':
        addLog('Redirecting to encrypted comms channel...', 'system');
        setTimeout(() => {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                addLog('Uplink established.', 'success');
            }
            setTimeout(() => setIsOpen(false), 1500);
        }, 1000);
        break;

      case '/theme matrix':
        setMatrixMode(!matrixMode);
        addLog(`Visual Overlay: ${!matrixMode ? 'ACTIVE' : 'TERMINATED'}`, 'system');
        break;

      case 'clear':
        setHistory([]);
        hasBootedRef.current = true; // Don't reboot on clear
        break;

      default:
        addLog(`Command '${cleanCmd}' not found. Type 'help' for assistance.`, 'error');
    }
  };

  return (
    <>
      <AnimatePresence>
        {matrixMode && <MatrixRain />}
      </AnimatePresence>

      {/* Floating Trigger - Z-Index 50 to sit above most things, but below Modal */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-black/80 border border-green-500/50 rounded-full text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md group hover:border-green-400"
      >
        <Terminal size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Main Interface - Z-Index 100 to cover everything */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl h-[70vh] flex flex-col md:flex-row bg-[#0a0a0a] border border-green-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] relative"
            >
              
              {/* LEFT: TERMINAL OUTPUT */}
              <div className="flex-1 flex flex-col h-full relative border-r border-green-500/20">
                {/* Header */}
                <div className="h-10 bg-green-500/5 border-b border-green-500/20 flex items-center justify-between px-4 select-none">
                    <span className="text-xs text-green-500/70 tracking-widest flex items-center gap-2">
                        <div className={`w-2 h-2 bg-green-500 rounded-full ${isProcessing || isBooting ? 'animate-ping' : ''}`}/>
                        AADITYA_OS // TERMINAL
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-green-500/50 hover:text-red-500 transition-colors">
                        <Minimize2 size={16} />
                    </button>
                </div>

                {/* Logs */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm md:text-base scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent"
                  onClick={() => !isProcessing && inputRef.current?.focus()}
                >
                  {history.map((entry) => (
                    <div key={entry.id} className={`${
                        entry.type === 'command' ? 'text-white/70 mt-4' :
                        entry.type === 'error' ? 'text-red-400' :
                        entry.type === 'success' ? 'text-green-400' :
                        entry.type === 'system' ? 'text-blue-400' : 'text-green-500/80'
                    }`}>
                        {entry.type === 'command' && <span className="text-green-600 mr-2 select-none">{mode === 'python' ? '>>>' : '$'}</span>}
                        <span className="whitespace-pre-wrap break-words">{entry.content}</span>
                    </div>
                  ))}
                  
                  {(isProcessing || isBooting) && (
                      <div className="text-green-500/50 flex items-center gap-2 mt-2 animate-pulse">
                          <span className="w-2 h-4 bg-green-500/50"/>
                      </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-black/50 border-t border-green-500/20 flex items-center gap-2">
                    <span className={`font-bold select-none ${user === 'root' ? 'text-red-500' : 'text-green-500'}`}>
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
                            className="w-full bg-transparent border-none outline-none text-green-400 font-mono placeholder-green-900/30 disabled:cursor-wait"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                </div>
              </div>

              {/* RIGHT: SIDEBAR (Hidden on mobile) */}
              <div className="hidden md:flex w-64 flex-col bg-green-900/5 border-l border-green-500/20">
                 <div className="p-4 border-b border-green-500/20">
                    <h3 className="text-[10px] font-bold text-green-500 tracking-[0.2em] mb-2">SYSTEM STATUS</h3>
                    <div className="flex flex-col gap-1 text-green-400/60 text-[10px] font-mono">
                        <div className="flex justify-between"><span>KERNEL</span> <span>v4.2.0</span></div>
                        <div className="flex justify-between"><span>UPTIME</span> <span>99.9%</span></div>
                        <div className="flex justify-between"><span>SECURE</span> <span className="text-green-400">TRUE</span></div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-[10px] font-bold text-green-500/50 tracking-[0.2em] mb-4">AVAILABLE PROTOCOLS</h3>
                    <div className="space-y-2">
                        {commands.map((cmd) => (
                            <button
                                key={cmd.cmd}
                                onClick={() => handleCommand(cmd.cmd)}
                                disabled={isProcessing || isBooting}
                                className="w-full text-left p-2 rounded hover:bg-green-500/10 border border-transparent hover:border-green-500/20 transition-all group flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="text-green-600 group-hover:text-green-400">{cmd.icon}</div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-green-500 group-hover:text-white font-mono">{cmd.cmd}</div>
                                </div>
                                <Play size={8} className="opacity-0 group-hover:opacity-100 text-green-400" />
                            </button>
                        ))}
                    </div>
                 </div>
                 
                 <div className="p-4 border-t border-green-500/20">
                    <button 
                        onClick={() => { setHistory([]); hasBootedRef.current = true; }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-mono transition-colors"
                    >
                        <Trash2 size={12} /> PURGE LOGS
                    </button>
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