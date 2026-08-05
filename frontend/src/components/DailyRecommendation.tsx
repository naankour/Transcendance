import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/DailyRecommendation.css';

interface Recommendation {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	release_date: string;
}

function DailyPick() {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const [movie, setMovie] = useState<Recommendation | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		fetch(`/api/recommendation/current?lang=${i18n.language}`)
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Error');
				setMovie(data);
			})
			.catch(() => setMovie(null))
			.finally(() => setLoading(false));
	}, [i18n.language]);

	if (loading)
		return <p className="daily-pick-status">{t('home.loading')}</p>;

	if (!movie)
		return <p className="daily-pick-status">{t('home.noRecommendation')}</p>;

	return (
		<div className="daily-pick" onClick={() => navigate(`/movie/${movie.id}`)}>
			{movie.poster_path && (
				<img
					src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
					alt={movie.title}
					className="daily-pick-poster"
				/>
			)}
			<div className="daily-pick-info">
				<p className="daily-pick-title">
					{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
				</p>
				<p className="daily-pick-overview">{movie.overview}</p>
			</div>
		</div>
	);
}

export default DailyPick;