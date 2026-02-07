import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// Added Link import to fix 'Cannot find name Link' error on line 97
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Booking, BookingStatus, PaymentMethod } from '../types';
import { useLocation ,Navigate, useParams } from 'react-router-dom'; // Add useParams


const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchHistory = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    const response = await api.get(`/user/${userId}`);
    
    // Notice the Capital 'B' to match your backend: res.json({ Bookings: ... })
    if (response.data && response.data.Bookings) {
      setBookings(response.data.Bookings);
    } else {
      setBookings([]);
    }
  } catch (error) {
    console.error("Error fetching history:", error);
  } finally {
    setLoading(false);
  }
};

  fetchHistory();
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black mb-1">My Tickets</h2>
          <p className="text-gray-500">View and manage your past and upcoming bookings</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-all">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter History
        </button>
      </div>

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.slice().reverse().map((booking) => (
            <div key={booking._id} className="group bg-background-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row hover:border-primary/20 transition-all">
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`
                      text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border
                      ${booking.status === BookingStatus.CONFIRMED ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}
                    `}>
                      {booking.status}
                    </span>
                    <h3 className="text-2xl font-bold mt-3 group-hover:text-primary transition-colors">Booking #{booking._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-gray-500 text-sm">{new Date(booking.createdAt).toLocaleDateString()} • {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">${booking.totalAmount.toFixed(2)}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Transaction Success</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 md:gap-12">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Theater</p>
                    <p className="font-bold text-gray-200">{booking.showId?.theaterName || 'CineBook Main'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Seats</p>
                    <p className="font-bold text-primary">{booking.seats.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Method</p>
                    <p className="font-bold text-gray-200">{PaymentMethod.CARD}</p>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 md:w-48 border-l border-dashed border-white/10 flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded">
                    <span className="material-symbols-outlined text-white text-4xl">qr_code_2</span>
                  </div>
                </div>
               <button 
  onClick={() => {
    // We "push" the booking data into the navigation state
    // so the Ticket page has it immediately without calling the backend
    navigate(`/ticket/${booking._id}`, { state: { booking: booking } });
  }}
  className="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
>
  View E-Ticket
</button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-32 text-center bg-background-surface rounded-2xl border border-white/5 border-dashed">
            <span className="material-symbols-outlined text-6xl text-gray-700 mb-6">confirmation_number</span>
            <h4 className="text-xl font-bold mb-2">No bookings found</h4>
            <p className="text-gray-500">You haven't made any bookings yet. Your future movie tickets will appear here!</p>
            <Link to="/" className="inline-block mt-8 bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Browse Movies</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
