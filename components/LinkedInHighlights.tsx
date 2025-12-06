import React, { useState } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Linkedin, ThumbsUp, MessageCircle, Share2, ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SocialPost } from '../types';

const posts: SocialPost[] = [
  {
    id: 1,
    title: "Google Cloud Arcade Champion",
    excerpt: "Orchestrating enterprise-scale intelligence. Verified mastery in deploying GenAI pipelines and optimizing BigQuery clusters. This isn't just a badge; it's a license to build scalable cloud infrastructure.",
    likes: 34,
    comments: 6,
    date: "",
    image: "https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/Screenshot%202025-12-01%20141711.png",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7338539581966835712/?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A7338539581966835712%29",
    tags: ["#GCP", "#CloudComputing","#GenAI","#GoogleCloudArcadeChampion"]
  },
  {
    id: 2,
    title: "Building Autonomous Agents",
    excerpt: "Just shipped a new MCP server that lets Claude Desktop control my local OS shell. The future of devops is conversational. 🤖✨",
    likes: 21,
    comments: 2,
    date: "",
    image: "https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/1764426307685.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7400540326849040385/",
    tags: ["#AI", "#Automation", "#MCP"]
  },
{
    id: 3,
    title: "IBM: The Build-or-Bust AI Sprint",
    excerpt: "Resumes are broken. I spent 4 weeks hacking the system with LLMs and Streamlit to fix them. The result? A Resume-Generating AI that proves shipping V1 teaches you more than perfection ever will.",
    likes: 35,
    comments: 14,
    date: "",
    image: "https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/Screenshot%202025-12-02%20133455.png",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7392465203868622848/",
    tags: ["#GenAI", "#Streamlit", "#IBM", "#BuildInPublic"]
  },
  {
    id: 4,
    title: "Oracle GenAI: Beyond the Prompt",
    excerpt: "Prompts are easy. Scale is hard. This wasn't just a certification; it was a shift from AI User to Architect. Real AI lives in production.",
    likes: 50,
    comments: 10,
    date: "",
    image: "https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/Screenshot%202025-12-01%20142942.png",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7384849300448555009/?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A7384849300448555009%29",
    tags: ["#OracleCloud", "#GenAI", "#CloudArchitecture"]
  },
  {
    id: 5,
    title: "GCP: Escaping Localhost",
    excerpt: "Code rots on localhost. I mastered GCP foundations to bridge the critical gap between writing local scripts and deploying global, scalable solutions.",
    likes: 18,
    comments: 2,
    date: "",
    image: "https://ik.imagekit.io/hbypp4kzi/Portfolio%20images/1748666565348.jpg",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7334439179407314944/?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A7334439179407314944%29",
    tags: ["#GoogleCloud", "#CloudEngineering", "#Scalability"]
  }
];

const Card: React.FC<{ 
    post: SocialPost; 
    index: number; 
    centerIndex: MotionValue<number>;
}> = ({ post, index, centerIndex }) => {
  
  // LOGIC: Rotation depends entirely on the spring-animated centerIndex
  const rotate = useTransform(centerIndex, (current: number) => (index - current) * 25);
  
  // Pivot point logic - slightly increased multiplier for a wider arc
  const y = useTransform(rotate, (r: number) => Math.abs(r) * 1.5); 
  
  // Opacity: Adjusted for better visibility
  // Falls off slower (divisor 180) and clamps at 0.4 opacity min
  const opacity = useTransform(rotate, (r: number) => {
    const val = 1 - Math.abs(r) / 180; 
    return val < 0.4 ? 0.4 : val;
  });

  const zIndex = useTransform(rotate, (r: number) => 100 - Math.ceil(Math.abs(r)));
  const scale = useTransform(rotate, (r: number) => 1 - Math.abs(r) / 150);

  // Holographic Sheen Logic
  const sheenGradient = useTransform(rotate, (r: number) => {
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

// Mobile Card Component
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