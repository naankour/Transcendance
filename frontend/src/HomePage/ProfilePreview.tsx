import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarLink from '../components/AvatarLink';
import StatusMessage from '../components/StatusMessage';
import HelloKitty from '../assets/sticker-hello-kitty.png';

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
		return <StatusMessage message={t('home.loading')} />;
	}

	if (loggedOut) {
		return (
			<div className="flex flex-col gap-[10px] pt-[10px]">
				<div className="flex flex-col gap-[10px] text-[var(--color-text-muted)]">
					<p>{t('home.aboutMeLoginPrompt')}</p>
					<Link to="/auth" className="w-fit text-[15px] font-semibold uppercase text-[var(--color-accent-soft)] transition hover:text-[var(--color-text)]">
						{t('home.login')} →
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-end pb-[15px]">
					<img src={HelloKitty} alt="hello" className="w-[130px] rotate-[-6deg]" />
				</div>
			</div>
		);
	}

	if (!user) {
		return <StatusMessage message={t('errors.generic')} />;
	}

	const memberSince = formatMemberSince(user.created_at, t('home.dateLocale', { defaultValue: 'en-US' }));

	return (
		<div className="flex h-full flex-col px-0 py-[5px]">
			<div className="flex items-start gap-[15px]">
				<AvatarLink
					userId={user.id}
					avatarUrl={user.avatar_url}
					username={user.username}
					size="lg"
				/>

				<div className="flex min-w-0 flex-col gap-[6px]">
					<Link to="/profile" className="text-[18px] text-[var(--color-text)] hover:text-[var(--color-accent-soft)]">
						{user.username}
					</Link>

					<p className="line-clamp-3 overflow-hidden text-[14px] leading-[1.4] text-[var(--color-text-muted)]">
						{user.bio || t('home.noBio')}
					</p>

					<Link to="/profile" className="w-fit text-[15px] font-semibold uppercase text-[var(--color-accent-soft)] transition hover:text-[var(--color-text)]">
						{t('home.viewProfile')} →
					</Link>
				</div>
			</div>

			<div className="mt-[10px] flex items-center justify-between gap-[50px] border-t border-dashed border-[var(--color-accent)]">
				{memberSince && (
					<span className="text-[12px] uppercase text-[var(--color-text-muted)]">
						{t('home.memberSince', { date: memberSince })}
					</span>
				)}
				<img src={HelloKitty} alt="hello" className="w-[90px] rotate-[-6deg]" />
			</div>
		</div>
	);
}

export default ProfilePreview;