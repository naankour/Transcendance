import { useState, useEffect } from 'react'
import "./Favorites.css";
import MovieListButton from "../components/MovieListButton";

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


useEffect(() => 
    {
    const token = localStorage.getItem('token');

    fetch('/api/Favorites', 
    {
        headers: 
        {
        Authorization: `Bearer ${token}`
        }
    })
    .then(res => 
    {
      if (!res.ok) 
        {
            throw new Error(`Erreur ${res.status}`);
        }
        return res.json();
    })
    .then(data => 
    {
      console.log(data);

      if (data.lemgth > 0)
      {
        console.log(data[0].movies);
      }
      setFavorites(data);
      setLoading(false);
    })
    .catch(err => 
    {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

}, []);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error}</p>

    return (
  <div className="favorites-page">

    <h1 className="favorites_title">
      My Favorites
    </h1>

    {favorites.length === 0 ? (
      <p className="favorites-empty">
        Your Favorites list is empty
      </p>
    ) : (

      <div className="favorites-list">
        {favorites.map((item: any) => (
          <div key={item.id} className="favorites-card">

            <img
              className="favorites-poster"
              src={item.movies.poster}
              alt={item.movies.title}
            />

            <h2>{item.movies.title}</h2>

            <MovieListButton
            movieId={item.movie_id}
            type="favorites"
            action="remove"
          />

          </div>
        ))}
      </div>

    )}

  </div>
)
}
export default Favorites