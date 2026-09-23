import {useState, useEffect} from 'react'
import { useParams} from 'react-router-dom';

interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

export default function GenreMovies() {
    const {id} = useParams();
    const [movies, setMovies] = useState<Movie[]>([]);
    async function  fetchMovies() {
        const request = await fetch(`/api/genres/${id}`);

        const data = await request.json();
        setMovies(data.results);
    }

    useEffect(() => {
        fetchMovies();
    },[id]);

    return (<div>
        {movies.slice(0, 10).map(movie => (
            <img key={movie.id}
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        />))}
    </div>
        
    )
}
