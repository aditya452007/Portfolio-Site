// ==============================================================================
// GLOBAL TYPE DEFINITIONS
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

export interface Experience {
  id: string;
  role: string;
  company: string;
  date: string;
  description: string;
  tech: string[];
  type: 'work' | 'education';
}

export interface LabItem {
  id: string;
  title: string;
  code: string;
  icon: string; // Lucide Icon Name or URL
}

export interface SocialPost {
  id: number;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  date: string;
  image: string;
  url: string;
  tags: string[];
}