
import React, { useState } from 'react';
import Button from './Button.tsx';
import { RESTAURANT_NAME, IconClose } from '../constants.tsx';
import Spinner from './Spinner.tsx';

interface LoginModalProps {
  onClose: () => void;
  onAuthAttempt: (mode: 'login' | 'signup', mobileNumber: string, password: string) => Promise<string | void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onAuthAttempt }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAttempt = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    setIsLoading(true);
    const apiError = await onAuthAttempt(mode, mobileNumber, password);
    setIsLoading(false);
    if (apiError) {
        setError(apiError);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
    setError('');
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 w-full max-w-sm m-4 animate-zoom-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <IconClose />
            </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to {RESTAURANT_NAME}! Please enter your details.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium">Mobile Number</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    +91
                </span>
                <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                />
            </div>
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium">Password</label>
             <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="******"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

          <Button onClick={handleAttempt} className="w-full text-lg" disabled={isLoading}>
            {isLoading ? <Spinner /> : (mode === 'login' ? 'Login' : 'Create Account')}
          </Button>
          <p className="text-sm text-center">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleMode} className="font-medium text-orange-600 dark:text-orange-500 hover:underline ml-1">
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;