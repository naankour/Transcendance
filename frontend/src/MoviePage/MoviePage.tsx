import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MovieListButton from '../components/MovieListButton';

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

// ---- Classes Tailwind réutilisées ------------------------------------------

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-movie-accent-soft';

const linkClass = `text-movie-accent-soft underline decoration-movie-accent transition-colors duration-200 hover:text-white hover:decoration-white ${focusRing}`;

const sectionTitle =
  'clear-both mb-3 mt-8 border-b border-movie-border pb-2.5 text-base font-bold uppercase tracking-wider text-movie-accent-soft sm:text-[1.15rem]';

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
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

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

      triggerToast(myReviewId ? t('moviePage.reviewUpdated') : t('moviePage.reviewPublished'), '⭐');
      loadMovie();
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    setDeletingReviewId(reviewId);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('errors.generic'));
      }

      triggerToast(t('moviePage.reviewDeleted'), '🗑️');
      setRating(5);
      setContent('');
      setMyReviewId(null);
      loadMovie();
    } catch (err: any) {
      triggerToast(err.message, '⚠️');
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[900px] bg-movie-bg bg-movie-glow px-4 pb-20 pt-6 font-movie text-movie-text sm:px-6 sm:pt-8">
      <Link to="/" className={`mb-5 inline-block ${linkClass}`}>
        ← {t('moviePage.backToSearch')}
      </Link>

      {loading && <p className="text-movie-muted">{t('moviePage.loading')}</p>}
      {error && (
        <p role="alert" className="text-movie-danger">
          {error}
        </p>
      )}

      {movie && (
        <div>
          {/* ---- Header (poster + infos) : en colonne sur mobile, en ligne dès sm ---- */}
          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="h-auto w-36 max-w-full shrink-0 rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.5)] sm:w-[160px] md:w-[180px]"
            />
            <div className="w-full min-w-0 sm:flex-1 [&_p]:my-1.5 [&_p]:break-words [&_p]:leading-normal [&_p]:text-movie-muted [&_strong]:text-movie-text">
              <h2 className="mb-3 mt-0 break-words text-2xl font-bold text-white sm:text-[1.6rem]">
                {movie.title} ({movie.release_date?.slice(0, 4)})
              </h2>
              <p>
                <strong>{t('moviePage.director')} :</strong>{' '}
                {movie.director ? (
                  <Link to={`/actor/${movie.director.id}`} className={linkClass}>
                    {movie.director.name}
                  </Link>
                ) : (
                  t('moviePage.unknown')
                )}
              </p>
              <p>
                <strong>{t('moviePage.genres')} :</strong> {movie.genres.join(', ')}
              </p>
              <p>
                <strong>{t('moviePage.duration')} :</strong> {formatRuntime(movie.runtime)}
              </p>
              <p>
                <strong>{t('moviePage.userRating')} :</strong> {Number(movie.average_rating).toFixed(1)} / 5
              </p>
              <p>
                <strong>{t('moviePage.rating')} (TMDB) :</strong> {movie.vote_average} / 10
              </p>
              <p>
                <strong>{t('moviePage.cast')} :</strong>{' '}
                {movie.cast.map((actor, index) => (
                  <span key={actor.id}>
                    <Link to={`/actor/${actor.id}`} className={linkClass}>
                      {actor.name}
                    </Link>
                    {index < movie.cast.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>

              {isLoggedIn && (
                <div className="mt-3 flex flex-wrap gap-2">
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

          {/* ---- Synopsis ---- */}
          <h3 className={sectionTitle}>{t('moviePage.synopsis')}</h3>
          <p className="break-words leading-[1.6] text-movie-muted">{movie.overview}</p>

          {/* ---- Formulaire de review ---- */}
          {isLoggedIn && (
            <>
              <h3 className={sectionTitle}>
                {myReviewId ? t('moviePage.editReview') : t('moviePage.leaveReview')}
              </h3>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <label htmlFor="movie-rating">{t('moviePage.rating')} :</label>
                <select
                  id="movie-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className={`rounded-md border-0 bg-white px-2.5 py-1 font-semibold text-[#222] ${focusRing}`}
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('moviePage.reviewPlaceholder')}
                aria-label={t('moviePage.reviewPlaceholder')}
                className={`min-h-[100px] w-full max-w-full resize-y rounded-lg border-0 bg-white p-3 text-[#222] ${focusRing}`}
              />
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className={`mt-3 w-full cursor-pointer rounded-lg border-0 bg-[#e9e6e8] px-[22px] py-2.5 font-semibold text-[#1a1a1a] transition duration-200 enabled:hover:-translate-y-px enabled:hover:bg-movie-accent-soft enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}
                >
                  {submitting
                    ? t('moviePage.submitting')
                    : myReviewId
                    ? t('moviePage.updateReview')
                    : t('moviePage.publishReview')}
                </button>
                {myReviewId && (
                  <button
                    onClick={() => handleDeleteReview(myReviewId)}
                    disabled={deletingReviewId === myReviewId}
                    className={`mt-3 w-full cursor-pointer rounded-lg border border-movie-danger bg-transparent px-5 py-2.5 font-semibold text-movie-danger transition duration-200 enabled:hover:-translate-y-px enabled:hover:bg-movie-danger enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}
                  >
                    {deletingReviewId === myReviewId ? t('moviePage.deleting') : t('moviePage.deleteReview')}
                  </button>
                )}
              </div>
              {submitError && (
                <p role="alert" className="mt-2 text-movie-danger">
                  {submitError}
                </p>
              )}
            </>
          )}

          {/* ---- Liste des reviews ---- */}
          <h3 className={sectionTitle}>{t('moviePage.reviewsCount', { count: movie.reviews.length })}</h3>
          {movie.reviews.length === 0 && <p className="text-movie-muted">{t('moviePage.noReviews')}</p>}
          {movie.reviews.map((r) => (
            <div key={r.id} className="border-b border-movie-border py-3.5 last:border-b-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="break-words text-movie-accent-soft">
                  <strong>{r.user.username}</strong>
                  {r.user.id === currentUserId && ` (${t('moviePage.you')})`}
                </span>
                <span className="inline-block rounded-full bg-movie-accent px-2.5 py-0.5 text-[0.8rem] font-semibold text-white">
                  {r.rating} / 5
                </span>
              </div>
              <p className="mt-1.5 break-words leading-normal text-movie-muted">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviePage;