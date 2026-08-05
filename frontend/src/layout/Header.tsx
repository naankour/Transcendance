import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Header.css';


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

	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

	useEffect(() => {
		setIsLoggedIn(!!localStorage.getItem('token'));
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
	}, [query]);

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
		setIsLoggedIn(false);
		navigate('/');
	};

	const hasResults = movies.length > 0 || people.length > 0 || users.length > 0;

	return (
		<header className="header">
			<div className="header-content">
				<Link to="/" className="header-logo">
					<span className="header-logo-star">★</span>
					<span className="header-logo-letter">Letter</span><span className="header-logo-blog">Blog</span>
					<span className="header-logo-star">★</span>
				</Link>

				<div className="research-and-language-switcher">
					<div ref={containerRef} className="search-container">
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
							className="search-input"
						/>

						{showResults && hasResults && (
							<div className="search-results">
								{movies.length > 0 && (
									<div className="search-section">
										<p className="search-section-title">{t('header.movies')}</p>
										{movies.map((movie) => (
											<div
												key={movie.id}
												onClick={() => handleSelectMovie(movie.id)}
												className="search-result-item"
											>
												{movie.poster_path && (
													<img
														src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
														alt={movie.title}
														className="search-result-poster"
													/>
												)}
												<span>{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}</span>
											</div>
										))}
									</div>
								)}

								{people.length > 0 && (
									<div className="search-section">
										<p className="search-section-title">{t('header.actorsDirectors')}</p>
										{people.map((person) => (
											<div
												key={person.id}
												onClick={() => handleSelectPerson(person.id)}
												className="search-result-item"
											>
												{person.profile_path && (
													<img
														src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
														alt={person.name}
														className="search-result-avatar"
													/>
												)}
												<span>{person.name}</span>
											</div>
										))}
									</div>
								)}

								{users.length > 0 && (
									<div className="search-section">
										<p className="search-section-title">{t('header.users')}</p>
										{users.map((user) => (
											<div
												key={user.id}
												onClick={() => handleSelectUser(user.id)}
												className="search-result-item"
											>
												{user.avatar_url && (
													<img
														src={user.avatar_url}
														alt={user.username}
														className="search-result-avatar"
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

					<LanguageSwitcher />

					{isLoggedIn ? (
						<button onClick={handleLogout} className="header-auth-button">
							{t('header.logout')}
						</button>
					) : (
						<Link to="/auth" className="header-auth-button">
							{t('header.login')}
						</Link>
					)}
				</div>
			</div>

			<nav className="header-banner" aria-label={t('header.navLabel')}>
				<NavLink to="/" end className={({ isActive }) => `header-nav-link${isActive ? ' active' : ''}`}>
					<span className="nav-label">{t('header.navMovies')}</span>
				</NavLink>
				<NavLink to="/reviews/me" className={({ isActive }) => `header-nav-link${isActive ? ' active' : ''}`}>
					<span className="nav-label">{t('header.navReviews')}</span>
				</NavLink>
				<NavLink to="/watchlist" className={({ isActive }) => `header-nav-link${isActive ? ' active' : ''}`}>
					<span className="nav-label">{t('header.navWatchlist')}</span>
				</NavLink>
				<NavLink to="/favorites" className={({ isActive }) => `header-nav-link${isActive ? ' active' : ''}`}>
					<span className="nav-label">{t('header.navFavorites')}</span>
				</NavLink>
				<NavLink to="/profile" className={({ isActive }) => `header-nav-link${isActive ? ' active' : ''}`}>
					<span className="nav-label">{t('header.navProfile')}</span>
				</NavLink>
			</nav>
		</header>
	);
}

export default Header;