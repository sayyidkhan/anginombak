import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import styles
import './index.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css' // Theme
import 'primereact/resources/primereact.min.css'                 // Core
import 'primeicons/primeicons.css'                               // Icons

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
