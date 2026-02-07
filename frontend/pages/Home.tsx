
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Movie } from '../types';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-16 group">
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent z-10"></div>
        <img 
          src="https://picsum.photos/seed/Lucifer/1600/600" 
          alt="Hero Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-10 left-10 z-20 max-w-xl">
          <span className="bg-primary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Featured Today</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">L2:Empuraan</h2>
          <p className="text-gray-300 text-lg mb-6 line-clamp-2">Witness the global ascension of Abram Qureshi as he emerges from the shadows to reclaim his international empire, uniting old loyalties and new blood on a path of absolute dominance.</p>
          <button
  onClick={() => {
    if (movies.length > 0) {
      navigate(`/movies/${movies[6]._id}/shows`);
    }
  }}
  className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-95"
>
  Book Now
</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold">Recommended Movies</h3>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-full border border-primary bg-primary/10 text-primary text-xs font-bold uppercase">Now Showing</button>
          <button className="px-4 py-1.5 rounded-full border border-white/5 text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">Coming Soon</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {movies.map((movie) => (
          <Link to={`/movies/${movie._id}/shows`} key={movie._id} className="group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-white/5 shadow-xl transition-all duration-300 group-hover:translate-y-[-8px] group-hover:border-primary/50">
              <img 
                src={movie.posterUrl || `https://picsum.photos/seed/${movie._id}/400/600`} 
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-yellow-500 fill-1">star</span>
                <span className="text-white text-[10px] font-bold">{movie.rating}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm shadow-xl shadow-primary/30">Quick Book</button>
              </div>
            </div>
            <h4 className="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors truncate">{movie.title}</h4>
            <p className="text-gray-500 text-sm">{movie.genre} • UA</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
