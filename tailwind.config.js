/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The "Void" - Deepest black for background (Matches App.tsx)
        void: '#050505',
        
        // Neon Palette
        neon: {
          cyan: '#00f0ff',
          pink: '#ff00aa',
          purple: '#bd00ff',
          green: '#00ff9c', // Added for Matrix Rain & Success states
        },
        
        // Glassmorphism Utilities
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-hover': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 15s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite', // Global shimmer
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}