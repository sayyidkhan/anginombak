import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// PrimeReact imports
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import PromptResponse from './components/pages/PromptResponse'
import MainPage from './components/MainPage'
import Parenting from './components/Parenting'
import Services from './components/Services'
import Prompt from './components/pages/Prompt'
import './App.css'
import Login from './components/pages/Login'
import Home from './components/pages/Home'
import Explore from './components/pages/Explore'
import Social from './components/pages/Social'
import Marketplace from './components/pages/Marketplace'

function App() {
  const [savedUsername, setSavedUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if username exists in localStorage
    const username = localStorage.getItem('anginombak_username');
    setSavedUsername(username);
    setIsLoading(false);
  }, []);

  // Custom redirect component that checks for saved username
  const HomeRedirect = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    if (savedUsername) {
      // If username exists in localStorage, redirect to explore page
      return <Navigate to="/home" replace />;
    } else {
      // Otherwise, redirect to login page
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/prompt-response" element={<PromptResponse />} />
        <Route path="/parenting" element={<Parenting />} />
        <Route path="/services" element={<Services />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/prompt" element={<Prompt />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/social" element={<Social />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
