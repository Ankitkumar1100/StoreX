import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add theme variables to document
document.documentElement.style.setProperty('--toast-bg', '#fff');
document.documentElement.style.setProperty('--toast-color', '#333');
document.documentElement.style.setProperty('--toast-border', '#e2e8f0');

// Set dark mode variables if needed
if (document.documentElement.classList.contains('dark')) {
  document.documentElement.style.setProperty('--toast-bg', '#1f2937');
  document.documentElement.style.setProperty('--toast-color', '#f9fafb');
  document.documentElement.style.setProperty('--toast-border', '#374151');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);