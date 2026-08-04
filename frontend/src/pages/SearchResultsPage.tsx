import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/SearchResultsPage.css';

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

function SearchResultsPage() {
	const { query } = useParams();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [movies, setMovies] = useState<MovieResult[]>([]);
	const [people, setPeople] = useState<PersonResult[]>([]);
	const [users, setUsers] = useState<UserResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		fetch(`/api/search/${encodeURIComponent(query || '')}?movieLimit=20&personLimit=20&userLimit=20&lang=${i18n.language}`)
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Error');
				setMovies(data.movies || []);
				setPeople(data.people || []);
				setUsers(data.users || []);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [query, i18n.language]);

	return (
		<div className="search-page">
			<h1 className="search-page-title">{t('searchPage.resultsFor', { query })}</h1>

			{loading && <p className="search-page-status">{t('searchPage.loading')}</p>}
			{error && <p className="search-page-status">{error}</p>}

			{!loading && !error && movies.length === 0 && people.length === 0 && users.length === 0 && (
				<p className="search-page-status">{t('searchPage.noResults')}</p>
			)}

			{movies.length > 0 && (
				<div className="search-page-section">
					<h2 className="search-page-section-title">{t('searchPage.movies')}</h2>
					<div className="search-page-grid">
						{movies.map((movie) => (
							<div
								key={movie.id}
								className="search-page-card"
								onClick={() => navigate(`/movie/${movie.id}`)}
							>
								{movie.poster_path && (
									<img
										src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
										alt={movie.title}
										className="search-page-poster"
									/>
								)}
								<p className="search-page-card-title">
									{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{people.length > 0 && (
				<div className="search-page-section">
					<h2 className="search-page-section-title">{t('searchPage.actorsDirectors')}</h2>
					<div className="search-page-grid">
						{people.map((person) => (
							<div
								key={person.id}
								className="search-page-card"
								onClick={() => navigate(`/actor/${person.id}`)}
							>
								{person.profile_path && (
									<img
										src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
										alt={person.name}
										className="search-page-avatar"
									/>
								)}
								<p className="search-page-card-title">{person.name}</p>
							</div>
						))}
					</div>
				</div>
			)}

			{users.length > 0 && (
				<div className="search-page-section">
					<h2 className="search-page-section-title">{t('searchPage.users')}</h2>
					<div className="search-page-grid">
						{users.map((user) => (
							<div
								key={user.id}
								className="search-page-card"
								onClick={() => navigate(`/profile/${user.id}`)}
							>
								{user.avatar_url && (
									<img
										src={user.avatar_url}
										alt={user.username}
										className="search-page-avatar"
									/>
								)}
								<p className="search-page-card-title">{user.username}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default SearchResultsPage;