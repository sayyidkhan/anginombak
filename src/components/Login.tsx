import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Link } from 'react-router-dom';
import windsurfIcon from '../assets/windsurf.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      console.log('Login attempt with:', { username, rememberMe });
      // Add actual authentication logic here
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">AnginOmbak</h2>
          <img src={windsurfIcon} alt="Windsurf" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl text-gray-600 font-medium text-center">Sign in</h1>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-gray-700 font-medium">Username</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="p-3 rounded-lg"
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                inputId="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.checked || false)}
                className="cursor-pointer"
              />
              <label htmlFor="rememberMe" className="cursor-pointer text-gray-600">
                Remember me
              </label>
            </div>
            <Link to="/forgot-username" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              Forgot username?
            </Link>
          </div>
          
          <Button
            type="submit"
            label="Sign In"
            className="p-3 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
            disabled={!username.trim()}
          />
          
          <div className="text-center">
            <span className="text-gray-600">Or </span>
            <Link to="/register" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              Create a New Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
