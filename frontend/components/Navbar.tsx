
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-4 md:px-10 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-3xl fill-1">movie</span>
        <h1 className="text-white text-xl font-black tracking-tight uppercase">CineBook</h1>
      </Link>

      <div className="flex items-center gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-bold hover:text-primary transition-colors">Movies</Link>
          <Link to="/theaters" className="text-sm font-bold hover:text-primary transition-colors">Theaters</Link>
          {isAuthenticated && (
            <Link to="/BookingHistory" className="text-sm font-bold hover:text-primary transition-colors">My Bookings</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Logout
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
