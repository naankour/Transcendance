import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MovieListButton from './components/MovieListButton';
import './MoviePage.css';

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

interface Props {
  triggerToast: (message: string, icon?: string) => void;
}

function getCurrentUserId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
}

function MoviePage({ triggerToast }: Props) {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [myReviewId, setMyReviewId] = useState<number | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const currentUserId = getCurrentUserId();

  function formatRuntime(minutes: number) {
    if (!minutes) return t('moviePage.unknown');
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  }

  const checkListsStatus = (movieId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    Promise.all([
      fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
        res.ok ? res.json() : []
      ),
      fetch('/api/watchlist', { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
        res.ok ? res.json() : []
      ),
    ]).then(([favorites, watchlist]) => {
      setIsFavorite(favorites.some((item: any) => item.movie_id === movieId));
      setIsInWatchlist(watchlist.some((item: any) => item.movie_id === movieId));
    });
  };

  const loadMovie = () => {
    setLoading(true);
    setError(null);

    fetch(`/api/movies/${id}?lang=${i18n.language}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('moviePage.notFound'));
        setMovie(data);
        checkListsStatus(data.id);

        // Pré-remplit le formulaire si l'utilisateur a déjà une review sur ce film
        if (currentUserId) {
          const existing = data.reviews.find((r: Review) => r.user.id === currentUserId);
          if (existing) {
            setMyReviewId(existing.id);
            setRating(existing.rating);
            setContent(existing.content || '');
          } else {
            setMyReviewId(null);
            setRating(5);
            setContent('');
          }
        }
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

      loadMovie();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="movie-page">
      <Link to="/" className="movie-page__back">← {t('moviePage.backToSearch')}</Link>

      {loading && <p className="movie-page__state">{t('moviePage.loading')}</p>}
      {error && <p className="movie-page__state movie-page__state--error">{error}</p>}

      {movie && (
        <div>
          <div className="movie-page__header">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-page__poster"
            />
            <div className="movie-page__info">
              <h2 className="movie-page__title">{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
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

              {isLoggedIn && (
                <div className="movie-page__list-buttons">
                  <MovieListButton
                    movieId={movie.id}
                    type="favorites"
                    action={isFavorite ? 'remove' : 'add'}
                    triggerToast={triggerToast}
                    onSuccess={() => setIsFavorite(!isFavorite)}
                  />
                  <MovieListButton
                    movieId={movie.id}
                    type="watchlist"
                    action={isInWatchlist ? 'remove' : 'add'}
                    triggerToast={triggerToast}
                    onSuccess={() => setIsInWatchlist(!isInWatchlist)}
                  />
                </div>
              )}
            </div>
          </div>

          <h3 className="movie-page__section-title">{t('moviePage.synopsis')}</h3>
          <p className="movie-page__synopsis">{movie.overview}</p>

          {isLoggedIn && (
            <>
              <h3 className="movie-page__section-title">
                {myReviewId ? t('moviePage.editReview') : t('moviePage.leaveReview')}
              </h3>
              <div className="movie-page__rating-select">
                <label>{t('moviePage.rating')} :</label>
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
                className="movie-page__textarea"
              />
              <button onClick={handleSubmitReview} disabled={submitting} className="movie-page__submit-btn">
                {submitting
                  ? t('moviePage.submitting')
                  : myReviewId
                  ? t('moviePage.updateReview')
                  : t('moviePage.publishReview')}
              </button>
              {submitError && <p className="movie-page__submit-error">{submitError}</p>}
            </>
          )}

          <h3 className="movie-page__section-title">{t('moviePage.reviewsCount', { count: movie.reviews.length })}</h3>
          {movie.reviews.length === 0 && <p className="movie-page__state">{t('moviePage.noReviews')}</p>}
          {movie.reviews.map((r) => (
            <div key={r.id} className="movie-page__review">
              <span className="movie-page__review-author">
                <strong>{r.user.username}</strong>
                {r.user.id === currentUserId && ` (${t('moviePage.you')})`}
              </span>
              <span className="movie-page__review-rating">{r.rating} / 5</span>
              <p className="movie-page__review-content">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviePage;