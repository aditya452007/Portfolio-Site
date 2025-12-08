import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Github, ExternalLink, Terminal, Brain, Zap } from 'lucide-react';

// ==============================================================================
// TYPES
// ==============================================================================

export interface Project {
  id: string;
  title: string;
  tagline: string;
  tech: string[];
  problem: string;
  solution: string;
  impact: string;
  image: string;
  github?: string;
  demo?: string;
}

// ==============================================================================
// DATA
// ==============================================================================

const projects: Project[] = [
  {
    id: 'mcp-server',
    title: 'OS-Level AI Agent (MCP)',
    tagline: 'Control your Operating System with natural language.',
    tech: ['Python', 'Model Context Protocol', 'Shell'],
    problem: 'Manual CLI operations are slow and prone to syntax errors. Context switching between code editors and terminals kills flow.',
    solution: 'Secure, permission-based shell execution. Diagnoses system issues and manages files conversationally. Acts as a high-privilege agent wrapper for your OS.',
    impact: 'Enables safe, autonomous diagnosis and resolution of system issues. Reduces context switching by allowing "conversational" file management.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/1.png',
    github: 'https://github.com/aditya452007/Ai-Agents/tree/main/MCP'
  },
  {
    id: 'biz-agent',
    title: 'Autonomous Business Orchestrator',
    tagline: 'Eliminate manual logistics forever.',
    tech: ['n8n', 'Google Workspace', 'Telegram API'],
    problem: 'Fragmentation across email, calendars, and chat apps creates operational drag and missed opportunities.',
    solution: 'A self-healing operational loop. Parses emails, schedules meetings, and updates tasks autonomously while you sleep. Acts as a central nervous system for business logic.',
    impact: 'Zero-touch scheduling and communication. Transforms reactive chaos into proactive, automated order.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/2.png',
    github: 'https://github.com/aditya452007/N8N_AI_AGENTS/blob/main/WORKFLOWS/AI-AGENT-KIT/Telegram/Personal%20Assitant.json'
  },
  {
    id: 'predictive-models',
    title: 'Enterprise Predictive Modeling',
    tagline: 'Turn noise into strategy.',
    tech: ['Scikit-Learn', 'Pandas', 'Matplotlib'],
    problem: 'Raw enterprise data is often too noisy to drive strategic decisions regarding carbon footprints or talent acquisition.',
    solution: 'High-precision regression systems. Achieved 0.85 R² in Carbon Emissions tracking and >90% accuracy in Salary Forecasting through advanced hyperparameter tuning.',
    impact: 'Directly converts raw chaotic datasets into clear, actionable executive strategy.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/3.png',
    github: 'https://github.com/aditya452007/AICTE-SHELL-INTERNSHIP-JUNE-2025'
  },
  {
    id: 'rag-agents',
    title: '🧠 RAG Agents (Doc & Web)',
    tagline: 'The end of information overload.',
    tech: ['Gemini 2.5 Flash', 'LangChain', 'FAISS'],
    problem: 'Static documents and dynamic web content are siloed, making real-time knowledge synthesis impossible.',
    solution: 'A dual-pipeline intelligence system. Ingests PDFs and scrapes live URLs to answer queries in real-time. Optimized for free-tier CPU environments.',
    impact: 'Instantaneous extraction of intelligence from static PDFs and dynamic URLs. Chat with your entire data stack.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/4.png',
    github: 'https://github.com/aditya452007/Ai-Agents/tree/main/RAG'
  },
  {
    id: 'n8n-repo',
    title: 'n8n Automation Repository',
    tagline: 'The blueprint for total automation.',
    tech: ['n8n Workflow Templates', 'JSON'],
    problem: 'Building robust automations from scratch is time-consuming and prone to logic errors.',
    solution: 'A library of pre-built, production-ready agents. Automate workspace setup, social tracking, and course management instantly.',
    impact: 'Deploy complex workflows in seconds. A modular arsenal of self-assembling automation bots.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/5.png',
    github: 'https://github.com/aditya452007/N8N_AI_AGENTS'
  },
  {
    id: 'prompt-lib',
    title: '📂 The Prompt Library',
    tagline: "Unlock the LLM's full reasoning potential.",
    tech: ['System Instructions', 'Prompt Engineering'],
    problem: 'Most LLM outputs are mediocre due to lack of structured, constrained context.',
    solution: 'Professional-grade prompts for agent creation, coding, and career acceleration. Tested for maximum output quality and reasoning depth.',
    impact: 'Transforms standard LLMs into expert-level consultants. The ultimate control layer for generative AI.',
    image: 'https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/6.png',
    github: 'https://github.com/aditya452007/Prompt-Library'
  }
];

// ==============================================================================
// COMPONENT
// ==============================================================================

