import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import windsurfIcon from '../../assets/windsurf.svg';
import { 
  APP_NAME, 
  PAGE_TITLES, 
  FORM_LABELS, 
  BUTTON_LABELS, 
  PLACEHOLDERS 
} from '../../utils/constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">{APP_NAME}</h2>
          <img src={windsurfIcon} alt="Windsurf" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl text-gray-600 font-medium text-center">{PAGE_TITLES.LOGIN}</h1>
        </div>
        
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-gray-700 font-medium">{FORM_LABELS.USERNAME}</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={PLACEHOLDERS.USERNAME}
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
                {FORM_LABELS.REMEMBER_ME}
              </label>
            </div>
            <Link to="/forgot-username" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              {FORM_LABELS.FORGOT_USERNAME}
            </Link>
          </div>
          
          <Button
            type="button"
            label={BUTTON_LABELS.SIGN_IN}
            className="p-3 text-white bg-indigo-500 hover:bg-indigo-600 border-none rounded-lg"
            disabled={!username.trim()}
            onClick={() => {
              if (username.trim()) {
                console.log('Login attempt with:', { username, rememberMe });
                // Pass username as a URL parameter
                navigate(`/prompt?username=${encodeURIComponent(username)}`);
              }
            }}
          />
          
          <div className="text-center">
            <span className="text-gray-600">Or </span>
            <Link to="/register" className="text-indigo-500 hover:text-indigo-700 transition-colors">
              {FORM_LABELS.CREATE_ACCOUNT}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
