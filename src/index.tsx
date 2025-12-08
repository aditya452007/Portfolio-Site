import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ CRITICAL: Import the CSS so Tailwind & Animations work!
import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("CRITICAL: Failed to find the root element. Ensure public/index.html contains <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);