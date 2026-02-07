
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

interface SignupProps {
  onLogin: (token: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/signup', { name, email, password });
      if (response.data.status === 'success' || response.data.token) {
        onLogin(response.data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh] items-center justify-center px-4">
      <div className="w-full max-w-md bg-background-surface rounded-2xl border border-white/5 p-8 shadow-2xl">
        <h2 className="text-3xl font-black mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join our community of movie lovers</p>

        {error && <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-dark border border-white/10 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Min 8 characters"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
