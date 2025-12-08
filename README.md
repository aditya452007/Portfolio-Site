# Aaditya's AI Portfolio

A futuristic, interactive portfolio website for Aaditya Thakur, an AI Automation Engineer. This project showcases advanced frontend engineering skills combined with AI integration, featuring a cyberpunk aesthetic, immersive animations, and a conversational AI assistant.

## 🚀 Features

*   **Interactive Hero Section**: A particle-based background with a typewriter effect and dynamic "ghost" text.
*   **AdityaAI (Gemini Integration)**: A custom-trained AI chatbot powered by Google's Gemini API that answers questions about Aaditya's skills, experience, and projects.
*   **Terminal of Truth**: A gamified, CLI-style interface for exploring the portfolio using commands like `whoami`, `scan`, and `python3`.
*   **Skill Gravity Well**: A physics-based simulation where technical skills float and interact like particles.
*   **Man vs. Machine**: An interactive demonstration comparing manual workflows with automated pipelines using GSAP animations.
*   **Contact Vault**: A gamified contact form that requires "breaking" a security vault to access.
*   **The Lab**: A zero-gravity floating card interface showcasing experimental projects.
*   **3D Carousel**: A stunning 3D rotating carousel for LinkedIn highlights.
*   **Responsive Design**: Fully optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

*   **Framework**: React 18
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Animations**:
    *   Framer Motion (Layout transitions, spring physics)
    *   GSAP (Complex timelines, ScrollTrigger)
*   **AI Integration**: Google Generative AI SDK (Gemini)
*   **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/aaditya-portfolio.git
    cd aaditya-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 📂 Project Structure

```
src/
├── components/           # UI Components
│   ├── AdityaAI.tsx      # AI Chatbot Component
│   ├── ContactVault.tsx  # Gamified Contact Section
│   ├── Experience.tsx    # Solar System Experience Visualization
│   ├── Hero.tsx          # Landing Section with Particles
│   ├── LinkedInHighlights.tsx # 3D Social Proof Carousel
│   ├── ManVsMachine.tsx  # Automation Demo (Manual vs Pipeline)
│   ├── Projects.tsx      # Project Grid with Slide-over
│   ├── SkillGravityWell.tsx # Physics-based Skills Section
│   ├── TerminalOfTruth.tsx # CLI Interface
│   └── TheLab.tsx        # Experimental Projects Section
├── App.tsx               # Main Layout and Composition
├── index.tsx             # Entry Point
├── index.css             # Global Styles & Tailwind Imports
└── types.ts              # Global TypeScript Interfaces
```

## 📜 Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Type-checks and builds the project for production.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Previews the production build locally.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
