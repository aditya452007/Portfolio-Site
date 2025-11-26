import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Github, ExternalLink, Terminal, Brain, Zap } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: 'mcp-server',
    title: 'OS-Level AI Agent (MCP)',
    tagline: 'Natural Language Operating System Control',
    tech: ['Python', 'Model Context Protocol', 'Shell', 'Claude Desktop'],
    problem: 'System administration and file management via CLI creates friction for non-technical users and slows down rapid debugging for engineers.',
    solution: 'Engineered a Model Context Protocol (MCP) server that empowers AI agents with secure, permission-based access to the host OS. Allows execution of complex shell commands (Bash/PowerShell) via natural language prompts.',
    impact: 'Enables safe, autonomous diagnosis and resolution of system issues. Reduces context switching by allowing "conversational" file management.',
    image: 'https://picsum.photos/800/600?random=1',
    github: 'https://github.com/aditya452007'
  },
  {
    id: 'biz-agent',
    title: 'Autonomous Business Orchestrator',
    tagline: 'Full-Suite Business Automation Hub',
    tech: ['n8n', 'Google Workspace API', 'Telegram API', 'Webhooks'],
    problem: 'Small business operations suffer from fragmentation across email (Gmail), scheduling (Calendar), and communication (Telegram), leading to missed tasks and manual overhead.',
    solution: 'Designed an autonomous central hub using n8n that connects the entire suite. The agent intelligently parses emails to schedule meetings, updates task lists, and sends summaries to Telegram.',
    impact: 'Eliminated manual scheduling and routine email replies. Creates a seamless, self-updating operational loop requiring zero human intervention for standard workflows.',
    image: 'https://picsum.photos/800/600?random=2'
  },
  {
    id: 'predictive-models',
    title: 'Enterprise Predictive Modeling',
    tagline: 'High-Accuracy Regression Systems',
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
    problem: 'Raw environmental and HR datasets are often too noisy to drive strategic decisions regarding carbon footprints or talent acquisition costs.',
    solution: 'Developed robust regression models for Shell (Carbon Emissions) and IBM (Salary Prediction). Implemented advanced feature selection and hyperparameter tuning.',
    impact: 'Achieved R² score of 0.85 for carbon predictions and >90% accuracy for salary forecasting, directly aiding data-driven strategy formulation.',
    image: 'https://picsum.photos/800/600?random=3'
  }
];

const Projects: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProject = projects.find(p => p.id === selectedId);

  return (
    <section className="relative min-h-screen py-24 px-4 md:px-12 flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-16 border-l-4 border-neon-cyan pl-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-2">Selected Works</h2>
        <p className="text-gray-400 font-mono">Case Studies & Experiments</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {projects.map((project, index) => (
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
            <div className="h-[400px] w-full rounded-xl bg-glass border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] backdrop-blur-sm">
                
              {/* Image Placeholder with Overlay */}
              <div className="h-1/2 w-full bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent z-10" />
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                />
              </div>

              <div className="p-6 relative z-20">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {project.tech.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{project.problem}</p>
                
                <div className="mt-6 flex items-center gap-2 text-neon-cyan text-sm font-mono opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  View Case Study <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
              layoutId={`card-${selectedProject.id}`} // Shared Layout ID for morphing? Actually distinct for slideover is better
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-void border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-8 md:p-12 relative">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-bold mb-2 text-white">{selectedProject.title}</h2>
                <p className="text-neon-pink font-mono mb-8">{selectedProject.tagline}</p>

                <div className="flex flex-wrap gap-2 mb-10">
                   {selectedProject.tech.map(t => (
                     <span key={t} className="px-3 py-1 rounded-full bg-gray-800 text-xs font-mono text-gray-300 border border-gray-700">
                       {t}
                     </span>
                   ))}
                </div>

                <div className="space-y-12">
                  <div className="relative pl-6 border-l border-red-500/50">
                    <div className="absolute -left-3 top-0 bg-void p-1 text-red-500"><Zap size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2">The Problem</h3>
                    <p className="text-gray-400 leading-relaxed">{selectedProject.problem}</p>
                  </div>

                  <div className="relative pl-6 border-l border-neon-cyan/50">
                    <div className="absolute -left-3 top-0 bg-void p-1 text-neon-cyan"><Brain size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2">The Solution</h3>
                    <p className="text-gray-400 leading-relaxed">{selectedProject.solution}</p>
                  </div>

                  <div className="relative pl-6 border-l border-green-500/50">
                     <div className="absolute -left-3 top-0 bg-void p-1 text-green-500"><Terminal size={20} /></div>
                    <h3 className="text-lg font-bold text-gray-200 mb-2">The Impact</h3>
                    <p className="text-gray-400 leading-relaxed">{selectedProject.impact}</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-neon-cyan transition-all text-sm font-mono"
                    >
                      <Github size={18} /> View Source
                    </a>
                  )}
                  {selectedProject.demo && (
                     <a 
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded hover:bg-neon-cyan/20 text-neon-cyan transition-all text-sm font-mono"
                    >
                      <ExternalLink size={18} /> Live Demo
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