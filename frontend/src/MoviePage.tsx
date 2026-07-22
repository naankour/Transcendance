import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: string[];
  vote_average: number;
  poster_path: string;
  director: string | null;
  cast: { name: string; character: string }[];
}

function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMovie(null);

    fetch(`/movies/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur');
        setMovie(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <Link to="/">← Retour à la recherche</Link>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {movie && (
        <div style={{ marginTop: 20 }}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            style={{ maxWidth: 150, float: 'left', marginRight: 15 }}
          />
          <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
          <p><strong>Réalisateur :</strong> {movie.director || 'Inconnu'}</p>
          <p><strong>Genres :</strong> {movie.genres.join(', ')}</p>
          <p><strong>Note :</strong> {movie.vote_average} / 10</p>
          <p>{movie.overview}</p>
          <p><strong>Casting :</strong> {movie.cast.map((a) => a.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default MoviePage;