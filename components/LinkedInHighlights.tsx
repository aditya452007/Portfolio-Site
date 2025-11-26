
import React, { useState } from 'react';
import { motion, useTransform, useSpring, useMotionValue, MotionValue } from 'framer-motion';
import { Linkedin, ThumbsUp, MessageCircle, Share2, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SocialPost } from '../types';

const posts: SocialPost[] = [
  {
    id: 1,
    title: "Google Cloud Arcade Champion",
    excerpt: "Honored to earn the Champion badge! 🏆 Deep diving into BigQuery optimizations and GenAI pipelines on GCP has been a game-changer for my workflow.",
    likes: 342,
    comments: 28,
    date: "2d ago",
    image: "https://picsum.photos/seed/gcp/600/300",
    url: "https://linkedin.com",
    tags: ["#GCP", "#CloudComputing"]
  },
  {
    id: 2,
    title: "Building Autonomous Agents",
    excerpt: "Just shipped a new MCP server that lets Claude Desktop control my local OS shell. The future of devops is conversational. 🤖✨",
    likes: 856,
    comments: 142,
    date: "1w ago",
    image: "https://picsum.photos/seed/ai/600/300",
    url: "https://linkedin.com",
    tags: ["#AI", "#Automation", "#MCP"]
  },
  {
    id: 3,
    title: "IBM Data Science Intern",
    excerpt: "Excited to share my salary prediction model achieving >90% accuracy. Applied advanced feature normalization to real-world HR datasets.",
    likes: 215,
    comments: 19,
    date: "2w ago",
    image: "https://picsum.photos/seed/ibm/600/300",
    url: "https://linkedin.com",
    tags: ["#DataScience", "#IBM", "#Python"]
  },
  {
    id: 4,
    title: "Hackathon Win: EcoTech",
    excerpt: "Our team built a carbon footprint analyzer using Python & Scikit-learn. Proud to take home 1st place! 🌿💻",
    likes: 189,
    comments: 34,
    date: "1mo ago",
    image: "https://picsum.photos/seed/hack/600/300",
    url: "https://linkedin.com",
    tags: ["#Hackathon", "#GreenTech"]
  }
];

/**
 * Renders a single, interactive 3D card for the desktop view.
 * This component uses Framer Motion's `useTransform` to create a dynamic
 * rotational effect based on the current `centerIndex`.
 *
 * @param {object} props - The component props.
 * @param {SocialPost} props.post - The social post data to display.
 * @param {number} props.index - The index of this card in the array.
 * @param {MotionValue<number>} props.centerIndex - A MotionValue representing the currently centered card index.
 * @returns {React.ReactElement} A motion.div element representing the card.
 */
