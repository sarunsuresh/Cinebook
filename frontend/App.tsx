
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import Payment from './pages/Payment';
import BookingHistory from './pages/BookingHistory';
import Ticket from './pages/Ticket';
import Theaters from './pages/Theaters';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
        <main className="flex-grow">
          <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login onLogin={login} />} />
  <Route path="/signup" element={<Signup onLogin={login} />} />

  {/* Movie & Shows Flow - Updated to match your Home.tsx navigation */}
  <Route path="/movies/:movieId/shows" element={<MovieDetails />} />

  {/* Protected Routes - These check isAuthenticated before rendering */}
  <Route 
    path="/shows/:showId/seats" 
    element={isAuthenticated ? <SeatSelection /> : <Navigate to="/login" />} 
  />
  
  <Route 
    path="/booking" 
    element={isAuthenticated ? <BookingConfirmation /> : <Navigate to="/login" />} 
  />

  <Route 
  path="/payment" 
  element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} 
/>

  <Route 
    path="/bookings" 
    element={isAuthenticated ? <BookingHistory /> : <Navigate to="/login" />} 
  />

  {/* Catch-all: If a URL doesn't match above, go back to Home */}
  <Route path="*" element={<Navigate to="/" replace />} />
  <Route path="/booking/confirm/:bookingId" element={<BookingConfirmation />} />
  <Route path="/ticket" element={<Ticket />} />
  <Route path="/BookingHistory" element={<BookingHistory />} />
  <Route path="/theaters" element={<Theaters />} />
  <Route path="/ticket/:bookingId" element={<Ticket />} />
  <Route path="/movies/:movieId" element={<MovieDetails />} />
</Routes>
        </main>
        <footer className="bg-background-surface/50 border-t border-white/5 py-8 px-6 text-center text-sm text-gray-500">
          <p>© 2024 CineBook Entertainment Group. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
