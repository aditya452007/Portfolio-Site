// ==============================================================================
// GLOBAL TYPE DEFINITIONS
// ==============================================================================

/**
 * Represents a project in the portfolio.
 */
export interface Project {
  /** Unique identifier for the project. */
  id: string;
  /** The title of the project. */
  title: string;
  /** A short catchy tagline for the project. */
  tagline: string;
  /** List of technologies used in the project. */
  tech: string[];
  /** Description of the problem the project solves. */
  problem: string;
  /** Description of the solution implemented. */
  solution: string;
  /** The impact or results of the project. */
  impact: string;
  /** URL or path to the project image. */
  image: string;
  /** Optional URL to the GitHub repository. */
  github?: string;
  /** Optional URL to the live demo. */
  demo?: string;
}

/**
 * Represents a work or education experience.
 */
export interface Experience {
  /** Unique identifier for the experience entry. */
  id: string;
  /** The role or degree title. */
  role: string;
  /** The company or institution name. */
  company: string;
  /** The duration of the experience (e.g., "2024 - Present"). */
  date: string;
  /** Detailed description of the responsibilities or achievements. */
  description: string;
  /** List of technologies or skills used. */
  tech: string[];
  /** The type of experience: either 'work' or 'education'. */
  type: 'work' | 'education';
}

/**
 * Represents an item in the "Lab" or experimental section.
 */
export interface LabItem {
  /** Unique identifier for the lab item. */
  id: string;
  /** Title of the experiment. */
  title: string;
  /** Snippet of code or description associated with the item. */
  code: string;
  /** Icon name (from Lucide React) or URL representing the item. */
  icon: string;
}

/**
 * Represents a social media post or highlight.
 */
export interface SocialPost {
  /** Unique identifier for the post. */
  id: number;
  /** Title of the post. */
  title: string;
  /** Short excerpt or summary of the post content. */
  excerpt: string;
  /** Number of likes. */
  likes: number;
  /** Number of comments. */
  comments: number;
  /** Date the post was published. */
  date: string;
  /** URL or path to an image associated with the post. */
  image: string;
  /** URL to the original post. */
  url: string;
  /** List of tags or hashtags. */
  tags: string[];
}
