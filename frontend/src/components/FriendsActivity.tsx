import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAvatarUrl } from '../utils/avatar.js';
import './FriendsActivity.css';

interface MovieRef {
	id: number;
	tmdb_id: number | null;
	title: string;
	poster: string | null;
}

interface UserRef {
	id: number;
	username: string;
	avatar_url: string | null;
}

interface ActivityItem {
	type: 'review' | 'watchlist' | 'favorite' | 'follow';
	created_at: string;
	movie?: MovieRef;
	user: UserRef;
	targetUser?: UserRef;
	rating?: number;
}

function FriendsActivity() {
	const { t, i18n } = useTranslation();
	const [feed, setFeed] = useState<ActivityItem[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [loggedOut, setLoggedOut] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			setLoggedOut(true);
			setLoading(false);
			return;
		}

		fetch('/api/activity/friends', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(async (res) => {
				const data = await res.json();

				if (!res.ok)
					throw new Error(data.error || 'Error');

				setFeed(data);
			})
			.catch(() => setFeed(null))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<p className="friends-activity-status">
				{t('home.loading')}
			</p>
		);
	}

	if (loggedOut) {
		return (
			<p className="friends-activity-status">
				{t('home.friendsActivityLoginPrompt')}
			</p>
		);
	}

	if (!feed) {
		return (
			<p className="friends-activity-status">
				{t('home.noRecommendation')}
			</p>
		);
	}

	if (feed.length === 0) {
		return (
			<p className="friends-activity-status">
				{t('home.friendsActivityEmpty')}
			</p>
		);
	}

	return (
		<div className="friends-activity">
			{feed.map((item, index) => {
				const date = new Date(item.created_at).toLocaleDateString(i18n.language);

				if (item.type === 'follow' && item.targetUser) {
					return (
						<div key={index} className="friends-activity-item">
							<Link to={`/profile/${item.user.id}`}>
								<img
									src={getAvatarUrl(item.user.avatar_url)}
									alt={item.user.username}
									className="friends-activity-avatar"
								/>
							</Link>

							<div className="friends-activity-content">
								<span className="friends-activity-line">
									<Link
										to={`/profile/${item.user.id}`}
										className="friends-activity-user"
									>
										<strong>{item.user.username}</strong>
									</Link>

									{' '}
									{t('home.activityFollow')}
									{' '}

									<Link
										to={`/profile/${item.targetUser.id}`}
										className="friends-activity-user"
									>
										<strong>{item.targetUser.username}</strong>
									</Link>
								</span>

								<span className="friends-activity-meta">
									{date}
								</span>
							</div>
						</div>
					);
				}

				let label = t('home.activityFavorites');

				if (item.type === 'review') {
					label = t('home.activityReviews');

					if (item.rating !== undefined && item.rating !== null)
						label += ` (${item.rating}/5)`;
				} else if (item.type === 'watchlist') {
					label = t('home.activityWatchlist');
				}

				return (
					<div key={index} className="friends-activity-item">
						<Link to={`/profile/${item.user.id}`}>
							<img
								src={getAvatarUrl(item.user.avatar_url)}
								alt={item.user.username}
								className="friends-activity-avatar"
							/>
						</Link>

						<div className="friends-activity-content">
							<span className="friends-activity-line">
								<Link
									to={`/profile/${item.user.id}`}
									className="friends-activity-user"
								>
									<strong>{item.user.username}</strong>
								</Link>

								{' — '}

								{item.movie?.tmdb_id ? (
									<Link
										to={`/movie/${item.movie.tmdb_id}`}
										className="friends-activity-movie"
									>
										<strong>{item.movie.title}</strong>
									</Link>
								) : (
									<strong>{item.movie?.title}</strong>
								)}
							</span>

							<span className="friends-activity-meta">
								{label} · {date}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default FriendsActivity;