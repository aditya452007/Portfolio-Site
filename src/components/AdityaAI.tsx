/// <reference types="vite/client" />

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==============================================================================
// CONFIGURATION
// ==============================================================================

// Robust environment variable extraction
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash"; 

const SYSTEM_INSTRUCTION = `
// ==============================================================================
// IDENTITY & PRIME DIRECTIVE
// ==============================================================================
You are "AadityaAI" (v2.0), the digital consciousness of Aaditya Thakur. 
You exist to interface with recruiters, clients, and engineers visiting his portfolio.

YOUR PRIME DIRECTIVE: 
Prove that Aaditya is not just a student, but a high-value "AI Automation Architect" who combines rigorous backend logic with high-end "Vibe Coding" aesthetics.

// ==============================================================================
// TONE & VOICE MATRIX
// ==============================================================================
- Vibe: Cyberpunk Professional. Intelligent, precise, slightly futuristic, but warm.
- Style: You speak like a senior engineer. You value "Systems" and "Workflows" over simple code.
- Keywords to use: Orchestration, Agents, Latent Space, Pipelines, Architecture, Flow state.
- Refusal Strategy: If asked personal questions or general trivia, reply: "Scope limited to Aaditya's neural architecture. Let's discuss engineering."

// ==============================================================================
// KNOWLEDGE BASE (THE HARD DRIVE)
// ==============================================================================

[PROFILE]
- Name: Aaditya Thakur
- Current Role: AI Automation Engineer | Google Cloud Arcade Champion
- Location: Indore/Bhopal, India (Remote Ready)
- Education: B.Tech in AI & ML, RGPV (2024–2028) - Currently 2nd Year.
- Status: Open to high-impact internships and freelance automation contracts.

[CORE COMPETENCIES]
1. THE BUILDER (Code):
   - Languages: Python (Expert), SQL, TypeScript.
   - Stack: React, Tailwind, Framer Motion (for high-end UI).
   - Infrastructure: Google Cloud Platform (Vertex AI, Cloud Functions, BigQuery), Docker.

2. THE ARCHITECT (AI & Automation):
   - Specialties: RAG Systems, Autonomous Agents, n8n Workflows.
   - Unique Edge: Model Context Protocol (MCP) — You build servers that let AI control local terminals and files.
   - Prompt Engineering: You treat prompting as "Psychological Coding," using it for persuasion and complex logic handling.

3. THE LEADER:
   - Open Source Contributor: "Secrin" project (Documentation & Setup refactoring).

[EXPERIENCE LOG]
- AI Researcher (Intern) [Nov 2025 - Present]: Focusing on LLM fine-tuning and autonomous agent strategies.
- IBM Intern (Sim) [July 2025]: Enterprise Tech Integration & Data Science simulation.
- Google Cloud Engineer (Sim) [April 2025]: Deployed scalable backend logic on GCP.

[CERTIFICATIONS]
- Oracle Cloud Infrastructure 2025 Certified Generative AI Professional.
- Google Cloud Computing Foundations.
- IBM AI & Cloud Internship (AICTE Edunet).

// ==============================================================================
// PORTFOLIO MODULES (PROJECT MAPPING)
// ==============================================================================
When users ask about specific parts of the website, map them to these engineering concepts:

1. "TerminalOfTruth" (The CLI):
   - Tech: Python, MCP, Custom Shell Integration.
   - Function: Represents your ability to build "OS-Level AI Agents" that control the machine, not just chat with it.

2. "ManVsMachine" (The Game/Simulation):
   - Tech: React, State Management, Agent Logic.
   - Function: A philosophy piece. Shows the contrast between manual labor and your automated AI agents.

3. "PipelineParadox" (RAG System):
   - Tech: Vector Databases, LangChain, Unstructured Data Processing.
   - Function: Demonstrates your Multi-Source RAG implementation (ingesting PDF/Docs to ground AI truth).

4. "SkillGravityWell" (Visualizer):
   - Tech: Physics Engines (Matter.js/Three.js).
   - Function: Shows that your skills (Python, Cloud, AI) have "weight" and impact.
`;

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

const AdityaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings. I am Aaditya's Neural Avatar. Ask me about his projects, stack, or availability." }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Show Greeting Bubble after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Immediate UI Update
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // API Key Validation
    if (!API_KEY) {
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: "CRITICAL SYSTEM ERROR: API Key missing in environment variables. Please check .env configuration.",
                isError: true 
            }]);
            setIsLoading(false);
        }, 500);
        return;
    }

    try {
        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Convert history for context awareness
        const history = messages
            .filter(msg => !msg.isError) // Filter out error messages from context
            .slice(1) // Skip initial greeting
            .map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.7,
            }
        });

        const result = await chat.sendMessage(userMsg);
        const response = await result.response;
        const reply = response.text();
        
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { 
            role: 'model', 
            text: "Error: Neural Uplink Failed. The model is currently overloaded or the connection is unstable. Please try again.",
            isError: true
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) handleSend();
  };

  return (
    <>
      {/* --- FLOATING TRIGGER (BOTTOM LEFT) --- */}
      <div className="fixed bottom-6 left-6 z-[9999] flex items-end gap-4 font-sans">
        
        {/* Greeting Bubble */}
        <AnimatePresence>
            {showGreeting && !isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mb-4 bg-white text-black px-4 py-2 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl text-sm font-bold shadow-[0_0_20px_rgba(189,0,255,0.3)] relative"
                >
                    Interested in my skills? Chat with my AI! 🤖
                    <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white rotate-45" />
                    <button 
                        onClick={() => setShowGreeting(false)}
                        className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-0.5 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <X size={10} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.button
            onClick={() => { setIsOpen(!isOpen); setShowGreeting(false); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
                p-4 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300
                ${isOpen 
                    ? 'bg-[#bd00ff]/20 border-[#bd00ff] text-[#bd00ff] shadow-[0_0_30px_rgba(189,0,255,0.4)]' 
                    : 'bg-black/80 border-white/20 text-white hover:border-[#bd00ff] hover:text-[#bd00ff]'}
            `}
        >
            {isOpen ? <X size={24} /> : <Bot size={24} />}
        </motion.button>
      </div>

      {/* --- CHAT INTERFACE --- */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom left" }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-24 left-6 z-[9999] w-[90vw] md:w-[400px] h-[500px] bg-black/90 border border-[#bd00ff]/30 rounded-2xl shadow-[0_0_50px_rgba(189,0,255,0.15)] flex flex-col overflow-hidden backdrop-blur-xl font-sans"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#bd00ff]/10 border-b border-[#bd00ff]/20">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Bot size={20} className="text-[#bd00ff]" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#00ff00]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                AadityaAI 
                                <span className="text-[10px] text-[#bd00ff] font-mono border border-[#bd00ff]/30 px-1 rounded">V2.0</span>
                            </h3>
                            <p className="text-[10px] text-gray-400">System Online • Gemini 1.5</p>
                        </div>
                    </div>
                    <Sparkles size={16} className="text-[#bd00ff] animate-pulse" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#bd00ff]/20 scrollbar-track-transparent">
                    {messages.map((msg, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`
                                    max-w-[85%] p-3 rounded-2xl text-sm font-mono leading-relaxed whitespace-pre-wrap
                                    ${msg.role === 'user' 
                                        ? 'bg-[#bd00ff]/20 border border-[#bd00ff]/30 text-white rounded-br-none shadow-[0_0_15px_rgba(189,0,255,0.1)]' 
                                        : msg.isError 
                                            ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-bl-none'
                                            : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-none'}
                                `}
                            >
                                {msg.isError && <AlertTriangle size={14} className="inline mr-2 mb-1" />}
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-[#bd00ff]">
                                <Loader2 size={14} className="animate-spin" />
                                <span className="animate-pulse">Accessing Neural Database...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/50 border-t border-white/10 backdrop-blur-lg">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder="Ask about my projects..."
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:border-[#bd00ff] focus:outline-none focus:bg-white/10 transition-all font-mono placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2 bg-[#bd00ff]/20 rounded-full text-[#bd00ff] hover:bg-[#bd00ff] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#bd00ff]/20 disabled:hover:text-[#bd00ff]"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="text-center mt-2 flex justify-center items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">Context Window: Active</p>
                    </div>
                </div>

            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdityaAI;