import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatusMessage from '../components/StatusMessage';

interface ReviewUser {
	id: number;
	username: string;
}

interface ReviewMovie {
	id: number;
	tmdb_id: number | null;
	title: string;
	poster: string | null;
}

interface Review {
	id: number;
	rating: number;
	content: string;
	created_at: string;
	users: ReviewUser;
	movies: ReviewMovie;
}

function LatestReviews() {
	const { t, i18n } = useTranslation();
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch('/api/reviews')
			.then(async (res) => {
				if (!res.ok)
					throw new Error();

				const data = await res.json();

				const latestReviews = data
					.sort(
						(a: Review, b: Review) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					)
					.slice(0, 7);

				setReviews(latestReviews);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <StatusMessage message={t('home.loading')} />;
	}

	if (error) {
		return <StatusMessage message={t('home.latestReviewsError')} />;
	}

	if (reviews.length === 0) {
		return <StatusMessage message={t('home.latestReviewsEmpty')} />;
	}

	return (
		<div className="flex flex-col">
			{reviews.map((review) => {
				const date = new Date(review.created_at).toLocaleDateString(i18n.language);

				const posterUrl = review.movies.poster
					? review.movies.poster.startsWith('http')
						? review.movies.poster
						: `https://image.tmdb.org/t/p/w200${review.movies.poster}`
					: null;

				const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

				return (
					<div key={review.id} className="flex items-center gap-3 border-b-2 border-dotted border-[var(--color-accent)] py-[10px] last:border-b-0">
						{review.movies.tmdb_id && posterUrl && (
							<Link to={`/movie/${review.movies.tmdb_id}`} className="shrink-0">
								<img src={posterUrl} alt={review.movies.title} className="block h-[87px] w-[58px] rounded border-[3px] border-[var(--color-bg)] object-cover outline outline-1 outline-[var(--color-accent-soft)] shadow-[0_0_0_1px_var(--color-bg),0_0_6px_var(--color-accent)]" />
							</Link>
						)}

						<div className="flex min-w-0 flex-col justify-center gap-[5px]">
							<div className="text-[17px] text-[var(--color-text)]">
								<Link to={`/profile/${review.users.id}`} className="font-semibold text-pink-50 hover:text-pink-200">
									{review.users.username}
								</Link>
								<span> {t('home.reviewed')} </span>
								{review.movies.tmdb_id ? (
									<Link to={`/movie/${review.movies.tmdb_id}`} className="font-semibold text-pink-50 hover:text-pink-200">
										{review.movies.title}
									</Link>
								) : (
									<span className="font-semibold text-pink-50">{review.movies.title}</span>
								)}
							</div>

							<p className="line-clamp-2 overflow-hidden text-[15px] leading-[1.4] text-[var(--color-text-muted)] before:mr-[3px] before:text-[var(--color-accent)] before:content-['“'] after:ml-[3px] after:text-[var(--color-accent)] after:content-['“']">{review.content}</p>

							<div className="text-[13px] text-[var(--color-text-muted)]">
								<span className="tracking-[1px] text-[var(--color-accent-soft)]">{stars}</span>
								<span>{review.rating}/5</span>
								<span>•</span>
								<span>{date}</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default LatestReviews;