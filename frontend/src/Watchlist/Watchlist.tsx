import { useState, useEffect } from 'react'
import "./Watchlist.css";
import MovieListButton from "../components/MovieListButton";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


useEffect(() => {
  const token = localStorage.getItem('token');

  fetch('/api/watchlist', {
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

}, []);
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
          />

          </div>
        ))}
      </div>

    )}

  </div>
)
}
export default Watchlist