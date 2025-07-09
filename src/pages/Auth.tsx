// ==== CoPilot Code START ====
import { useState } from 'react';
import { heading } from '../assets/style';

export const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  return (
    <div className="max-w-md mx-auto">
      <h1 className={heading + ' mb-6'}>{mode === 'login' ? 'Login' : 'Register'}</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
        {mode === 'register' && (
          <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
        )}
        <button type="submit" className="w-full py-2 bg-blue-600 rounded text-white font-bold hover:bg-blue-700">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-400 underline"
          onClick={() => setMode(m => (m === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};
// ==== CoPilot Code END ====
