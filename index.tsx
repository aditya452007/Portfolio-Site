/**
 * @file The entry point for the React application.
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * The main entry point for the portfolio application.
 * This file handles the initial rendering of the React application into the DOM.
 * It locates the root HTML element and mounts the main `App` component into it.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);