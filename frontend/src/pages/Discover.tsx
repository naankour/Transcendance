import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

export default function Discover() {
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [sort, setSort] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genreArray, setGenreArray] = useState<Genre[]>([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    // const sortArray = ["Popularity", "Highest First", "Lowest First", "Year", "Newest First", "Earliest First"];

    const handleSearch = (movies: Movie) => {
        navigate(`/movie/${movies.id}`);
    };

    async function fetchGenres() {
        const request = await fetch(`/api/discover/genres`);

        const data = await request.json();
        // console.log(data.genres);
        setGenreArray(data.genres);
    }

    async function fetchMovies() {

        const params = new URLSearchParams();
 
        if (genre)
            params.append("genre", genre);

        if (year)
            params.append("year", year);

        if (sort)
            params.append("sort_by", sort);

        params.append("page", page.toString());
        const request = await fetch(`/api/discover?${params.toString()}`);
        
        const data = await request.json();
        setMovies(data.results);
    }

    useEffect(() => {fetchGenres()}, []);

    useEffect(() => {fetchMovies()}, [genre, year, sort, page]);
    
    return (
        <div>
            <div>
                <label htmlFor="genres">Choose a genre:</label>
                
                <select name="genres" onChange={(e) => setGenre(e.target.value)}>
                    <option value="">Any Genre</option>
                    {genreArray.map(genre => <option key={genre.id} value={genre.id} >{genre.name}</option>)}
                </select>

                <select onChange={(e) => setSort(e.target.value)}>
                    <option value="">Neutral Sort</option>
                    <optgroup label="Popularity">
                        <option value="popularity.desc"> Highest First</option>
                        <option value="popularity.asc">Lowest First</option>
                    </optgroup>

                    <optgroup label="Release Date">
                         <option value="primary_release_date.desc">Newest First</option>
                         <option value="primary_release_date.asc">Earliest First</option>
                    </optgroup>
                </select>

                <input type="number"
                onChange={(e) => setYear(e.target.value)} />

            </div>
            <div>
            {movies
            .filter(movie => movie.poster_path)
            .map(movie => (
                <img 
                    key={movie.id}
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    onClick={() => handleSearch(movie)}
                    style={{ cursor: 'pointer', padding: 3}}
                    />

                )) }
            </div>
            <button
             disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Précédent
            </button>

            <span>{page}</span>

            <button onClick={() => setPage(page + 1)}>
                Suivant
            </button>
        </div>
    )
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