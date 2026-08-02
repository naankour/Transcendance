import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

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

function Header() {
	const { t, i18n } = useTranslation();
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState<MovieResult[]>([]);
	const [people, setPeople] = useState<PersonResult[]>([]);
	const [showResults, setShowResults] = useState(false);
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const trimmed = query.trim();

		if (trimmed.length < 2) {
			setMovies([]);
			setPeople([]);
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
					setShowResults(true);
				})
				.catch(() => {
					setMovies([]);
					setPeople([]);
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

	const handleFullSearch = () => {
		const trimmed = query.trim();
		if (!trimmed) return;
		setShowResults(false);
		navigate(`/search/${encodeURIComponent(trimmed)}`);
	};

	return (
		<header className="header">
			<Link to="/" className="header-logo">★ LetterBlog ★</Link>

			<div ref={containerRef} className="search-container">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleFullSearch()}
					onFocus={() => {
						if (movies.length > 0 || people.length > 0)
							setShowResults(true);
					}}
					placeholder={t('header.searchPlaceholder')}
					className="search-input"
				/>

				{showResults && (movies.length > 0 || people.length > 0) && (
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
					</div>
				)}
			</div>

			<LanguageSwitcher />
		</header>
	);
}

export default Header;