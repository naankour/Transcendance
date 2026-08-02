import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/ActorPage.css';

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
	biographyIsFallback: boolean;
	profile_path: string | null;
	birthday: string | null;
	filmography: FilmographyEntry[];
}

function ActorPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [actor, setActor] = useState<Actor | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	setLoading(true);
	setError(null);
	setActor(null);

	fetch(`/api/actors/${id}?lang=${i18n.language}`)
		.then(async (res) => {
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Error');
		setActor(data);
		})
		.catch((err) => setError(err.message))
		.finally(() => setLoading(false));
	}, [id, i18n.language]);

	return (
	<div className="actor-page">
		<button onClick={() => navigate(-1)} className="back-button">
		{t('actorPage.back')}
		</button>

		{loading && <p>{t('actorPage.loading')}</p>}
		{error && <p className="error-text">{error}</p>}

		{actor && (
		<div className="actor-content">
			{actor.profile_path && (
			<img
				src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
				alt={actor.name}
				className="actor-photo"
			/>
			)}
			<h2>{actor.name}</h2>
			{actor.birthday && <p><strong>{t('actorPage.born')}</strong> {actor.birthday}</p>}
			<p>
				{actor.biography || t('actorPage.noBiography')}
				{actor.biographyIsFallback && (
					<span className="biography-fallback-notice"> {t('actorPage.biographyFallbackNotice')}</span>
				)}
			</p>

			<h3 className="filmography-title">{t('actorPage.filmography')}</h3>
			<p>
			{actor.filmography.slice(0, 15).map((movie, index) => (
				<span key={`${movie.id}-${movie.role}-${index}`}>
					<Link to={`/movie/${movie.id}`} className="filmography-link">
						{movie.title}
						{movie.release_date ? ` (${movie.release_date.slice(0, 4)})` : ''}
						{` — ${movie.role}`}
					</Link>
					{index < actor.filmography.slice(0, 15).length - 1 ? ', ' : ''}
				</span>
			))}
			</p>
		</div>
		)}
	</div>
	);
}

export default ActorPage;