import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Cloud } from 'lucide-react';
import { Experience as ExperienceType } from '../types';

// Updated Data Set
const experienceData: ExperienceType[] = [
  {
    id: 'role-1',
    role: 'Cloud Engineer',
    company: 'Google Cloud Skills Boost',
    date: 'Apr 2025 - Present',
    description: 'Mastering GCP infrastructure involving BigQuery, Bigtable, and Looker. Bridging theoretical cloud concepts with enterprise-grade deployment strategies.',
    tech: ['GCP', 'BigQuery', 'Looker'],
    type: 'work'
  },
  {
    id: 'role-2',
    role: 'AI Automation Engineer',
    company: 'Freelance',
    date: 'Present',
    description: 'Architecting autonomous agent workflows. Building MCP servers and n8n pipelines to automate complex business logic and OS-level operations.',
    tech: ['Python', 'LangChain', 'n8n'],
    type: 'work'
  },
  {
    id: 'role-3',
    role: 'IBM Intern',
    company: 'IBM Data Science',
    date: 'July 2025',
    description: 'Developed high-accuracy salary prediction models (>90%). Implemented advanced feature normalization and pipeline optimization on real-world HR datasets.',
    tech: ['Python', 'Pandas', 'Scikit-Learn'],
    type: 'work'
  },
  {
    id: 'role-4',
    role: 'Green Tech Intern',
    company: 'Shell x AICTE',
    date: 'June 2025 - July 2025',
    description: 'Engineered regression models for carbon emission analysis achieving R² 0.85. Optimized hyperparameters to reduce RMSE for environmental impact tracking.',
    tech: ['Python', 'Regression', 'Analytics'],
    type: 'work'
  },
  {
    id: 'edu-1',
    role: 'B.Tech CS (AI & ML)',
    company: 'RGPV University',
    date: '2024 - 2028',
    description: 'Deep dive into Algorithms, Neural Networks, and System Design. Specializing in Artificial Intelligence and Machine Learning paradigms.',
    tech: ['AI Theory', 'Neural Networks'],
    type: 'education'
  }
];

/**
 * @file Renders the "Experience" section of the portfolio.
 * @module Experience
 */

/**
 * The Experience component displays work and education history in a creative,
 * animated, orbital layout. The most recent experience is featured in the center,
 * with previous roles and education orbiting around it.
 *
 * This component does not accept any props.
 *
 * @returns {React.ReactElement} A section element containing the animated experience timeline.
 */
const Experience: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] py-24 overflow-hidden flex flex-col items-center justify-center bg-void">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="z-20 text-center mb-4 relative">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 uppercase">
          The Evolution <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">Protocol</span>
        </h2>
        <p className="text-gray-500 font-mono text-sm tracking-[0.2em] uppercase">
          Spatial Trajectory • Career Nodes
        </p>
      </div>

      {/* Main Content Stage */}
      <div className="w-full flex justify-center items-center relative perspective-1000 mt-12 md:mt-0 h-[600px]">
          
          <div className="relative flex items-center justify-center">
              {/* Static Decor Rings */}
              <div className="absolute w-[min(80vw,600px)] h-[min(80vw,600px)] rounded-full border border-white/5 animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute w-[min(60vw,450px)] h-[min(60vw,450px)] rounded-full border border-white/5 border-dashed animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

              {/* Central Core Node (Latest) */}
              <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="relative z-20 w-32 h-32 md:w-48 md:h-48 rounded-full bg-void border border-neon-cyan shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col items-center justify-center p-4 text-center group cursor-default"
              >
                  <div className="absolute inset-0 rounded-full bg-neon-cyan/5 blur-xl animate-pulse" />
                  <Cloud size={24} className="text-neon-cyan mb-2 md:mb-3" />
                  <div className="font-bold text-white text-xs md:text-sm leading-tight">{experienceData[0].role}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1 hidden md:block">{experienceData[0].company}</div>
                  <div className="mt-2 px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-[8px] md:text-[9px] border border-neon-cyan/20 uppercase tracking-widest">
                    Core Module
                  </div>
              </motion.div>

              {/* Rotating Container for Orbit Items */}
              {/* Note: The container spins, but items MUST counter-spin to stay upright */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              >
                  {experienceData.slice(1).map((item, index) => {
                      const total = experienceData.length - 1;
                      const angle = (index / total) * 360; // Degrees
                      
                      return (
                          <div
                              key={item.id}
                              className="absolute"
                              style={{
                                  transform: `rotate(${angle}deg) translate(min(38vw, 320px)) rotate(-${angle}deg)`, 
                                  // Logic: Rotate container to angle -> Push out by radius -> Rotate item back by negative angle to keep it upright
                              }}
                          >
                              {/* Counter-Rotation Animation for the continuous spin */}
                              <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                              >
                                  <motion.div 
                                      className="w-36 md:w-48 p-4 bg-void/90 backdrop-blur-xl border border-white/10 rounded-xl hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-300 cursor-pointer group/card relative"
                                      whileHover={{ scale: 1.1, zIndex: 50 }}
                                  >
                                      {/* Connector Line to Center (Visual only, tricky in rotation but added for feel) */}
                                      <div className="absolute top-1/2 right-full w-4 h-[1px] bg-white/10 group-hover/card:bg-neon-cyan/50 transition-colors" />

                                      <div className="flex items-center gap-2 mb-2 text-gray-500 group-hover/card:text-neon-cyan transition-colors">
                                          {item.type === 'work' ? <Briefcase size={12} /> : <GraduationCap size={12} />}
                                          <span className="text-[9px] font-mono">{item.date}</span>
                                      </div>
                                      
                                      <h3 className="text-xs md:text-sm font-bold text-gray-200 group-hover/card:text-white leading-tight mb-1 transition-colors">
                                        {item.role}
                                      </h3>
                                      <p className="text-[10px] text-gray-500 font-mono truncate group-hover/card:text-neon-cyan/80 transition-colors">
                                        {item.company}
                                      </p>

                                      {/* Tooltip Description (Visible on Hover) */}
                                      <div className="absolute top-full left-0 mt-2 w-full p-2 bg-black border border-white/10 rounded-lg text-[9px] text-gray-400 opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                        {item.description}
                                      </div>
                                  </motion.div>
                              </motion.div>
                          </div>
                      );
                  })}
              </motion.div>
          </div>
      </div>
    </section>
  );
};

export default Experience;