const Projects: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  const selectedProject = projects.find(p => p.id === selectedId);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedId]);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
    });
  };

  return (
    <section className="relative min-h-screen py-24 px-4 md:px-12 flex flex-col justify-center bg-[#0a0a0a]">
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-16 border-l-4 border-[#00f0ff] pl-6"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-white uppercase">
            Deployment <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bd00ff]">Protocols</span>
        </h2>
        <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Tactical Architectures & Systems</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {projects.map((project, index) => {
          const isLoaded = loadedImages.has(project.id);
          return (
            <motion.div
                key={project.id}
                layoutId={`card-${project.id}`}
                onClick={() => setSelectedId(project.id)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative cursor-pointer"
            >
                {/* Card Content */}
                <div className="h-[400px] w-full rounded-xl bg-white/5 border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-[#00f0ff]/50 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] backdrop-blur-sm flex flex-col">
                    
                {/* Image Placeholder with Overlay */}
                <div className="h-[45%] w-full bg-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
                    {/* Tech Status Dots */}
                    <div className="absolute top-3 right-3 z-20 flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_5px_rgba(0,240,255,1)]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                    
                    {/* Loading Skeleton */}
                    {!isLoaded && (
                        <div className="absolute inset-0 z-0 bg-gray-900">
                            <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
                        </div>
                    )}

                    <motion.img 
                        src={project.image} 
                        alt={project.title}
                        onLoad={() => handleImageLoad(project.id)}
                        onError={(e) => {
                             // Fallback if image fails
                             (e.target as HTMLImageElement).style.display = 'none';
                             setLoadedImages(prev => new Set(prev).add(project.id));
                        }}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 ${isLoaded ? 'opacity-60 group-hover:opacity-100' : 'opacity-0'}`}
                    />
                </div>

                <div className="p-6 relative z-20 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex gap-2 mb-3 flex-wrap">
                        {project.tech.slice(0, 3).map(t => (
                            <span key={t} className="text-[9px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300 font-mono">
                            {t}
                            </span>
                        ))}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors leading-tight">{project.title}</h3>
                        <p className="text-gray-400 text-xs font-mono line-clamp-3">{project.tagline}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono uppercase">System Ready</span>
                        <div className="flex items-center gap-2 text-[#00f0ff] text-xs font-mono opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Initialize <ArrowRight size={12} />
                        </div>
                    </div>
                </div>
                </div>
            </motion.div>
          );
        })}
      </div>

      {/* SlideOver Panel */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              layoutId={`card-${selectedProject.id}`}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-8 md:p-12 relative min-h-screen flex flex-col">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white z-50"
                  aria-label="Close Project Details"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-2 text-white uppercase tracking-tight">{selectedProject.title}</h2>
                    <p className="text-[#ff0099] font-mono text-sm">{selectedProject.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                   {selectedProject.tech.map(t => (
                     <span key={t} className="px-3 py-1 rounded-full bg-gray-800 text-xs font-mono text-gray-300 border border-gray-700">
                       {t}
                     </span>
                   ))}
                </div>

                <div className="space-y-12 flex-1">
                  <div className="relative pl-6 border-l border-red-500/50">
                    <div className="absolute -left-3 top-0 bg-[#0a0a0a] p-1 text-red-500"><Zap size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2 uppercase tracking-wide text-xs">Target Inefficiency</h3>
                    <p className="text-gray-400 leading-relaxed font-mono text-sm">{selectedProject.problem}</p>
                  </div>

                  <div className="relative pl-6 border-l border-[#00f0ff]/50">
                    <div className="absolute -left-3 top-0 bg-[#0a0a0a] p-1 text-[#00f0ff]"><Brain size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2 uppercase tracking-wide text-xs">Tactical Solution</h3>
                    <p className="text-gray-400 leading-relaxed font-mono text-sm">{selectedProject.solution}</p>
                  </div>

                  <div className="relative pl-6 border-l border-green-500/50">
                     <div className="absolute -left-3 top-0 bg-[#0a0a0a] p-1 text-green-500"><Terminal size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2 uppercase tracking-wide text-xs">Operational Impact</h3>
                    <p className="text-gray-400 leading-relaxed font-mono text-sm">{selectedProject.impact}</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4">
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-[#00f0ff] transition-all text-sm font-mono uppercase tracking-wider group"
                    >
                      <Github size={18} className="group-hover:text-[#00f0ff] transition-colors" /> 
                      Access Source Code
                    </a>
                  )}
                  {selectedProject.demo && (
                     <a 
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded hover:bg-[#00f0ff]/20 text-[#00f0ff] transition-all text-sm font-mono uppercase tracking-wider"
                    >
                      <ExternalLink size={18} /> Initialize Demo
                    </a>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;