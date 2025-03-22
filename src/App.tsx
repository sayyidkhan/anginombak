import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import PromptResponse from './components/PromptResponse'
import MainPage from './components/MainPage'
import Parenting from './components/Parenting'
import Services from './components/Services'
import StepperDemo from './components/StepperDemo'
import Prompt from './components/Prompt'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/promptresponse" element={<PromptResponse />} />
        <Route path="/parenting" element={<Parenting />} />
        <Route path="/services" element={<Services />} />
        <Route path="/stepper-demo" element={<StepperDemo />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
