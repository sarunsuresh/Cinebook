import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';
import { Booking } from '../types';

const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef<HTMLDivElement>(null);

  // Initialize state from location.state if available
  const [booking, setBooking] = useState<Booking | null>(location.state?.booking || null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(location.state?.isConfirmed || false);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // If we have no booking data (e.g., user refreshed the page or came from a direct link)
    if (!booking && bookingId) {
      const fetchBooking = async () => {
        try {
          // Fetch specific booking details from the backend
          const response = await api.get(`/bookings/${bookingId}`);
          // Note: Adjust the response path based on your API (e.g., response.data or response.data.booking)
          const found = response.data.booking || response.data; 
          
          if (found) {
            setBooking(found);
            setIsConfirmed(found.status === 'CONFIRMED' || found.status === 'BOOKED');
          }
        } catch (error) {
          console.error('Error fetching booking details', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId, booking]);

  const handleDownloadPDF = async () => {
    if (ticketRef.current && booking) {
      // Capture the ticket UI as a high-quality image
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 3, // Higher scale for better PDF quality
        backgroundColor: '#ffffff',
        useCORS: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`CineBook-Ticket-${booking._id.slice(-6)}.pdf`);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-gray-400 font-medium">Validating Ticket...</p>
    </div>
  );

  if (!booking) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-background-surface rounded-2xl border border-white/5 shadow-2xl">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">error</span>
        <h2 className="text-2xl font-bold mb-4 text-white">Ticket Not Found</h2>
        <p className="text-gray-400 mb-6">We couldn't retrieve the details for this booking.</p>
        <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white">
          {isConfirmed ? "Booking Confirmed!" : "Review Your Ticket"}
        </h2>
        <p className="text-gray-400 mt-2">
          {isConfirmed ? "Please present this QR code at the cinema." : "Complete payment to secure these seats."}
        </p>
      </div>

      {/* TICKET UI CONTAINER */}
      <div ref={ticketRef} className="bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Top Header Section */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">CineBook</h3>
            <p className="text-[10px] font-bold opacity-80 tracking-[0.2em]">ADMIT ONE</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold opacity-70 uppercase">Transaction ID</p>
            <p className="text-xs font-mono font-bold">#{booking._id.toUpperCase()}</p>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="p-8 border-b-2 border-dashed border-gray-200 relative">
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Movie</p>
              <p className="text-xl font-black leading-tight">
                {booking.showId?.movieTitle || "Movie Title"}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Seats</p>
              <p className="text-xl font-black text-primary">
                {booking.seats.join(', ')}
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center py-8 bg-gray-50 rounded-3xl border border-gray-100">
             {isConfirmed ? (
               <QRCode value={`VALID_TICKET_${booking._id}`} size={160} level="H" />
             ) : (
               <div className="w-[160px] h-[160px] bg-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4">
                 <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">payments</span>
                 <p className="text-[10px] font-bold text-gray-500 uppercase">QR Generated After Payment</p>
               </div>
             )}
            <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Scan for Entry
            </p>
          </div>

          {/* Aesthetic Ticket Punches */}
          <div className="absolute -left-5 -bottom-5 w-10 h-10 bg-background-dark rounded-full"></div>
          <div className="absolute -right-5 -bottom-5 w-10 h-10 bg-background-dark rounded-full"></div>
        </div>

        {/* Bottom Total Section */}
        <div className="p-6 bg-gray-50 flex justify-between items-center px-8">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount Paid</p>
              <p className="text-2xl font-black text-black">₹{booking.totalAmount}</p>
           </div>
           <div className="text-right">
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isConfirmed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {isConfirmed ? 'Verified' : 'Pending'}
              </div>
           </div>
        </div>
      </div>

      {/* USER ACTIONS */}
      <div className="mt-10 flex flex-col gap-4">
        {isConfirmed ? (
          <button 
            onClick={handleDownloadPDF}
            className="group w-full bg-white text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
          >
            <span className="material-symbols-outlined group-hover:bounce">download</span> 
            Download Offline PDF
          </button>
        ) : (
          <button 
            onClick={() => navigate('/payment', { 
              state: { 
                bookingId: booking._id, 
                amount: booking.totalAmount,
                booking: booking // Passing forward the object
              } 
            })}
            className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Proceed to Payment
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        )}
        
        <button 
          onClick={() => navigate('/')} 
          className="w-full text-gray-500 font-bold py-3 hover:text-white transition-colors"
        >
          Return to Movies
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;