import {useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
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
	const [genre, setGenre] = useState('');
	const [year, setYear] = useState('');
	const [sort, setSort] = useState('');
//	 const [minRating, setMinRating] = useState('');
	const [language, setLanguage] = useState('');
	const [movies, setMovies] = useState<Movie[]>([]);
	const [genreArray, setGenreArray] = useState<Genre[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  	const [openDecade, setOpenDecade] = useState<number | null>(null);

	const requestIdRef = useRef(0);

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
      const params = new URLSearchParams();
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);
      if (sort) params.append('sort_by', sort);
    //   if (minRating) params.append('min_rating', minRating);
      if (language) params.append('language', language);
      params.append('page', page.toString());

      const request = await fetch(`/api/discover?${params.toString()}`);

      if (!request.ok) {
        throw new Error(`Erreur ${request.status}`);
      }

      const data = await request.json();

	  if (currentRequestId !== requestIdRef.current)
		return;

      const uniqueMovies = Array.from(
  	new Map<number, Movie>((data.results || []).map((m: Movie) => [m.id, m])).values()
	);
		setMovies(uniqueMovies);
		setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (err: any) {
		if (currentRequestId !== requestIdRef.current)
			return;
      console.error(err);
      setError(err.message || 'An Error occured');
      setMovies([]);
    } finally {
		if (currentRequestId === requestIdRef.current)
      		setLoading(false);
    }
  }

  useEffect(() => {
    fetchGenres();
  }, []);

  // remet la pagination à 1 dès qu'un filtre change, pour éviter de
  // rester bloqué sur une page qui n'existe plus pour les nouveaux critères
  useEffect(() => {
    setPage(1);
  }, [genre, year, sort, language]);

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

	<div className="discover-pagination">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
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