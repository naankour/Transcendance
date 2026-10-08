import {useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import './Discover.css'

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

const selectClass =
  'min-w-[140px] bg-brand-black text-brand-white border border-brand-pink-soft rounded-[4px] px-[10px] py-[6px] font-hand text-[16px] cursor-pointer focus:outline-none focus:shadow-[0_0_8px_var(--color-brand-pink)]';

const labelClass = 'text-[15px] text-brand-pink-soft lowercase';

const pickerBtnBase =
  'font-retro text-[14px] cursor-pointer rounded-[4px] px-[4px] py-[6px] border transition-all duration-150';
const pickerBtnIdle =
  'bg-brand-dark text-brand-white border-brand-pink-soft/40 hover:bg-brand-pink/25 hover:border-brand-pink';
const pickerBtnActive =
  'bg-linear-135 from-brand-pink to-brand-pink-soft text-brand-black font-bold border-brand-pink';

const paginationBtn =
  'bg-brand-dark text-brand-white border border-brand-pink rounded-[4px] px-[16px] py-[6px] font-hand text-[18px] cursor-pointer enabled:hover:bg-brand-pink/25 enabled:hover:shadow-[0_0_10px_rgba(255,46,154,0.5)] disabled:opacity-35 disabled:cursor-not-allowed';

const statusClass = 'text-center text-[22px] my-[24px]';

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
    <div className="min-h-[calc(100vh_-_120px)] p-[24px] bg-brand-black text-brand-white font-hand">
      <h1 className="mt-0 mb-[42px] text-center text-[42px] text-brand-pink [text-shadow:0_0_10px_rgba(255,46,154,0.7)]">
        {t('discover.title')}
      </h1>

      <div className="flex flex-wrap items-end justify-center gap-[16px] mb-[28px] p-[16px] bg-brand-dark border-2 border-brand-pink rounded-[6px] shadow-[0_0_16px_rgba(255,46,154,0.25)]">
        {/* Genre */}
        <div className="relative flex flex-col gap-[4px]">
          <label htmlFor="genres" className={labelClass}>
            {t('discover.filters.genre')}
          </label>
          <select
            id="genres"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={selectClass}
          >
            <option value="">{t('discover.filters.anyGenre')}</option>
            {genreArray.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div className="relative flex flex-col gap-[4px]">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
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

        {/* Année (décennie -> année) */}
        <div className="relative flex flex-col items-stretch gap-[4px]">
          <label className={labelClass}>{t('discover.filters.year')}</label>
          <button
            type="button"
            onClick={() => setIsYearPickerOpen((prev) => !prev)}
            className="min-w-[140px] bg-brand-black text-brand-white border border-brand-pink-soft rounded-[4px] px-[10px] py-[6px] font-hand text-[16px] text-left cursor-pointer hover:shadow-[0_0_8px_var(--color-brand-pink)]"
          >
            {year || t('discover.filters.anyYear')}
          </button>

          {isYearPickerOpen && (
            <div className="absolute top-[calc(100%_+_6px)] left-0 z-50 w-[260px] p-[10px] bg-linear-160 from-brand-black to-brand-dark border-2 border-brand-pink rounded-[6px] shadow-[0_0_20px_rgba(255,46,154,0.5)]">
              {openDecade === null ? (
                <>
                  <button
                    onClick={handleClearYear}
                    className="block w-full mb-[8px] px-[4px] py-[6px] border-b border-brand-pink-soft/30 text-left text-[17px] text-brand-pink-soft font-hand cursor-pointer hover:text-brand-pink"
                  >
                    ✦ {t('discover.filters.anyYear')} ✦
                  </button>
                  <div className="grid grid-cols-3 gap-[6px]">
                    {decades.map((decade) => (
                      <button
                        key={decade}
                        onClick={() => setOpenDecade(decade)}
                        className={`${pickerBtnBase} ${pickerBtnIdle}`}
                      >
                        {decade}s
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setOpenDecade(null)}
                    className="block p-0 mb-[8px] text-[16px] text-brand-pink-soft font-hand cursor-pointer hover:text-brand-pink"
                  >
                    ← {t('discover.filters.backToDecades')}
                  </button>
                  <div className="grid grid-cols-3 gap-[6px]">
                    {Array.from({ length: 10 }, (_, i) => openDecade + i)
                      .filter((y) => y >= EARLIEST_YEAR && y <= CURRENT_YEAR)
                      .map((y) => (
                        <button
                          key={y}
                          onClick={() => handleSelectYear(y)}
                          className={`${pickerBtnBase} ${
                            year === y.toString() ? pickerBtnActive : pickerBtnIdle
                          }`}
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

        {/* Langue */}
        <div className="relative flex flex-col gap-[4px]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
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

      {loading && <p className={`${statusClass} text-brand-pink-soft`}>{t('discover.status.loading')}</p>}
      {error && <p className={`${statusClass} text-brand-pink`}>Error: {error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className={`${statusClass} text-brand-pink-soft`}>{t('discover.status.noMovies')}</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-[14px] mb-[24px]">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : '/placeholder-poster.png'
            }
            alt={movie.title}
            onClick={() => handleSearch(movie)}
            className="w-full rounded-[4px] cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-brand-pink hover:shadow-[0_0_14px_rgba(255,46,154,0.6)] hover:-translate-y-[4px]"
          />
        ))}
      </div>

      {!loading &&
        !error &&
        exhaustedRef.current &&
        movies.length > 0 &&
        page >= Math.ceil(movieBufferRef.current.length / PAGE_SIZE) && (
          <p className={`${statusClass} text-brand-pink-soft`}>
            ✦ {t('discover.status.noMoreMovies')} ✦
          </p>
        )}

      <div className="flex items-center justify-center gap-[16px] text-[20px]">
        <button className={paginationBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
          {t('discover.pagination.previous')}
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          className={paginationBtn}
          disabled={exhaustedRef.current && movieBufferRef.current.length <= page * PAGE_SIZE}
          onClick={() => setPage(page + 1)}
        >
          {t('discover.pagination.next')}
        </button>
      </div>
    </div>
  );
}
