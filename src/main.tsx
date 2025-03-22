import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import styles
import './index.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css' // Theme
import 'primereact/resources/primereact.min.css'                 // Core
import './styles/icons.css'                                      // Custom icons (replacing primeicons)

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