const Card: React.FC<{
    post: SocialPost;
    index: number;
    centerIndex: MotionValue<number>;
}> = ({ post, index, centerIndex }) => {

  // LOGIC: Rotation depends entirely on the spring-animated centerIndex
  const rotate = useTransform(centerIndex, (current) => (index - current) * 25);
  
  // Pivot point logic - slightly increased multiplier for a wider arc
  const y = useTransform(rotate, (r) => Math.abs(r) * 1.5); 
  
  // Opacity: Adjusted for better visibility
  // Falls off slower (divisor 180) and clamps at 0.4 opacity min
  const opacity = useTransform(rotate, (r) => {
    const val = 1 - Math.abs(r) / 180; 
    return val < 0.4 ? 0.4 : val;
  });

  const zIndex = useTransform(rotate, (r) => 100 - Math.ceil(Math.abs(r)));
  const scale = useTransform(rotate, (r) => 1 - Math.abs(r) / 150);

  // Holographic Sheen Logic
  const sheenGradient = useTransform(rotate, (r) => {
    return `linear-gradient(${105 + r}deg, transparent 40%, rgba(0, 240, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(0, 240, 255, 0.1) 55%, transparent 60%)`;
  });

  return (
    <motion.div
      style={{
        rotate: rotate,
        y: y,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        transformOrigin: "center 2000px", // Deep pivot point
      }}
      className="absolute top-20 w-[350px] aspect-[4/5] perspective-1000 hidden md:block will-change-transform group"
    >
      <a href={post.url} target="_blank" rel="noreferrer" className="block h-full w-full relative transition-all duration-500 group-hover:-translate-y-10 group-hover:scale-105">
        
        {/* RGB GLOW BORDER EFFECT */}
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-pulse-fast" />

        {/* Holographic Sheen Overlay */}
        <motion.div 
            className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: sheenGradient }}
        />

        {/* Standard Glow Border (Base State) */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-2xl opacity-20 group-hover:opacity-0 transition-opacity duration-500 blur-sm" />

        {/* Main Card Content */}
        <div className="h-full w-full bg-void/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Linkedin size={18} />
               </div>
               <div>
                  <h3 className="font-bold text-gray-200 text-sm leading-tight group-hover:text-white transition-colors">{post.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-gray-600 font-mono group-hover:text-neon-cyan transition-colors">{post.date}</span>
               </div>
            </div>
          </div>

          {/* Image */}
          <div className="h-40 w-full rounded-lg overflow-hidden mb-4 relative group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-shadow duration-500">
             <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent z-10 opacity-60" />
             <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110" />
          </div>

          {/* Content */}
          <p className="text-gray-400 text-xs mb-4 line-clamp-3 leading-relaxed group-hover:text-gray-300 transition-colors">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
             {post.tags.slice(0, 3).map(tag => (
                 <span key={tag} className="text-[9px] px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 font-mono group-hover:border-neon-cyan/30 group-hover:text-neon-cyan transition-all">
                     {tag}
                 </span>
             ))}
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-gray-600 font-mono relative z-10">
            <div className="flex gap-4">
               <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors"><ThumbsUp size={12} /> {post.likes}</span>
               <span className="flex items-center gap-1 group-hover:text-green-400 transition-colors"><MessageCircle size={12} /> {post.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700 group-hover:text-neon-pink transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-300">
                Read Post <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

/**
 * Renders a simplified, 2D card for the mobile view.
 * This component is designed for a horizontal scrolling container.
 *
 * @param {object} props - The component props.
 * @param {SocialPost} props.post - The social post data to display.
 * @returns {React.ReactElement} A div element representing the mobile card.
 */
const MobileCard: React.FC<{ post: SocialPost }> = ({ post }) => (
  <div className="min-w-[300px] w-[300px] bg-void/50 border border-white/10 rounded-2xl p-5 snap-center shrink-0 relative overflow-hidden group">
     {/* Ambient Glow */}
     <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-[50px] pointer-events-none" />
     
     <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
           <Linkedin size={16} className="text-blue-400" />
           <span className="text-xs text-gray-500 font-mono">{post.date}</span>
        </div>
     </div>
     
     <h3 className="font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{post.title}</h3>
     <p className="text-xs text-gray-400 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
     
     <div className="flex justify-between items-center text-xs text-gray-500 font-mono border-t border-white/5 pt-4">
        <span>{post.likes} Likes</span>
        <a href={post.url} className="text-white flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Read <ExternalLink size={10} />
        </a>
     </div>
  </div>
);

/**
 * @file Renders the "LinkedIn Highlights" section of the portfolio.
 * @module LinkedInHighlights
 */

/**
 * The LinkedInHighlights component displays a curated list of social media posts
 * in an engaging and interactive format. It features a 3D rotating card carousel
 * for desktop and a simple swipeable list for mobile.
 *
 * This component manages its own state for the active card index and does not accept any props.
 *
 * @returns {React.ReactElement} A section element showcasing LinkedIn posts.
 */
const LinkedInHighlights: React.FC = () => {
  // Navigation State
  const [activeIndex, setActiveIndex] = useState(1); // Start focused on the 2nd card (Index 1)
  // Motion Values for smooth spring physics on navigation
  const indexMotion = useMotionValue(1);
  const smoothIndex = useSpring(indexMotion, { damping: 20, stiffness: 150 });

  const cycleLeft = () => {
    if (activeIndex > 0) {
        const newIndex = activeIndex - 1;
        setActiveIndex(newIndex);
        indexMotion.set(newIndex);
    }
  };

  const cycleRight = () => {
    if (activeIndex < posts.length - 1) {
        const newIndex = activeIndex + 1;
        setActiveIndex(newIndex);
        indexMotion.set(newIndex);
    }
  };

  return (
    <section className="relative py-32 w-full overflow-hidden flex flex-col items-center">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="text-center mb-16 z-10 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Social Signals</h2>
        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Network Highlights & Community</p>
      </div>

      {/* Desktop Interaction Zone */}
      <div className="hidden md:flex relative h-[600px] w-full max-w-7xl justify-center items-start perspective-1000 overflow-hidden">
        {/* Vignette Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-void to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-void to-transparent z-20 pointer-events-none" />

        {/* Functional Navigation Buttons */}
        <button 
            onClick={cycleLeft}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-neon-cyan hover:bg-white/10 hover:border-neon-cyan transition-all duration-300 backdrop-blur-md group"
            disabled={activeIndex <= 0}
        >
            <ChevronLeft size={32} className={`transform group-hover:scale-110 transition-transform ${activeIndex <= 0 ? 'opacity-20' : 'opacity-100'}`} />
        </button>
        <button 
            onClick={cycleRight}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-neon-pink hover:bg-white/10 hover:border-neon-pink transition-all duration-300 backdrop-blur-md group"
            disabled={activeIndex >= posts.length - 1}
        >
            <ChevronRight size={32} className={`transform group-hover:scale-110 transition-transform ${activeIndex >= posts.length - 1 ? 'opacity-20' : 'opacity-100'}`} />
        </button>

        {/* The Semi-Sphere Container */}
        <div className="relative w-full h-full flex justify-center pt-10">
          {posts.map((post, index) => (
             <Card 
               key={post.id} 
               post={post} 
               index={index} 
               centerIndex={smoothIndex}
             />
          ))}
        </div>
        
        {/* Interaction Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-700 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 opacity-50">
            <span className="w-12 h-[1px] bg-gray-700" />
            Use Arrows to Navigate
            <span className="w-12 h-[1px] bg-gray-700" />
        </div>
      </div>

      {/* Mobile Swipe View */}
      <div className="md:hidden w-full px-6 flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar mask-linear-fade">
         {posts.map(post => (
            <MobileCard key={post.id} post={post} />
         ))}
      </div>

    </section>
  );
};

export default LinkedInHighlights;
