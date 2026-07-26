import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: number;
  name: string;
}

export default function Genres() {
    const [genreArray, setGenreArray] = useState<Genre[]>([]);
    const navigate = useNavigate();
    // const [id, setId] = useState('');
    
    async function fetchGenres() {
    const request = await fetch(`/api/genres`);
    
    const data = await request.json();
    console.log(data);
    setGenreArray(data.genres);
    }
    useEffect(()=>{
    fetchGenres()}, []);
        // navigate(`/movie/${id.trim()}`);

        function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>)
        {
            navigate(`/genres/${e.target.value.trim()}`);
        }

    return (
        <div>
            <label htmlFor="genres">Choose a genre:</label>
            <select name="genres" onChange={handleSelectChange}>
                {genreArray.map(genre => <option key={genre.id} value={genre.id} >{genre.name}</option>)}

            </select>
            {/* <h2>POPO</h2> */}
        </div>
    )
}