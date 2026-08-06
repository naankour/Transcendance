import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Review {
  id: number;
  rating: number;
  content: string | null;
  created_at: string;
  user: { id: number; username: string; avatar_url: string | null };
}

interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  genres: string[];
  vote_average: number;
  poster_path: string;
  director: { id: number; name: string } | null;
  cast: { id: number; name: string; character: string }[];
  average_rating: number;
  reviews: Review[];
}

function MoviePage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function formatRuntime(minutes: number) {
    if (!minutes) return t('moviePage.unknown');
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  }

  const loadMovie = () => {
    setLoading(true);
    setError(null);

    fetch(`/api/movies/${id}?lang=${i18n.language}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('moviePage.notFound'));
        setMovie(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setMovie(null);
    loadMovie();
  }, [id, i18n.language]);

  const handleSubmitReview = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/movies/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('errors.generic'));

      setContent('');
      loadMovie();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <Link to="/">← {t('moviePage.backToSearch')}</Link>

      {loading && <p>{t('moviePage.loading')}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {movie && (
        <div style={{ marginTop: 20 }}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            style={{ maxWidth: 150, float: 'left', marginRight: 15 }}
          />
          <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
          <p>
            <strong>{t('moviePage.director')} :</strong>{' '}
            {movie.director ? (
              <Link to={`/actor/${movie.director.id}`}>{movie.director.name}</Link>
            ) : (
              t('moviePage.unknown')
            )}
          </p>
          <p><strong>{t('moviePage.genres')} :</strong> {movie.genres.join(', ')}</p>
          <p><strong>{t('moviePage.duration')} :</strong> {formatRuntime(movie.runtime)}</p>
          <p><strong>{t('moviePage.userRating')} :</strong> {Number(movie.average_rating).toFixed(1)} / 5</p>
          <p><strong>{t('moviePage.rating')} (TMDB) :</strong> {movie.vote_average} / 10</p>
          <p>
            <strong>{t('moviePage.cast')} :</strong>{' '}
            {movie.cast.map((actor, index) => (
              <span key={actor.id}>
                <Link to={`/actor/${actor.id}`}>{actor.name}</Link>
                {index < movie.cast.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <h3 style={{ clear: 'both', marginTop: 20 }}>{t('moviePage.synopsis')}</h3>
          <p>{movie.overview}</p>

          <h3>{t('moviePage.leaveReview')}</h3>
          <div style={{ marginBottom: 10 }}>
            <label>{t('moviePage.rating')} : </label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} / 5</option>
              ))}
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('moviePage.reviewPlaceholder')}
            style={{ width: '100%', minHeight: 80, padding: 8 }}
          />
          <button onClick={handleSubmitReview} disabled={submitting} style={{ marginTop: 8, padding: '8px 16px' }}>
            {submitting ? t('moviePage.submitting') : t('moviePage.publishReview')}
          </button>
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

          <h3 style={{ marginTop: 30 }}>{t('moviePage.reviewsCount', { count: movie.reviews.length })}</h3>
          {movie.reviews.length === 0 && <p>{t('moviePage.noReviews')}</p>}
          {movie.reviews.map((r) => (
            <div key={r.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
              <strong>{r.user.username}</strong> — {r.rating} / 5
              <p style={{ margin: '4px 0' }}>{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviePage;