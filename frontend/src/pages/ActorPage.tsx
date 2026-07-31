import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface FilmographyEntry {
	id: number;
	title: string;
	role: 'Actor' | 'Director';
	detail: string | null;
	release_date: string;
}

interface Actor {
	id: number;
	name: string;
	biography: string;
	profile_path: string | null;
	birthday: string | null;
	filmography: FilmographyEntry[];
}

function ActorPage() {
	const { id } = useParams();
	const [actor, setActor] = useState<Actor | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	setLoading(true);
	setError(null);
	setActor(null);

	fetch(`/api/actors/${id}`)
		.then(async (res) => {
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Error');
		setActor(data);
		})
		.catch((err) => setError(err.message))
		.finally(() => setLoading(false));
	}, [id]);

	return (
	<div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
		<Link to="/actors">← Back to search</Link>

		{loading && <p>Loading...</p>}
		{error && <p style={{ color: 'red' }}>{error}</p>}

		{actor && (
		<div style={{ marginTop: 20 }}>
			{actor.profile_path && (
			<img
				src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
				alt={actor.name}
				style={{ maxWidth: 150, float: 'left', marginRight: 15 }}
			/>
			)}
			<h2>{actor.name}</h2>
			{actor.birthday && <p><strong>Born:</strong> {actor.birthday}</p>}
			<p>{actor.biography || 'Pas de biographie disponible.'}</p>

			<h3 style={{ clear: 'both' }}>Filmography</h3>
			<ul>
			{actor.filmography.slice(0, 15).map((movie, index) => (
			<li key={`${movie.id}-${movie.role}-${index}`}>
				{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
				{' — '}
				{movie.role}
				{movie.detail ? ` (${movie.detail})` : ''}
			</li>
			))}
			</ul>
		</div>
		)}
	</div>
	);
}

export default ActorPage;
