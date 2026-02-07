import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });

      // Check for success or token
      if (response.data.status === 'success' || response.data.token) {
        const token = response.data.token;
        
        // 1. Extract the User ID from the response
        // Most backends return it inside a 'user' object or as 'userId'
        const userId = response.data.user?._id || response.data.userId;

        // 2. MUST save to localStorage first
        localStorage.setItem('token', token);
        if (userId) {
          localStorage.setItem('userId', userId);
        }

        // 3. Update global state
        onLogin(token);

        // 4. Finally, navigate home
        navigate('/', { replace: true });
        
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md bg-background-surface rounded-2xl border border-white/5 p-8 shadow-2xl">
        <h2 className="text-3xl font-black mb-2 text-white italic tracking-tighter uppercase">Welcome Back</h2>
        <p className="text-gray-400 mb-8 font-medium">Login to book your favorite shows</p>

        {error && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-sm mb-6 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.2em]">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-xl h-12 px-4 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm font-bold">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline ml-1">Join CineBook</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;