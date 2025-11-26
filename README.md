<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Portfolio & Blog Template

This repository contains the source code for a dynamic and visually engaging personal portfolio website, built with **React**, **TypeScript**, and **Framer Motion**. It's designed to showcase projects, experience, and social highlights in a modern, interactive format.

## ✨ Features

- **Interactive UI**: Engaging animations and effects powered by Framer Motion.
- **Component-Based Architecture**: Built with reusable React components for easy maintenance and scalability.
- **TypeScript Support**: Ensures type safety and improves developer experience.
- **Responsive Design**: Adapts to various screen sizes for a seamless experience on desktop and mobile devices.
- **Easy Deployment**: Can be deployed to any static site hosting service.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: npm is included with the Node.js installation.

### Installation & Setup

1. **Clone the repo**
   ```sh
   git clone https://github.com/aditya452007/Portfolio-Template.git
   ```
2. **Navigate to the project directory**
   ```sh
   cd Portfolio-Template
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
4. **Set up your Gemini API Key**
   - Rename the `.env.local.example` file to `.env.local`.
   - Add your Gemini API key to the `.env.local` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
5. **Run the development server**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📂 Project Structure

The project is organized into the following directory structure:

```
/
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # Reusable React components
│   │   ├── Experience.tsx
│   │   ├── FallingStarBarrage.tsx
│   │   ├── Hero.tsx
│   │   ├── LinkedInHighlights.tsx
│   │   ├── Projects.tsx
│   │   └── TheLab.tsx
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   ├── index.tsx         # Entry point of the application
│   └── types.ts          # TypeScript type definitions
├── .gitignore            # Git ignore file
├── index.html            # Main HTML file
├── package.json          # Project dependencies and scripts
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Customization

You can easily customize the portfolio by modifying the data in the following files:

- **`src/components/Experience.tsx`**: Update the `experienceData` array to reflect your work and education history.
- **`src/components/Projects.tsx`**: Modify the `projects` array to showcase your own projects.
- **`src/components/LinkedInHighlights.tsx`**: Update the `posts` array with your social media highlights.
- **`src/components/TheLab.tsx`**: Change the `projects` array to include your experimental projects.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <em>Built with ❤️ by Aaditya Thakur</em>
</div>
