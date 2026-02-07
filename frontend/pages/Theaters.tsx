import React from 'react';

const keralaTheaters = [
  { id: 1, name: "Aries Plex SL Cinemas", location: "Kochi", rating: 4.9, type: "4K Dolby Atmos" },
  { id: 2, name: "PVR Lulu Mall", location: "Edappally, Kochi", rating: 4.8, type: "IMAX & Gold Class" },
  { id: 3, name: "Vanitha-Vineetha", location: "Edappally, Kochi", rating: 4.7, type: "Atmos Hub" },
  { id: 4, name: "Kairali Sree", location: "Kozhikode", rating: 4.5, type: "KSFDC" },
  { id: 5, name: "RP Mall (Film City)", location: "Mavoor Road, Kozhikode", rating: 4.6, type: "Multiplex" },
  { id: 6, name: "Apsara Theatre", location: "Railway Station Rd, Kozhikode", rating: 4.7, type: "Massive Screen" },
];

const Theaters: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-background-dark min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Partner Theaters</h2>
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] mt-2 text-xs">Kochi • Calicut</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {keralaTheaters.map((t) => (
          <div key={t.id} className="bg-background-surface border border-white/5 rounded-3xl p-8 hover:border-primary/40 transition-all group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {t.type}
                </div>
                <div className="text-orange-400 font-black text-sm">★ {t.rating}</div>
              </div>
              
              <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight">
                {t.name}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <p className="text-xs font-bold uppercase tracking-widest">{t.location}</p>
              </div>

              <button className="mt-8 w-full py-4 rounded-2xl bg-white/5 text-white font-black text-xs uppercase tracking-widest group-hover:bg-primary transition-all active:scale-95">
                View Movie Shows
              </button>
            </div>
            
            {/* Background Icon Decoration */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/[0.02] group-hover:text-primary/5 transition-colors">
              theater_comedy
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theaters;