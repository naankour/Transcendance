import { useState, useEffect } from 'react'
import "./Watchlist.css";
import MovieListButton from "../components/MovieListButton";
import { Link } from "react-router-dom";

interface WatchlistProps {
  triggerToast?: (msg: string, icon?: string) => void;
  userId?: number;
}

const Watchlist = ({ triggerToast, userId }: WatchlistProps) => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const removeWatchlist = (movieId:number) => 
  {
    setWatchlist(prev =>
        prev.filter(item => item.movie_id !== movieId)
    );
  };


useEffect(() => {
  const token = localStorage.getItem('token');

  const endpoint = userId ? `/api/watchlist/user/${userId}` : 'api/watchlist';

  fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log(data);

      if (data.length > 0)
      {
        console.log(data[0].movies);
      }
      setWatchlist(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

}, [userId]);
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error}</p>

    return (
  <div className="watchlist-page">

    <h1 className="watchlist_title">
      My Watchlist
    </h1>

    {watchlist.length === 0 ? (
      <p className="watchlist-empty">
        Your watchlist is empty
      </p>
    ) : (

      <div className="watchlist-list">
        {watchlist.map((item: any) => (
          <div key={item.id} className="watchlist-card">

            <Link to={`/movie/${item.movies.tmdb_id}`} className="link">
              <img
                className="watchlist-poster"
                src={item.movies.poster}
                alt={item.movies.title}
              />
          
            <h2>{item.movies.title}</h2>
            </Link>  

          <MovieListButton
            movieId={item.movie_id}
            type="watchlist"
            action="remove"
            triggerToast={triggerToast}
            onSuccess={() => removeWatchlist(item.movie_id)}
          />

          </div>
        ))}
      </div>

    )}

  </div>
)
}
export default Watchlist