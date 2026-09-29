import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// The PWA service worker is already registered automatically by
// vite-plugin-pwa (see registerSW.js in the built output). Registering it
// again here with a hardcoded absolute path ('/sw.js') was wrong for a
// GitHub Pages project site served from a subpath and only produced 404s.
