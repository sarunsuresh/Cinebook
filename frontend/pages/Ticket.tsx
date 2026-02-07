import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';

const Ticket: React.FC = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [booking, setBooking] = useState<any>(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (booking) return;

      try {
        // CHANGED: Added 's' to bookings to match standard REST patterns
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchTicketData();
    } else if (!location.state?.booking) {
      setLoading(false);
    }
  }, [bookingId, booking, location.state]);

  const handleDownloadPDF = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 3, 
        backgroundColor: '#ffffff',
        useCORS: true 
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`CineBook-Ticket-${booking?._id?.slice(-6)}.pdf`);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-black italic uppercase tracking-widest">Generating Your Pass...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <h2 className="text-primary font-black text-2xl mb-2">404 - TICKET NOT FOUND</h2>
        <p className="text-zinc-500 mb-8 uppercase text-[10px] font-bold tracking-widest">The booking ID might be incorrect or hasn't synced yet.</p>
        <button onClick={() => navigate('/')} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter">Go back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Booking Confirmed!</h2>
        <p className="text-zinc-500 mt-2 font-bold uppercase text-[10px] tracking-widest">Show this digital pass at the theater entrance.</p>
      </div>

      <div ref={ticketRef} className="bg-white text-black rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="bg-black p-8 text-white flex justify-between items-center relative border-b-2 border-dashed border-zinc-200">
          <div>
            <h3 className="text-3xl font-black italic uppercase text-primary tracking-tighter">CineBook</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Digital Admit One</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">Booking ID</p>
            <p className="text-xs font-mono font-bold">#{booking._id?.toUpperCase()}</p>
          </div>
          <div className="absolute -left-4 -bottom-4 w-8 h-8 bg-zinc-950 rounded-full"></div>
          <div className="absolute -right-4 -bottom-4 w-8 h-8 bg-zinc-950 rounded-full"></div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest mb-1">Movie</p>
              <p className="text-2xl font-black italic leading-none">{booking.showId?.movieTitle || "Movie"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest mb-1">Seats</p>
              <p className="text-2xl font-black text-primary italic leading-none">{booking.seats?.join(', ')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center py-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
            <QRCode value={"https://www.linkedin.com/in/sarun-s-501132231/"} size={180} bgColor="#F9FAFB" fgColor="#000000" />
            <p className="mt-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Scan for Entry</p>
          </div>
        </div>

        <div className="p-8 bg-zinc-100 flex justify-between items-center px-10">
            <div>
               <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Paid</p>
               <p className="font-black text-2xl tracking-tighter">₹{booking.totalAmount}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[10px] font-black tracking-widest border border-green-200 uppercase">
               Confirmed
            </span>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <button onClick={handleDownloadPDF} className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs">
          <span className="material-symbols-outlined">download</span> Download PDF Ticket
        </button>
        <button onClick={() => navigate('/')} className="text-zinc-500 font-bold py-3 hover:text-white transition-colors uppercase tracking-widest text-[10px]">
          Book With Us Again
        </button>
      </div>
    </div>
  );
};

export default Ticket;