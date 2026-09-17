import {useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Discover.css'

interface Genre {
  id: number;
  name: string;
}

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

const CURRENT_YEAR = 2026;
const EARLIEST_YEAR = 1900;
const PAGE_SIZE = 24;


function buildDecades() {
  const decades: number[] = [];
  for (let d = Math.floor(CURRENT_YEAR / 10) * 10; d >= EARLIEST_YEAR; d -= 10) {
    decades.push(d);
  }
  return decades;
}


export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();

 	const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';
  const sort = searchParams.get('sort') || '';
  const language = searchParams.get('language') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreArray, setGenreArray] = useState<Genre[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 	const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [openDecade, setOpenDecade] = useState<number | null>(null);

 	const requestIdRef = useRef(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const movieBufferRef = useRef<Movie[]>([]);
  const rawPageCursorRef = useRef(0);
  const rawTotalPagesRef = useRef(1);
  const exhaustedRef = useRef(false);
  const lastFiltersKeyRef = useRef('');

  const { t, i18n } = useTranslation();

 	const navigate = useNavigate();

  const handleSearch = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  function updateParams(changes: Record<string, string | null>, resetPage: boolean) 
  {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    if (resetPage) {
      next.set('page', '1');
    }

    setSearchParams(next, { replace: true });
  }

  function setGenre(value: string)
  {
    updateParams({ genre: value }, true);
  }

  function setYear(value: string)
  {
    updateParams({ year: value }, true);
  }

  function setSort(value: string)
  {
    updateParams({ sort: value }, true);
  }

  function setLanguage(value: string)
  {
    updateParams({ language: value }, true);
  }

  function setPage(newPage: number) 
  {
    updateParams({ page: newPage.toString() }, false);
  }
  
  async function fetchGenres() {
    try {
      const tmdbLanguage = i18n.language === 'fr'
        ? 'fr-FR'
        : i18n.language === 'es'
          ? 'es-ES'
          : 'en-US';
  
      const request = await fetch(`/api/discover/genres?language=${tmdbLanguage}`);
      const data = await request.json();
      setGenreArray(data.genres);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMovies() {
  const currentRequestId = ++requestIdRef.current;

    await Promise.resolve();
    if (currentRequestId !== requestIdRef.current) 
      return;

  const filtersKey = `${genre}|${year}|${sort}|${language}`;

    if (filtersKey !== lastFiltersKeyRef.current) {
      lastFiltersKeyRef.current = filtersKey;
      seenIdsRef.current = new Set();
      movieBufferRef.current = [];
      rawPageCursorRef.current = 0;
      rawTotalPagesRef.current = 1;
      exhaustedRef.current = false;
    }

  setLoading(true);
  setError(null);

  try {
    const requiredCount = page * PAGE_SIZE;

    while (movieBufferRef.current.length < requiredCount && !exhaustedRef.current) 
    {
      rawPageCursorRef.current += 1;
      const rawPage = rawPageCursorRef.current;

      if (rawPage > 500) {
        exhaustedRef.current = true;
        break;
      }

      const params = new URLSearchParams();
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);
      if (sort) params.append('sort_by', sort);
      if (language) params.append('language', language);
      params.append('page', rawPage.toString());

      const request = await fetch(`/api/discover?${params.toString()}`);

      if (currentRequestId !== requestIdRef.current) return;

      if (!request.ok) {
        throw new Error(`Erreur ${request.status}`);
      }

      const data = await request.json();

      if (currentRequestId !== requestIdRef.current) 
        return;

      rawTotalPagesRef.current = Math.min(data.total_pages || 1, 500);

      const rawResults: Movie[] = data.results || [];

      if (rawResults.length === 0 || rawPage >= rawTotalPagesRef.current) 
      {
        exhaustedRef.current = true;
      }

      const deduped = rawResults.filter((m) => !seenIdsRef.current.has(m.id));
      deduped.forEach((m) => seenIdsRef.current.add(m.id));

      movieBufferRef.current = [...movieBufferRef.current, ...deduped];
    }

    if (currentRequestId !== requestIdRef.current) 
      return;

    const start = (page - 1) * PAGE_SIZE;
    const pageMovies = movieBufferRef.current.slice(start, start + PAGE_SIZE);

    setMovies(pageMovies);
    setTotalPages(rawTotalPagesRef.current);
  } 
  catch (err: any) 
  {
    if (currentRequestId !== requestIdRef.current) return;
    console.error(err);
    setError(err.message || 'An Error occured');
    setMovies([]);
  } 
  finally {
    if (currentRequestId === requestIdRef.current) 
    {
      setLoading(false);
    }
  }
}


useEffect(() => {
  fetchGenres();
}, [i18n.language]);

  useEffect(() => {
    fetchMovies();
  }, [genre, year, sort, language, page]);
  
  const decades = buildDecades();

   function handleSelectYear(y: number) {
    setYear(y.toString());
    setIsYearPickerOpen(false);
    setOpenDecade(null);
  }

  function handleClearYear() {
    setYear('');
    setIsYearPickerOpen(false);
    setOpenDecade(null);
  }

  return (
    <div className="discover-page">
      <h1 className="discover-title">{t('discover.title')}</h1>
      <div className="discover-filters">
        <div className="discover-filter">
          <label htmlFor="genres">{t('discover.filters.genre')}</label>
          <select id="genres" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">{t('discover.filters.anyGenre')}</option>
            {genreArray.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="discover-filter">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">{t('discover.filters.neutral')}</option>
            <optgroup label={t('discover.filters.popularity')}>
              <option value="popularity.desc">{t('discover.filters.highestFirst')}</option>
              <option value="popularity.asc">{t('discover.filters.lowestFirst')}</option>
            </optgroup>
            <optgroup label={t('discover.filters.releaseDate')}>
              <option value="primary_release_date.desc">{t('discover.filters.newestFirst')}</option>
              <option value="primary_release_date.asc">{t('discover.filters.earliestFirst')}</option>
            </optgroup>
            <optgroup label={t('discover.filters.rating')}>
              <option value="vote_average.desc">{t('discover.filters.highestRated')}</option>
              <option value="vote_average.asc">{t('discover.filters.lowestRated')}</option>
            </optgroup>
          </select>
        </div>

        <div className="discover-filter discover-year-filter">
          <label>{t('discover.filters.year')}</label>
          <button
            type="button"
            className="discover-year-trigger"
            onClick={() => setIsYearPickerOpen((prev) => !prev)}
          >
            {year || t('discover.filters.anyYear')}
          </button>

          {isYearPickerOpen && (
            <div className="discover-year-panel">
              {openDecade === null ? (
                <>
                  <button className="discover-year-reset" onClick={handleClearYear}>
                    ✦ {t('discover.filters.anyYear')} ✦
                  </button>
                  <div className="discover-decade-grid">
                    {decades.map((decade) => (
                      <button
                        key={decade}
                        className="discover-decade-btn"
                        onClick={() => setOpenDecade(decade)}
                      >
                        {decade}s
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button className="discover-year-back" onClick={() => setOpenDecade(null)}>
                    ← {t('discover.filters.backToDecades')}
                  </button>
                  <div className="discover-year-grid">
                    {Array.from({ length: 10 }, (_, i) => openDecade + i)
                      .filter((y) => y >= EARLIEST_YEAR && y <= CURRENT_YEAR)
                      .map((y) => (
                        <button
                          key={y}
                          className={`discover-year-btn ${year === y.toString() ? 'active' : ''}`}
                          onClick={() => handleSelectYear(y)}
                        >
                          {y}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="discover-filter">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">{t('discover.filters.language')}</option>
            <option value="en">{t('discover.filters.english')}</option>
            <option value="fr">{t('discover.filters.french')}</option>
            <option value="es">{t('discover.filters.spanish')}</option>
            <option value="ja">{t('discover.filters.japanese')}</option>
            <option value="ko">{t('discover.filters.korean')}</option>
            <option value="de">{t('discover.filters.german')}</option>
            <option value="it">{t('discover.filters.italian')}</option>
          </select>
        </div>
      </div>

      {loading && <p className="discover-status">{t('discover.status.loading')}</p>}
      {error && <p className="discover-status discover-error">Error: {error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="discover-status">{t('discover.status.noMovies')}</p>
      )}

      <div className="discover-grid">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className="discover-poster"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : '/placeholder-poster.png'
            }
            alt={movie.title}
            onClick={() => handleSearch(movie)}
          />
        ))}
      </div>

      {!loading &&
        !error &&
        exhaustedRef.current &&
        movies.length > 0 &&
        page >= Math.ceil(movieBufferRef.current.length / PAGE_SIZE) && (
          <p className="discover-status">✦ {t('discover.status.noMoreMovies')} ✦</p>
        )}

      <div className="discover-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          {t('discover.pagination.previous')}
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={exhaustedRef.current && movieBufferRef.current.length <= page * PAGE_SIZE}
          onClick={() => setPage(page + 1)}
        >
          {t('discover.pagination.next')}
        </button>
      </div>
    </div>
  );
}
