import React, { useState } from 'react';
import Button from './Button';
import { IconClose } from '../constants';
import Spinner from './Spinner';

interface LoginModalProps {
  onClose: () => void;
  onAuthAttempt: (username: string, password: string) => Promise<string | void>;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onAuthAttempt }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAttempt = async () => {
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
     if (username.trim() === '') {
        setError('Username is required.');
        return;
    }
    setError('');
    setIsLoading(true);
    const apiError = await onAuthAttempt(username, password);
    setIsLoading(false);
    if (apiError) {
        setError(apiError);
    }
  };

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
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <IconClose />
            </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome back, Admin! Please enter your credentials.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
             <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
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
          {error && (
              <p className="text-sm text-red-600">{error}</p>
          )}
          <Button onClick={handleAttempt} className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;