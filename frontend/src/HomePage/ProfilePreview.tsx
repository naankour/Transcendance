import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAvatarUrl } from '../utils/avatar.js';
import HelloKitty from '../assets/sticker-hello-kitty.png';
import './ProfilePreview.css';

interface UserProfile {
	id: number;
	username: string;
	avatar_url: string | null;
	bio: string | null;
	created_at: string | null;
}

function formatMemberSince(dateString: string | null, locale: string): string | null {
	if (!dateString)
		return null;
 
	const date = new Date(dateString);
 
	if (Number.isNaN(date.getTime()))
		return null;
 
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
	});
}

function ProfilePreview() {
	const { t } = useTranslation();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [loggedOut, setLoggedOut] = useState(false);

	useEffect(() => {
		const handleAuthExpired = () => {
			setUser(null);
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

		fetch('/api/users/me', {
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

				setUser(data);
			})
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<p className="profile-preview-status">
				{t('home.loading')}
			</p>
		);
	}

	if (loggedOut) {
		return (
			<div className="profile-preview">
				<div className="profile-preview-status">
					<p>{t('home.aboutMeLoginPrompt')}</p>
	
					<Link to="/auth" className="profile-preview-link">
						{t('home.login')} →
					</Link>
				</div>
	
				<div className="profile-preview-sticker-area">
					<img
						src={HelloKitty}
						alt="hello"
						className="profile-preview-sticker"
					/>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<p className="profile-preview-status">
				{t('errors.generic')}
			</p>
		);
	}

	const memberSince = formatMemberSince(user.created_at, t('home.dateLocale', { defaultValue: 'en-US' }));

	return (
		<div className="profile-preview">
			<div className="profile-preview-main">
				<Link to="/profile">
					<img
						src={getAvatarUrl(user.avatar_url)}
						alt={user.username}
						className="profile-preview-avatar"
					/>
				</Link>
 
				<div className="profile-preview-content">
					<Link to="/profile" className="profile-preview-username">
						<strong>{user.username}</strong>
					</Link>
 
					<p className="profile-preview-bio">
						{user.bio || t('home.noBio')}
					</p>
 
					<Link to="/profile" className="profile-preview-link">
						{t('home.viewProfile')} →
					</Link>
				</div>
			</div>
 
			<div className="profile-preview-footer">
				{memberSince && (
					<span className="profile-preview-meta">
						{t('home.memberSince', { date: memberSince })}
					</span>
				)}
				<img src={HelloKitty} alt="hello" className="profile-preview-sticker" />
			</div>
		</div>
	);
}

export default ProfilePreview;