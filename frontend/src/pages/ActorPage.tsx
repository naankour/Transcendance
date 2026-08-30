import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import defaultActor from '../assets/default-actor.png';
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

				if (!res.ok)
					throw new Error(data.error || 'Error');

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
					<div className="actor-photo-frame">
						<img
							src={
								actor.profile_path
									? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
									: defaultActor
							}
							alt={actor.name}
							className="actor-photo"
						/>
						<span className="actor-photo-caption">✦ CINEMA ✦</span>
					</div>

					<div className="actor-info">
						<h2>{actor.name}</h2>

						{actor.birthday && (
							<p className="actor-birthday">
								♥ <strong>{t('actorPage.born')}</strong> {actor.birthday}
							</p>
						)}

						<div className="actor-biography-box">
							<p className="actor-biography">
								{actor.biography || t('actorPage.noBiography')}

								{actor.biographyIsFallback && (
									<span className="biography-fallback-notice">
										{' '}
										{t('actorPage.biographyFallbackNotice')}
									</span>
								)}
							</p>
						</div>
					</div>

					<div className="filmography-section">
						<h3 className="filmography-title">
							 {t('actorPage.filmography')} 
						</h3>

						<div className="filmography-list">
							{actor.filmography.slice(0, 15).map((movie, index) => (
								<Link
									key={`${movie.id}-${movie.role}-${index}`}
									to={`/movie/${movie.id}`}
									className="filmography-link"
								>
									<span className="filmography-name">
										{movie.title}
									</span>

									<span className="filmography-details">
										{movie.release_date && movie.release_date.slice(0, 4)}
										{movie.release_date && ' · '}
										{movie.role}
									</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ActorPage;