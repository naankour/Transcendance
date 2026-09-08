import {useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
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

function buildDecades() {
  const decades: number[] = [];
  for (let d = Math.floor(CURRENT_YEAR / 10) * 10; d >= EARLIEST_YEAR; d -= 10) {
    decades.push(d);
  }
  return decades;
}

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();

	const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
//	 const [minRating, setMinRating] = useState('');
	const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreArray, setGenreArray] = useState<Genre[]>([]);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  	const [openDecade, setOpenDecade] = useState<number | null>(null);

  const PAGE_SIZE = 24;

	const requestIdRef = useRef(0);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const movieBufferRef = useRef<Movie[]>([]);
  const rawPageCursorRef = useRef(0);
  const rawTotalPagesRef = useRef(1);
  const exhaustedRef = useRef(false);
  const isFirstRender = useRef(true);
  // const pageCacheRef = useRef<Map<number, Movie[]>>(new Map());

	const navigate = useNavigate();

  const handleSearch = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  async function fetchGenres() {
    try {
      const request = await fetch('/api/discover/genres');
      const data = await request.json();
      setGenreArray(data.genres);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMovies() {
  const currentRequestId = ++requestIdRef.current;

  setLoading(true);
  setError(null);

  try {
    const requiredCount = page * PAGE_SIZE;

    while (movieBufferRef.current.length < requiredCount && !exhaustedRef.current) {
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

      if (currentRequestId !== requestIdRef.current) return;

      rawTotalPagesRef.current = Math.min(data.total_pages || 1, 500);

      const rawResults: Movie[] = data.results || [];

      if (rawResults.length === 0 || rawPage >= rawTotalPagesRef.current) {
        exhaustedRef.current = true;
      }

      const deduped = rawResults.filter((m) => !seenIdsRef.current.has(m.id));
      deduped.forEach((m) => seenIdsRef.current.add(m.id));

      movieBufferRef.current = [...movieBufferRef.current, ...deduped];
    }

    if (currentRequestId !== requestIdRef.current) return;

    const start = (page - 1) * PAGE_SIZE;
    const pageMovies = movieBufferRef.current.slice(start, start + PAGE_SIZE);

    setMovies(pageMovies);
    setTotalPages(rawTotalPagesRef.current);
  } 
  catch (err: any) {
    if (currentRequestId !== requestIdRef.current) return;
    console.error(err);
    setError(err.message || 'An Error occured');
    setMovies([]);
  } 
  finally {
    if (currentRequestId === requestIdRef.current) {
      setLoading(false);
    }
  }
}


  useEffect(() => {
    fetchGenres();
  }, []);

  
  useEffect(() => {
    if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  setPage(1);
  seenIdsRef.current = new Set();
  movieBufferRef.current = [];
  rawPageCursorRef.current = 0;
  rawTotalPagesRef.current = 1;
  exhaustedRef.current = false;
}, [genre, year, sort, language]);

useEffect(() => {
    const params: Record<string, string> = {};
    if (genre) 
      params.genre = genre;
    if (year)
        params.year = year;
    if (sort)
      params.sort = sort;
    if (language)
      params.language = language;
    params.page = page.toString();

    setSearchParams(params, { replace: true });
  }, [genre, year, sort ,language, page]);

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
		<h1 className="discover-title">✦ Discover Movies ✦</h1>
      <div className="discover-filters">
		<div className="discover-filter"> 
        	<label htmlFor="genres">Choose a genre:</label>
        	<select id="genres" value={genre} onChange={(e) => setGenre(e.target.value)}>
          		<option value="">Any Genre</option>
          		{genreArray.map((g) => (
            	<option key={g.id} value={g.id}>
              	{g.name}
            	</option>
         		))}
        	</select>
		</div>

		<div className="discover-filter">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          	<option value="">Neutral Sort</option>
          	<optgroup label="Popularity">
            	<option value="popularity.desc">Highest First</option>
            	<option value="popularity.asc">Lowest First</option>
          	</optgroup>
          	<optgroup label="Release Date">
            	<option value="primary_release_date.desc">Newest First</option>
            	<option value="primary_release_date.asc">Earliest First</option>
          	</optgroup>
          	<optgroup label="Rating">
            	<option value="vote_average.desc">Highest Rated</option>
            	<option value="vote_average.asc">Lowest Rated</option>
          	</optgroup>
        	</select>
		</div>


		<div className="discover-filter discover-year-filter">
          <label>year</label>
          <button
            type="button"
            className="discover-year-trigger"
            onClick={() => setIsYearPickerOpen((prev) => !prev)}
          >
            {year || 'any year'}
          </button>
		
		{isYearPickerOpen && (
            <div className="discover-year-panel">
              {openDecade === null ? (
                <>
                  <button className="discover-year-reset" onClick={handleClearYear}>
                    ✦ any year
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
                    ← back to decades
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
        {/* <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        /> */}

        {/* <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
          <option value="">Any Rating</option>
          <option value="9">9+</option>
          <option value="8">8+</option>
          <option value="7">7+</option>
          <option value="6">6+</option>
          <option value="5">5+</option>
        </select> */}

		<div className="discover-filter">
        	<select value={language} onChange={(e) => setLanguage(e.target.value)}>
          	<option value="">Any Language</option>
          	<option value="en">English</option>
          	<option value="fr">French</option>
          	<option value="es">Spanish</option>
          	<option value="ja">Japanese</option>
          	<option value="ko">Korean</option>
          	<option value="de">German</option>
          	<option value="it">Italian</option>
        	</select>
      	</div>
	</div>

      {loading && <p className="discover-status">Loading...</p>}
      {error && <p className="discover-status discover-error">Error: {error}</p>}

      {!loading && !error && movies.length === 0 && (<p className="discover-status">No movies found for these filters.</p>)}

      <div className="discover-grid">
  		{movies.map((movie) => (
   	 <img
      		key={movie.id}
      		className="discover-poster"
      		src={
        		movie.poster_path
          		? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          		: '../public/placeholder-poster.png'
      		}
      		alt={movie.title}
      		onClick={() => handleSearch(movie)}
    		/>
  		))}
	</div>
  {!loading && !error && exhaustedRef.current && movies.length > 0 && page >= Math.ceil(movieBufferRef.current.length / PAGE_SIZE) && (
  <p className="discover-status">
    fin des résultats disponibles pour ce tri ✦
  </p>
  )}
	<div className="discover-pagination">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        disabled={exhaustedRef.current && movieBufferRef.current.length <= page * PAGE_SIZE}
        onClick={() => setPage(page + 1)}
        >
        Next
      </button>
	</div>
</div>
  );
}

// export default function Discover() {
//     const [genreArray, setGenreArray] = useState<Genre[]>([]);
//     const navigate = useNavigate();
//     // const [id, setId] = useState('');
    
    // async function fetchGenres() {
    // const request = await fetch(`/api/genres`);
    
    // const data = await request.json();
    // console.log(data);
    // setGenreArray(data.genres);
    // }
    // useEffect(()=>{
    // fetchGenres()}, []);

//         function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>)
//         {
//             navigate(`/genres/${e.target.value.trim()}`);
//         }

//     return (
//         <div>
//             <label htmlFor="genres">Choose a genre:</label>
//             <select name="genres" onChange={handleSelectChange}>
//                 {genreArray.map(genre => <option key={genre.id} value={genre.id} >{genre.name}</option>)}

//             </select>
//             {/* <h2>POPO</h2> */}
//         </div>
//     )
// }