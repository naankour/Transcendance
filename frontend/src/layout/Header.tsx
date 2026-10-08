import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { disconnectSocket } from '../../socket';
import { setUnreadCount } from '../notification';

interface MovieResult {
	id: number;
	title: string;
	release_date: string;
	poster_path: string | null;
}

interface PersonResult {
	id: number;
	name: string;
	profile_path: string | null;
}

interface UserResult {
	id: number;
	username: string;
	avatar_url: string | null;
}

function isTokenValid(token: string | null): boolean {
	if (!token) {
		return false;
	}

	const parts = token.split('.');
	if (parts.length !== 3) {
		return false;
	}

	try {
		const payload = JSON.parse(atob(parts[1]));
		if (!payload.exp) {
			return true;
		}
		return payload.exp * 1000 > Date.now();
	} catch {
		return false;
	}
}

let fetchPatched = false;

function patchFetchOnce() {
	if (fetchPatched) {
		return;
	}
	fetchPatched = true;

	const originalFetch = window.fetch;

	window.fetch = async (...args: Parameters<typeof fetch>) => {
		const response = await originalFetch(...args);

		if (response.status === 401 || response.status === 403) {
			if (localStorage.getItem('token')) {
				localStorage.removeItem('token');
				disconnectSocket();
				setUnreadCount(0);
				window.dispatchEvent(new Event('auth:expired'));
			}
		}

		return response;
	};
}

