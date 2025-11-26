/**
 * @file Defines the core TypeScript interfaces used throughout the application.
 * @module types
 */

/**
 * Represents a single project showcased in the "Selected Works" section.
 */
export interface Project {
    /** A unique identifier for the project. */
    id: string;
    /** The main title of the project. */
    title:string;
    /** A short, catchy tagline summarizing the project. */
    tagline: string;
    /** An array of technologies used in the project. */
    tech: string[];
    /** A description of the problem the project solves. */
    problem: string;
    /** A description of the solution implemented. */
    solution: string;
    /** The resulting impact of the project. */
    impact: string;
    /** The URL for the project's showcase image. */
    image: string;
    /** The optional URL to the project's GitHub repository. */
    github?: string;
    /** The optional URL to a live demo of the project. */
    demo?: string;
  }
/**
 * Represents a single item in the "Experience" section, which can be either a job or education.
 */
export interface Experience {
    /** A unique identifier for the experience item. */
    id: string;
    /** The role or title (e.g., "Software Engineer", "B.S. in Computer Science"). */
    role: string;
    /** The company or institution name. */
    company: string;
    /** The date or time frame of the experience. */
    date: string;
    /** A brief description of the role and responsibilities. */
    description: string;
    /** An array of relevant technologies or skills. */
    tech: string[];
    /** The type of experience, used for icon differentiation. */
    type: 'work' | 'education';
  }
/**
 * Represents a single experimental project in "The Lab" section.
 * @deprecated This interface is not currently used in the active codebase.
 */
export interface LabItem {
    /** A unique identifier for the lab item. */
    id: string;
    /** The title of the experiment. */
    title: string;
    /** A snippet of relevant code. */
    code: string;
    /** An icon representing the technology or concept. */
    icon: string;
  }

/**
 * Represents a single social media post, used in the "LinkedIn Highlights" section.
 */
export interface SocialPost {
    /** A unique identifier for the post. */
    id: number;
    /** The title of the post. */
    title: string;
    /** A short excerpt from the post content. */
    excerpt: string;
    /** The number of likes the post received. */
    likes: number;
    /** The number of comments on the post. */
    comments: number;
    /** The date the post was published (e.g., "2d ago"). */
    date: string;
    /** The URL for the post's associated image. */
    image: string;
    /** The direct URL to the original post on the social media platform. */
    url: string;
    /** An array of relevant hashtags or tags. */
    tags: string[];
  }