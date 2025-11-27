<<<<<<< HEAD
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { AuthProvider } from '@/context/AuthContext'
>>>>>>> 3a77d1ed7952bf6ff3f0b4d36b02442c9a2b7710

// Render Application
ReactDOM.createRoot(document.getElementById('root')).render(
<<<<<<< HEAD
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
=======
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </React.StrictMode>,
)
>>>>>>> 3a77d1ed7952bf6ff3f0b4d36b02442c9a2b7710

// Base44 Sandbox HMR Bridge (Keep It!)
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> 3a77d1ed7952bf6ff3f0b4d36b02442c9a2b7710
