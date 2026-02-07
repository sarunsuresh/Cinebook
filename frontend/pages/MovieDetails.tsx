import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Movie, Show } from '../types';

const MovieDetails: React.FC = () => {
  // 1. Sanitize the ID (removes ":" if it exists in the URL)
  const { movieId: rawId } = useParams<{ movieId: string }>();
  const movieId = rawId?.replace(':', '').trim();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchData = async () => {
    // 1. Check if ID is even valid
    if (!movieId || movieId.length < 10) {
      console.error("The ID is way too short or missing:", movieId);
      setLoading(false);
      return;
    }

    try {
      // Test Movie List separately
      console.log("Fetching movies...");
      const movieRes = await api.get('/movies');
      const found = movieRes.data.movies.find((m: any) => m._id === movieId);
      setMovie(found);

      // Test Shows separately (This is the likely 400 source)
      console.log("Fetching shows for ID:", movieId);
      const showsRes = await api.get(`/movies/${movieId}/shows`);
      setShows(showsRes.data.shows || []);

    } catch (error: any) {
      // THIS LOG IS THE MOST IMPORTANT:
      console.error("400 ERROR DETAILS:", {
        url: error.config?.url,
        message: error.response?.data,
        fullError: error
      });
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold mb-4 uppercase italic">Movie Not Found</h2>
        <button onClick={() => navigate('/')} className="text-primary underline">Return to Movies</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
      {/* Hero Section */}
      <div className="bg-background-surface rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[300px] shrink-0">
          <img 
            src={movie.posterUrl || `https://picsum.photos/seed/${movie._id}/400/600`} 
            alt={movie.title}
            className="w-full rounded-xl shadow-2xl border border-white/10"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter">{movie.title}</h1>
          <div className="flex gap-4 text-gray-400 mb-6 font-bold text-sm uppercase">
            <span className="bg-white/5 px-2 py-1 rounded">{movie.duration} MINS</span>
            <span className="text-primary italic">{movie.genre}</span>
            <span className="bg-white/5 px-2 py-1 rounded">{movie.language}</span>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
            {movie.description || "The journey of a lifetime begins with a single ticket."}
          </p>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Available Showtimes</h3>
        <div className="grid grid-cols-1 gap-4">
          {shows.length > 0 ? (
            shows.map((show: any) => (
              <div key={show._id} className="bg-background-surface border border-white/5 rounded-2xl p-6 flex justify-between items-center group hover:border-primary/50 transition-all">
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors uppercase">
                    {show.theatreId?.name || "Cinema Hall"}
                  </h4>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                    {show.screenId?.screenName || "Standard Screen"}
                  </p>
                </div>
                
                <button 
                  onClick={() => navigate(`/shows/${show._id}/seats`)}
                  className="bg-background-dark border border-primary/50 text-white px-8 py-4 rounded-xl hover:bg-primary transition-all font-black uppercase"
                >
                  {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic py-10 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
              No shows available for this movie today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;