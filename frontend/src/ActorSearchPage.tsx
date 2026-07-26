import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ActorResult {
	id: number;
	name: string;
	profile_path: string | null;
}

function ActorSearchPage() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<ActorResult[]>([]);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSearch = () => {
	if (!query.trim()) return;

	setError(null);

	fetch(`/api/actors/search/${encodeURIComponent(query.trim())}`)
		.then(async (res) => {
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Erreur');
		setResults(data);
		})
		.catch((err) => {
		setError(err.message);
		setResults([]);
		});
	};

	return (
	<div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
		<h1>Recherche d'acteur</h1>
		<input
		type="text"
		value={query}
		onChange={(e) => setQuery(e.target.value)}
		onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
		placeholder="Nom de l'acteur (ex: Tom Hanks)..."
		style={{ padding: 8, width: '70%', fontSize: 16 }}
		/>
		<button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: 16, marginLeft: 8 }}>
		Rechercher
		</button>

		{error && <p style={{ color: 'red' }}>{error}</p>}

		<div style={{ marginTop: 20 }}>
		{results.map((actor) => (
			<div
			key={actor.id}
			onClick={() => navigate(`/actor/${actor.id}`)}
			style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #ddd' }}
			>
			{actor.name}
			</div>
		))}
		</div>
	</div>
	);
}

export default ActorSearchPage;