function Header() {
	const { t, i18n } = useTranslation();
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState<MovieResult[]>([]);
	const [people, setPeople] = useState<PersonResult[]>([]);
	const [users, setUsers] = useState<UserResult[]>([]);
	const [showResults, setShowResults] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const containerRef = useRef<HTMLDivElement>(null);

	const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid(localStorage.getItem('token')));

	useEffect(() => {
		patchFetchOnce();

		const handleAuthExpired = () => {
			setIsLoggedIn(false);
		};

		window.addEventListener('auth:expired', handleAuthExpired);
		return () => window.removeEventListener('auth:expired', handleAuthExpired);
	}, []);

	useEffect(() => {
		setIsLoggedIn(isTokenValid(localStorage.getItem('token')));
	}, [location.pathname]);

	useEffect(() => {
		const trimmed = query.trim();

		if (trimmed.length < 2) {
			setMovies([]);
			setPeople([]);
			setUsers([]);
			setShowResults(false);
			return;
		}

		const timeoutId = setTimeout(() => {
			fetch(`/api/search/${encodeURIComponent(trimmed)}?lang=${i18n.language}`)
				.then(async (res) => {
					const data = await res.json();
					if (!res.ok) throw new Error(data.error || 'Error');
					setMovies(data.movies || []);
					setPeople(data.people || []);
					setUsers(data.users || []);
					setShowResults(true);
				})
				.catch(() => {
					setMovies([]);
					setPeople([]);
					setUsers([]);
				});
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query, i18n.language]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowResults(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelectMovie = (id: number) => {
		setQuery('');
		setShowResults(false);
		navigate(`/movie/${id}`);
	};

	const handleSelectPerson = (id: number) => {
		setQuery('');
		setShowResults(false);
		navigate(`/actor/${id}`);
	};

	const handleSelectUser = (id: number) => {
		setQuery('');
		setShowResults(false);
		navigate(`/profile/${id}`);
	};

	const handleFullSearch = () => {
		const trimmed = query.trim();
		if (!trimmed) return;
		setShowResults(false);
		navigate(`/search/${encodeURIComponent(trimmed)}`);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		disconnectSocket();
		setUnreadCount(0);
		window.dispatchEvent(new Event('auth:expired'));
		setIsLoggedIn(false);
		navigate('/');
	};

	const hasResults = movies.length > 0 || people.length > 0 || users.length > 0;

	return (
		<header className="relative z-[100] flex w-full flex-col">
			<div className="sticky top-0 z-[100] box-border flex w-full items-center justify-between bg-[var(--color-bg)] p-5 max-[700px]:flex-wrap max-[700px]:justify-center max-[700px]:gap-[14px] max-[500px]:gap-3 max-[500px]:p-[6px_8px]">
				<Link to="/" className="order-1 inline-flex items-center gap-2 font-logo text-[42px] font-normal no-underline transition hover:rotate-[-2deg] hover:scale-[1.04] max-[900px]:text-[36px] max-[500px]:text-[30px] max-[360px]:text-[27px]">
					<span className="text-[32px] text-[var(--color-accent-soft)] [text-shadow:0_0_12px_var(--color-accent-soft),0_0_24px_var(--color-accent)] [animation:star-twinkle_2.5s_ease-in-out_infinite] max-[900px]:text-[26px] max-[500px]:text-[21px]">★</span>
					<span className="text-[var(--color-accent-soft)] [text-shadow:0_0_8px_rgba(255,159,209,0.5)]">Letter</span>
					<span className="text-[var(--color-accent)] [text-shadow:0_0_8px_var(--color-accent),0_0_18px_var(--color-accent),0_2px_0_rgba(0,0,0,0.5)]">Blog</span>
					<span className="text-[32px] text-[var(--color-accent-soft)] [text-shadow:0_0_12px_var(--color-accent-soft),0_0_24px_var(--color-accent)] [animation:star-twinkle_2.5s_ease-in-out_infinite] [animation-delay:1.2s] max-[900px]:text-[26px] max-[500px]:text-[21px]">★</span>
				</Link>

				<div className="order-2 flex h-10 items-center gap-5 max-[900px]:gap-[15px] max-[700px]:justify-center max-[700px]:gap-[10px] max-[500px]:gap-2">
					<LanguageSwitcher />

					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="flex h-[50px] items-center justify-center whitespace-nowrap rounded-[20px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-surface-alt)] px-4 py-[6px] text-[13px] font-bold text-[var(--color-text-muted)] no-underline transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:shadow-[0_0_8px_var(--color-accent)] max-[500px]:px-3"
						>
							{t('header.logout')}
						</button>
					) : (
						<Link
							to="/auth"
							className="flex h-[50px] items-center justify-center whitespace-nowrap rounded-[20px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-surface-alt)] px-4 py-[6px] text-[13px] font-bold text-[var(--color-text-muted)] no-underline transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:shadow-[0_0_8px_var(--color-accent)] max-[500px]:px-3"
						>
							{t('header.login')}
						</Link>
					)}
				</div>

				<div ref={containerRef} className="relative order-1 z-[1000] h-10 w-[350px] max-[900px]:w-[280px] max-[700px]:order-3 max-[700px]:mx-auto max-[700px]:w-[min(350px,100%)] max-[500px]:w-full">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleFullSearch()}
						onFocus={() => {
							if (hasResults)
								setShowResults(true);
						}}
						placeholder={t('header.searchPlaceholder')}
						className="box-border h-[50px] w-full rounded-[20px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-surface-alt)] px-3 py-2 text-[14px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:shadow-[0_0_8px_var(--color-accent)]"
					/>

					{showResults && hasResults && (
						<div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[1001] max-h-[420px] overflow-y-auto rounded-[12px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-surface)] p-[10px] shadow-[0_0_10px_var(--color-accent)]">
							{movies.length > 0 && (
								<div className="mb-2">
									<p className="my-1 text-[12px] uppercase text-[var(--color-accent-soft)]">{t('header.movies')}</p>
									{movies.map((movie) => (
										<div
											key={movie.id}
											onClick={() => handleSelectMovie(movie.id)}
											className="flex cursor-pointer items-center gap-2 rounded-[6px] px-1 py-[6px] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)]"
										>
											{movie.poster_path && (
												<img
													src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
													alt={movie.title}
													className="h-[45px] w-[30px] rounded object-cover"
												/>
											)}
											<span>{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}</span>
										</div>
									))}
								</div>
							)}

							{people.length > 0 && (
								<div className="mb-2">
									<p className="my-1 text-[12px] uppercase text-[var(--color-accent-soft)]">{t('header.actorsDirectors')}</p>
									{people.map((person) => (
										<div
											key={person.id}
											onClick={() => handleSelectPerson(person.id)}
											className="flex cursor-pointer items-center gap-2 rounded-[6px] px-1 py-[6px] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)]"
										>
											{person.profile_path && (
												<img
													src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
													alt={person.name}
													className="h-[30px] w-[30px] rounded-full object-cover"
												/>
											)}
											<span>{person.name}</span>
										</div>
									))}
								</div>
							)}

							{users.length > 0 && (
								<div className="px-0 py-2">
									<p className="my-1 text-[12px] uppercase text-[var(--color-accent-soft)]">{t('header.users')}</p>
									{users.map((user) => (
										<div
											key={user.id}
											onClick={() => handleSelectUser(user.id)}
											className="flex cursor-pointer items-center gap-2 rounded-[6px] px-1 py-[6px] text-[var(--color-text)] transition hover:bg-[var(--color-surface-alt)]"
										>
											{user.avatar_url && (
												<img
													src={user.avatar_url}
													alt={user.username}
													className="h-[30px] w-[30px] rounded-full object-cover"
												/>
											)}
											<span>{user.username}</span>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<nav className="mx-[5px] my-[5px] flex flex-wrap justify-evenly items-center gap-1 rounded-[16px] bg-[var(--color-accent)] px-[15px] py-[10px] shadow-[inset_0_12px_20px_-8px_rgba(255,255,255,0.9),inset_0_-12px_20px_-8px_rgba(0,0,0,0.75),0_8px_20px_rgba(0,0,0,0.6)] max-[500px]:justify-center max-[500px]:gap-0 max-[500px]:p-[6px]" aria-label={t('header.navLabel')}>
				<NavLink
					to="/discover"
					end
					className={({ isActive }) => [
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] text-[#1a0a12] no-underline transition hover:scale-110 hover:text-[var(--color-text)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] !text-[#1a0a12] no-underline transition hover:scale-110 hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						isActive ? 'underline decoration-2 underline-offset-[6px]' : '',
					].join(' ')}
				>
					<span className="font-nav !text-[#1a0a12] hover:!text-white">{t('header.navMovies')}</span>
				</NavLink>
				<NavLink
					to={isLoggedIn ? '/reviews/me' : '/reviews'}
					className={({ isActive }) => [
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] text-[#1a0a12] no-underline transition hover:scale-110 hover:text-[var(--color-text)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] !text-[#1a0a12] no-underline transition hover:scale-110 hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						isActive ? 'underline decoration-2 underline-offset-[6px]' : '',
					].join(' ')}
				>
					<span className="font-nav !text-[#1a0a12] hover:!text-white">{t('header.navReviews')}</span>
				</NavLink>
				<NavLink
					to="/watchlist"
					className={({ isActive }) => [
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] text-[#1a0a12] no-underline transition hover:scale-110 hover:text-[var(--color-text)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] !text-[#1a0a12] no-underline transition hover:scale-110 hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						isActive ? 'underline decoration-2 underline-offset-[6px]' : '',
					].join(' ')}
				>
					<span className="font-nav !text-[#1a0a12] hover:!text-white">{t('header.navWatchlist')}</span>
				</NavLink>
				<NavLink
					to="/favorites"
					className={({ isActive }) => [
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] text-[#1a0a12] no-underline transition hover:scale-110 hover:text-[var(--color-text)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						'font-[var(--font-display)] px-[14px] py-1 text-[21px] !text-[#1a0a12] no-underline transition hover:scale-110 hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						isActive ? 'underline decoration-2 underline-offset-[6px]' : '',
					].join(' ')}
				>
					<span className="font-nav !text-[#1a0a12] hover:!text-white">{t('header.navFavorites')}</span>
				</NavLink>
				<NavLink
					to="/profile"
					className={({ isActive }) => [
						'px-[14px] py-1 text-[21px] text-[#1a0a12] no-underline transition hover:scale-110 hover:text-[var(--color-text)] hover:[text-shadow:0_0_8px_rgba(255,255,255,0.8)] after:ml-[18px] after:text-[12px] after:opacity-50 after:content-["★"] hover:after:text-white hover:after:opacity-100 max-[900px]:px-[10px] max-[900px]:text-[18px] max-[700px]:px-[7px] max-[700px]:text-[16px] max-[500px]:px-[6px] max-[500px]:text-[15px] max-[500px]:after:content-none max-[360px]:px-1 max-[360px]:text-[13px]',
						isActive ? 'underline decoration-2 underline-offset-[6px]' : '',
					].join(' ')}
				>
					<span className="font-nav !text-[#1a0a12] hover:!text-white">{t('header.navProfile')}</span>
				</NavLink>
			</nav>
		</header>
	);
}

export default Header;