import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Seat, SeatStatus } from '../types';

const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  
  // --- CRITICAL REFS: Defined here to prevent "ReferenceError" ---
  const bookingIdRef = useRef<string | null>(null);
  const fullBookingRef = useRef<any>(null);
  const navigateRef = useRef(navigate);

  // --- STATE ---
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  
  const [step, setStep] = useState<'selection' | 'payment'>('selection');
  const [paymentMethod, setPaymentMethod] = useState<'none' | 'upi' | 'card'>('none');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); 

  // Keep navigate ref updated for the timeout closure
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  const fetchSeats = useCallback(async () => {
    try {
      const response = await api.get(`/shows/${showId}/seats`);
      setSeats(response.data.seats);
    } catch (error) { console.error('Error fetching seats', error); }
    finally { setLoading(false); }
  }, [showId]);

  useEffect(() => { fetchSeats(); }, [fetchSeats]);

  // --- 5 MINUTE EXPIRY TIMER ---
  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Session Expired!");
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  // --- THE 20 SECOND PAYMENT SEQUENCE ---
  const startPaymentFlow = () => {
    setIsProcessing(true);
    
    // 8 Seconds: "Awaiting" -> "Verifying"
    setTimeout(() => setPaymentStatus('processing'), 8000);
    
    // 14 Seconds: "Verifying" -> "Success"
    setTimeout(() => setPaymentStatus('success'), 14000);
    
    // 20 Seconds: REDIRECT
    setTimeout(() => {
      const id = bookingIdRef.current;
      const data = fullBookingRef.current;
      if (id) {
        console.log("Redirecting to ticket:", id);
        // We pass the data in 'state' so Ticket.tsx doesn't have to fetch it again
        navigateRef.current(`/ticket/${id}`, { state: { booking: data } });
      }
    }, 20000);
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please login first");
      return;
    }

    setLocking(true);
    try {
      // 1. Lock the seats on backend
      await api.post(`/shows/${showId}/lock`, { 
        seats: selectedSeats,
        userId: userId 
      });

      // 2. Create the actual booking
      const bookingRes = await api.post('/booking', { 
        showId, 
        seats: selectedSeats, 
        userId: userId 
      });

      if (bookingRes.data && bookingRes.data.booking) {
        const bData = bookingRes.data.booking;
        
        // Save to Refs
        bookingIdRef.current = bData._id;
        fullBookingRef.current = bData;
        
        // Change UI
        setIsLocked(true);
        setStep('payment');
      }
    } catch (error: any) {
      console.error("Booking Error:", error);
      alert(error.response?.data?.message || "Failed to secure seats.");
    } finally {
      setLocking(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return <div className="p-20 text-center text-white font-black italic">LOADING CINEMA...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-10 text-white font-sans">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* SEAT MAP SECTION */}
        <div className="flex-grow flex flex-col items-center">
          <div className="w-full h-1 bg-primary/20 mb-20 shadow-[0_-10px_40px_rgba(236,19,55,0.4)]"></div>
          <div className="grid grid-cols-10 gap-3">
            {seats.map((seat) => (
              <button
                key={seat.seatNumber}
                disabled={seat.status !== SeatStatus.AVAILABLE || isLocked}
                onClick={() => {
                  setSelectedSeats(prev => prev.includes(seat.seatNumber) 
                    ? prev.filter(i => i !== seat.seatNumber) 
                    : [...prev, seat.seatNumber]);
                }}
                className={`w-10 h-10 rounded-t-lg text-[10px] font-black transition-all ${
                  selectedSeats.includes(seat.seatNumber) ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-zinc-900 border border-white/10'
                } ${seat.status !== SeatStatus.AVAILABLE ? 'opacity-10 cursor-not-allowed' : 'hover:border-primary/50'}`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR SECTION */}
        <aside className="w-full lg:w-[400px]">
          <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl min-h-[500px] flex flex-col">
            
            {step === 'selection' ? (
              <div className="animate-in fade-in">
                <h3 className="text-xl font-black italic uppercase mb-8">Summary</h3>
                <div className="flex justify-between mb-4"><span className="text-zinc-500 uppercase text-[10px] font-bold">Seats</span><span className="font-bold">{selectedSeats.join(', ') || 'None'}</span></div>
                <div className="flex justify-between mb-10"><span className="text-zinc-500 uppercase text-[10px] font-bold">Total</span><span className="text-primary font-black text-2xl">₹{selectedSeats.length * 250}</span></div>
                <button
                  onClick={handleProceed}
                  disabled={selectedSeats.length === 0 || locking}
                  className="w-full bg-primary py-5 rounded-xl font-black uppercase tracking-widest hover:bg-primary/80 transition-all disabled:opacity-20"
                >
                  {locking ? 'Locking...' : 'Proceed to Payment'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in slide-in-from-right-4">
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Expires In</p>
                  <div className="text-3xl font-mono font-black text-primary">{formatTime(timeLeft)}</div>
                </div>

                {!isProcessing ? (
                  <>
                    <div className="space-y-4 mb-8">
                      <button onClick={() => setPaymentMethod('upi')} className={`w-full p-6 border rounded-2xl flex justify-between ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                        <span className="font-bold">UPI / QR</span><span className="material-symbols-outlined text-primary">qr_code_2</span>
                      </button>
                      <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 border rounded-2xl flex justify-between ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                        <span className="font-bold">CARD</span><span className="material-symbols-outlined text-primary">credit_card</span>
                      </button>
                    </div>
                    <button onClick={startPaymentFlow} disabled={paymentMethod === 'none'} className="w-full bg-white text-black py-5 rounded-xl font-black mt-auto uppercase">Pay Now</button>
                  </>
                ) : (
                  <div className="text-center py-6 flex-grow flex flex-col justify-center">
                    {paymentStatus === 'idle' && (
                      <div className="animate-in zoom-in">
                        <div className="bg-white p-4 rounded-3xl inline-block mb-6 shadow-2xl">
                           <div className="w-36 h-36 bg-zinc-100 border-4 border-black flex items-center justify-center rounded-xl"><span className="material-symbols-outlined text-black text-6xl">qr_code_scanner</span></div>
                        </div>
                        <p className="font-black text-primary italic uppercase tracking-widest animate-pulse">Scan to Pay</p>
                      </div>
                    )}

                    {paymentStatus === 'processing' && (
                      <div className="py-10 animate-in fade-in">
                        <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-yellow-500 font-bold uppercase italic tracking-widest">Verifying Payment...</p>
                      </div>
                    )}

                    {paymentStatus === 'success' && (
                      <div className="py-10 animate-in zoom-in">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20"><span className="material-symbols-outlined text-white text-5xl font-black">check</span></div>
                        <p className="text-green-500 font-black text-2xl italic uppercase">Payment Success!</p>
                      </div>
                    )}

                    <div className="mt-auto w-full">
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress-grow"></div>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-3 tracking-[0.3em]">Processing Secure Transaction</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes progressGrow { from { width: 0%; } to { width: 100%; } }
        .animate-progress-grow { animation: progressGrow 20s linear forwards; }
      `}</style>
    </div>
  );
};

export default SeatSelection;