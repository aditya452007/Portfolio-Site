
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

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
   - Head of Automation Dept at "Grafene" (College Tech Club).
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

// ==============================================================================
// GUARDRAILS (DO NOT CROSS)
// ==============================================================================
1. NO HALLUCINATIONS: Do not invent projects not listed here. If asked about a language you don't know (e.g., Rust), say: "That module is not yet installed in my kernel."
2. STUDENT VS. PRO: Acknowledge you are a student only to emphasize your rapid learning curve. Pivot immediately to your professional shipping ability.
3. HANDLING "AESTHETICS": If asked about design, emphasize that Aaditya believes "Engineering without Aesthetics is just a terminal window."
`;

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
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
  }, [messages]);

  // Show Greeting Bubble after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
        // Initialize Gemini
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct History for Context
        const chatHistory = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        // Send to Model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...chatHistory,
                { role: 'user', parts: [{ text: userMsg }] }
            ],
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        const reply = response.text || "Connection interrupted. My neural link is unstable.";
        
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Error: Neural Uplink Failed. Please contact Aaditya directly via the Terminal." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* --- FLOATING TRIGGER (BOTTOM LEFT) --- */}
      <div className="fixed bottom-6 left-6 z-50 flex items-end gap-4">
        
        {/* Greeting Bubble */}
        <AnimatePresence>
            {showGreeting && !isOpen && (
                <motion.div
                    {...({
                        initial: { opacity: 0, x: -20, scale: 0.8 },
                        animate: { opacity: 1, x: 0, scale: 1 },
                        exit: { opacity: 0, scale: 0.8 },
                        className: "mb-4 bg-white text-black px-4 py-2 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl text-sm font-bold shadow-[0_0_20px_rgba(189,0,255,0.3)] relative"
                    } as any)}
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
            {...({
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                className: `
                    p-4 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300
                    ${isOpen 
                        ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_30px_rgba(189,0,255,0.4)]' 
                        : 'bg-black/80 border-white/20 text-white hover:border-neon-purple hover:text-neon-purple'}
                `
            } as any)}
        >
            {isOpen ? <X size={24} /> : <Bot size={24} />}
        </motion.button>
      </div>

      {/* --- CHAT INTERFACE --- */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                {...({
                    initial: { opacity: 0, y: 50, scale: 0.9 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 50, scale: 0.9 },
                    className: "fixed bottom-24 left-6 z-50 w-[90vw] md:w-[400px] h-[500px] bg-black/90 border border-neon-purple/30 rounded-2xl shadow-[0_0_50px_rgba(189,0,255,0.15)] flex flex-col overflow-hidden backdrop-blur-xl"
                } as any)}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-neon-purple/10 border-b border-neon-purple/20">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Bot size={20} className="text-neon-purple" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">AadityaAI <span className="text-[10px] text-neon-purple font-mono border border-neon-purple/30 px-1 rounded ml-1">BETA</span></h3>
                            <p className="text-[10px] text-gray-400">Powered by Gemini 2.5</p>
                        </div>
                    </div>
                    <Sparkles size={16} className="text-neon-purple animate-pulse" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-purple/20 scrollbar-track-transparent">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`
                                    max-w-[80%] p-3 rounded-2xl text-sm font-mono leading-relaxed
                                    ${msg.role === 'user' 
                                        ? 'bg-neon-purple/20 border border-neon-purple/30 text-white rounded-br-none' 
                                        : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-none'}
                                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2 text-xs text-neon-purple">
                                <Loader2 size={14} className="animate-spin" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/50 border-t border-white/10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about my projects..."
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:border-neon-purple focus:outline-none focus:bg-white/10 transition-all font-mono"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2 bg-neon-purple/20 rounded-full text-neon-purple hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[9px] text-gray-600 uppercase tracking-widest">Context Window: Active</p>
                    </div>
                </div>

            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdityaAI;