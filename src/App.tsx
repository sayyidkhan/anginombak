import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PromptResponse from './components/pages/PromptResponse'
import MainPage from './components/MainPage'
import Parenting from './components/Parenting'
import Services from './components/Services'
import Prompt from './components/pages/Prompt'
import './App.css'
import Login from './components/pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/prompt-response" element={<PromptResponse />} />
        <Route path="/parenting" element={<Parenting />} />
        <Route path="/services" element={<Services />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
