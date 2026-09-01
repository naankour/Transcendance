import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LatestReviews.css';

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
		return (
			<p className="latest-reviews-status">
				{t('home.loading')}
			</p>
		);
	}

	if (error) {
		return (
			<p className="latest-reviews-status">
				{t('home.latestReviewsError')}
			</p>
		);
	}

	if (reviews.length === 0) {
		return (
			<p className="latest-reviews-status">
				{t('home.latestReviewsEmpty')}
			</p>
		);
	}

	return (
		<div className="latest-reviews">
			{reviews.map((review) => {
				const date = new Date(review.created_at).toLocaleDateString(i18n.language);

				const posterUrl = review.movies.poster
					? review.movies.poster.startsWith('http')
						? review.movies.poster
						: `https://image.tmdb.org/t/p/w200${review.movies.poster}`
					: null;

				return (
					<div key={review.id} className="latest-review-item">
						{review.movies.tmdb_id && posterUrl && (
							<Link
								to={`/movie/${review.movies.tmdb_id}`}
								className="latest-review-poster-link"
							>
								<img
									src={posterUrl}
									alt={review.movies.title}
									className="latest-review-poster"
								/>
							</Link>
						)}

						<div className="latest-review-content">
							<div className="latest-review-header">
								<Link
									to={`/profile/${review.users.id}`}
									className="latest-review-user"
								>
									<strong>{review.users.username}</strong>
								</Link>

								<span> {t('home.reviewed')} </span>

								{review.movies.tmdb_id ? (
									<Link
										to={`/movie/${review.movies.tmdb_id}`}
										className="latest-review-movie"
									>
										<strong>{review.movies.title}</strong>
									</Link>
								) : (
									<strong>{review.movies.title}</strong>
								)}
							</div>

							<p className="latest-review-text">
								{review.content}
							</p>

							<div className="latest-review-meta">
								<span>
									{t('home.rating')} : {review.rating}/5
								</span>

								<span> · {date}</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default LatestReviews;