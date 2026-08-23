import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import "./Favorites.css";
import MovieListButton from "../components/MovieListButton";
import AuthRequired from "../components/AuthRequired";
import { Link } from "react-router-dom";

function getPosterUrl(poster: string | null) {
  if (!poster) return '';
  if (poster.startsWith('http')) return poster;
  return `https://image.tmdb.org/t/p/w200${poster}`;
}

const Favorites = ({ triggerToast }) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthError, setIsAuthError] = useState(false)
  const removeFavorite = (movieId:number) => 
  {
    setFavorites(prev =>
        prev.filter(item => item.movie_id !== movieId)
    );
  };


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
      if (res.status === 403) {
        setIsAuthError(true);
        throw new Error('Forbidden');
      }
      if (!res.ok) 
        {
            throw new Error(`Erreur ${res.status}`);
        }
        return res.json();
    })
    .then(data => 
    {
      console.log(data);

      if (data.length > 0)
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

  if (loading) return <p>{t('favorites.loading')}</p>
  if (isAuthError) return <AuthRequired />
  if (error) return <p>{t('favorites.error', { message: error })}</p>

    return (
  <div className="favorites-page">

    <h1 className="favorites_title">
      {t('favorites.title')}
    </h1>

    {favorites.length === 0 ? (
      <p className="favorites-empty">
        {t('favorites.empty')}
      </p>
    ) : (

      <div className="favorites-list">
        {favorites.map((item: any) => (
          <div key={item.id} className="favorites-card">

          <Link to={`/movie/${item.movies.tmdb_id}`} className="link">
          
            <img
              className="favorites-poster"
              src={getPosterUrl(item.movies.poster)}
              alt={item.movies.title}
            />

            <h2>{item.movies.title}</h2>

          </Link> 

            <MovieListButton
            movieId={item.movie_id}
            type="favorites"
            action="remove"
            triggerToast={triggerToast}
            onSuccess={() => removeFavorite(item.movie_id)}
          />

          </div>
        ))}
      </div>

    )}

  </div>
)
}
export default Favorites