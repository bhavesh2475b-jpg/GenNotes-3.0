
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountApp = () => {
    try {
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
    } catch (error: any) {
        console.error("Mount Error:", error);
        const display = document.getElementById('error-display');
        if(display) {
            display.style.display = 'block';
            display.innerText = "MOUNT ERROR: " + error.message;
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountApp);
} else {
    mountApp();
}

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
