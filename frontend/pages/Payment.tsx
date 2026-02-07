import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the data passed from the Seat Selection page
  const { expiresAt, amount } = location.state || {};

  // If someone goes to /payment directly without picking seats, send them back
  useEffect(() => {
    if (!expiresAt) {
      navigate('/');
    }
  }, [expiresAt, navigate]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      
      if (remaining <= 0) {
        clearInterval(interval);
        alert("Time expired! Your seats have been released.");
        navigate('/');
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        {/* THE CLOCK */}
        <div className="text-center mb-6">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">Secure Your Seats</p>
          <div className="text-5xl font-mono font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="h-[1px] bg-zinc-800 my-6" />

        <div className="flex justify-between items-center mb-8">
          <span className="text-zinc-400">Total Amount</span>
          <span className="text-2xl font-bold">₹{amount}</span>
        </div>

        <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;