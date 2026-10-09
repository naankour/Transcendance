import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarLink from '../components/AvatarLink';
import StatusMessage from '../components/StatusMessage';
import StickerInsect from '../assets/sticker-insect.png';
import StickerArrow from '../assets/sticker-arrow.png';

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
		const handleAuthExpired = () => {
			setFeed(null);
			setLoggedOut(true);
		};

		window.addEventListener('auth:expired', handleAuthExpired);
		return () => window.removeEventListener('auth:expired', handleAuthExpired);
	}, []);

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

				if (res.status === 401 || res.status === 403) {
					setLoggedOut(true);
					return;
				}

				if (!res.ok)
					throw new Error(data.error || 'Error');

				setFeed(data);
			})
			.catch(() => setFeed(null))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <StatusMessage message={t('home.loading')} />;
	}

	if (loggedOut) {
		return (
			<div className="flex min-h-0 flex-1 flex-col gap-[10px] pt-[10px]">
				<p className="text-[var(--color-text-muted)]">{t('home.friendsActivityLoginPrompt')}</p>
				<Link to="/auth" className="w-fit text-[15px] font-semibold uppercase text-[var(--color-accent-soft)] transition hover:text-[var(--color-text)]">
					{t('home.login')} →
				</Link>
				<div className="flex justify-start pl-[60px]">
					<img src={StickerArrow} alt="Arrow" className="h-10" />
				</div>
				<div className="mt-auto">
					<img src={StickerInsect} alt="Insect" className="h-[130px] w-full object-contain max-[750px]:h-20" />
				</div>
			</div>
		);
	}

	if (!feed) {
		return <StatusMessage message={t('errors.generic')} />;
	}

	if (feed.length === 0) {
		return <StatusMessage message={t('home.friendsActivityEmpty')} />;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{feed.slice(0, 6).map((item, index) => {
				const date = new Date(item.created_at).toLocaleDateString(i18n.language);

				if (item.type === 'follow' && item.targetUser) {
					return (
						<div key={index} className="flex gap-[10px] border-b-2 border-dotted border-[var(--color-accent)] py-[7px]">
							<AvatarLink
								userId={item.user.id}
								avatarUrl={item.user.avatar_url}
								username={item.user.username}
								className="shrink-0"
							/>

							<div className="flex flex-col text-[var(--color-text)]">
								<span className="text-[18px]">
									<Link to={`/profile/${item.user.id}`} className="font-semibold text-pink-100 hover:text-pink-200">
										{item.user.username}
									</Link>
									{' '}
									{t('home.activityFollow')}
									{' '}
									<Link to={`/profile/${item.targetUser.id}`} className="font-semibold text-pink-100 hover:text-pink-200">
										{item.targetUser.username}
									</Link>
								</span>
								<p className="text-[13px] text-[var(--color-text-muted)]">{date}</p>
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
					<div key={index} className="flex gap-[10px] border-b-2 border-dotted border-[var(--color-accent)] py-[7px]">
						<AvatarLink
							userId={item.user.id}
							avatarUrl={item.user.avatar_url}
							username={item.user.username}
							className="shrink-0"
						/>

						<div className="flex flex-col text-[var(--color-text)]">
							<span className="text-[18px]">
								<Link to={`/profile/${item.user.id}`} className="font-semibold text-pink-100 hover:text-pink-200">
									{item.user.username}
								</Link>
								{' — '}
								{item.movie?.tmdb_id ? (
									<Link to={`/movie/${item.movie.tmdb_id}`} className="font-semibold text-pink-100 hover:text-pink-200">
										{item.movie.title}
									</Link>
								) : (
									<span className="font-semibold text-pink-100">{item.movie?.title}</span>
								)}
							</span>
							<p className="text-[13px] text-[var(--color-text-muted)]">{label} · {date}</p>
						</div>
					</div>
				);
			})}
			<div className="flex flex-1 flex-col justify-between pt-[10px]">
				<div>
					<Link to="/reviews" className="text-[15px] font-semibold uppercase text-[var(--color-accent-soft)] transition hover:text-[var(--color-text)]">
						{t('home.seeAllReviews')} →
					</Link>
				</div>
				<div className="mt-auto">
					<img src={StickerInsect} alt="Insect" className="h-[130px] w-full object-contain [animation:moving-sticker_2s_ease-in-out_infinite] max-[750px]:h-20" />
				</div>
			</div>
		</div>
	);
}

export default FriendsActivity;