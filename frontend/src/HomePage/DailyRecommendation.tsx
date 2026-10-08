import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusMessage from '../components/StatusMessage';

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
		return <StatusMessage message={t('home.loading')} />;

	if (!movie)
		return <StatusMessage message={t('home.noRecommendation')} />;

	return (
		<div className="flex h-full min-h-0 flex-1 cursor-pointer gap-3" onClick={() => navigate(`/movie/${movie.id}`)}>
			{movie.poster_path && (
				<img
					src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
					alt={movie.title}
					className="h-[170px] w-[120px] shrink-0 self-start rounded-[5px] border border-[var(--color-accent-soft)] object-cover"
				/>
			)}
			<div className="flex min-w-0 flex-col gap-[6px] overflow-hidden">
				<p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold text-[var(--color-text)] hover:text-[var(--color-accent-soft)]">
					{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
				</p>
				<p className="line-clamp-6 overflow-hidden text-[14px] leading-[1.4] text-[var(--color-text-muted)] hover:text-[var(--color-accent-softer)]">{movie.overview}</p>
			</div>
		</div>
	);
}

export default DailyPick;