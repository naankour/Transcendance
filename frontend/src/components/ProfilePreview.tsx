import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAvatarUrl } from '../utils/avatar.js';
import './ProfilePreview.css';

interface UserProfile {
	id: number;
	username: string;
	avatar_url: string | null;
	bio: string | null;
}

function ProfilePreview() {
	const { t } = useTranslation();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [loggedOut, setLoggedOut] = useState(false);

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
			<div className="profile-preview-status">
				<p>{t('home.aboutMeLoginPrompt')}</p>

				<Link to="/auth" className="profile-preview-link">
					{t('home.login')}
				</Link>
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

	return (
		<div className="profile-preview">
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
	);
}

export default ProfilePreview;