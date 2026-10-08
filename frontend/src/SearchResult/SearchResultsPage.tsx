import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import defaultActor from '../assets/sticker-mask.png';
import { getAvatarUrl } from '../utils/avatar.js';
import NeonCard from '../components/NeonCard';
import NeonButton from '../components/NeonButton';
import SectionTitle from '../components/SectionTitle';
import MovieCard from '../components/MovieCard';
import ProfileCard from '../components/ProfileCard';

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

const RESULTS_PER_PAGE = 20;

function SearchResultsPage() {
	const { query } = useParams();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const [movies, setMovies] = useState<MovieResult[]>([]);
	const [people, setPeople] = useState<PersonResult[]>([]);
	const [users, setUsers] = useState<UserResult[]>([]);

	const [moviePage, setMoviePage] = useState(1);
	const [personPage, setPersonPage] = useState(1);
	const [userPage, setUserPage] = useState(1);

	const [hasMoreMovies, setHasMoreMovies] = useState(false);
	const [hasMorePeople, setHasMorePeople] = useState(false);
	const [hasMoreUsers, setHasMoreUsers] = useState(false);

	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setMoviePage(1);
		setPersonPage(1);
		setUserPage(1);

		const params = new URLSearchParams({
			movieLimit: String(RESULTS_PER_PAGE),
			personLimit: String(RESULTS_PER_PAGE),
			userLimit: String(RESULTS_PER_PAGE),
			moviePage: '1',
			personPage: '1',
			userPage: '1',
			lang: i18n.language,
		});

		fetch(`/api/search/${encodeURIComponent(query || '')}?${params.toString()}`)
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Error');
				setMovies(data.movies || []);
				setPeople(data.people || []);
				setUsers(data.users || []);
				setHasMoreMovies(Boolean(data.hasMoreMovies));
				setHasMorePeople(Boolean(data.hasMorePeople));
				setHasMoreUsers(Boolean(data.hasMoreUsers));
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [query, i18n.language]);

	const loadMore = (type: 'movies' | 'people' | 'users') => {
		let nextMoviePage = moviePage;
		let nextPersonPage = personPage;
		let nextUserPage = userPage;

		if (type === 'movies')
			nextMoviePage = moviePage + 1;
		else if (type === 'people')
			nextPersonPage = personPage + 1;
		else
			nextUserPage = userPage + 1;

		setLoadingMore(true);

		const params = new URLSearchParams({
			movieLimit: String(RESULTS_PER_PAGE),
			personLimit: String(RESULTS_PER_PAGE),
			userLimit: String(RESULTS_PER_PAGE),
			moviePage: String(nextMoviePage),
			personPage: String(nextPersonPage),
			userPage: String(nextUserPage),
			lang: i18n.language,
		});

		fetch(`/api/search/${encodeURIComponent(query || '')}?${params.toString()}`)
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Error');

				if (type === 'movies') {
					setMovies((prev) => [...prev, ...(data.movies || [])]);
					setMoviePage(nextMoviePage);
					setHasMoreMovies(Boolean(data.hasMoreMovies));
				} else if (type === 'people') {
					setPeople((prev) => [...prev, ...(data.people || [])]);
					setPersonPage(nextPersonPage);
					setHasMorePeople(Boolean(data.hasMorePeople));
				} else {
					setUsers((prev) => [...prev, ...(data.users || [])]);
					setUserPage(nextUserPage);
					setHasMoreUsers(Boolean(data.hasMoreUsers));
				}
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoadingMore(false));
	};

	return (
		<NeonCard className="mx-auto my-10 w-[min(1100px,calc(100%-40px))] border-[var(--border)] bg-[rgba(0,0,0,0.6)] p-[25px] shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_var(--color-accent-soft),0_0_24px_rgba(255,46,154,0.5)] max-[750px]:my-5 max-[750px]:w-[calc(100%-24px)] max-[750px]:p-[18px] max-[450px]:w-[calc(100%-16px)] max-[450px]:p-[14px]">
			<h1 className="mb-[30px] text-center text-[32px] font-bold text-[var(--text-h)] [text-shadow:0_0_5px_var(--accent),0_0_12px_rgba(255,46,154,0.35)] max-[750px]:text-[26px]">{t('searchPage.resultsFor', { query })}</h1>

			{loading && <p className="my-10 text-center text-base text-[var(--text)] opacity-80">{t('searchPage.loading')}</p>}
			{error && <p className="my-10 text-center text-base text-[var(--text)] opacity-80">{error}</p>}

			{!loading && !error && movies.length === 0 && people.length === 0 && users.length === 0 && (
				<p className="my-10 text-center text-base text-[var(--text)] opacity-80">{t('searchPage.noResults')}</p>
			)}

			{movies.length > 0 && (
				<div className="mt-[35px] first:mt-0">
					<SectionTitle className="mb-[18px]">{t('searchPage.movies')}</SectionTitle>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{movies.map((movie) => (
							<MovieCard
								key={movie.id}
								title={movie.title}
								year={movie.release_date ? movie.release_date.slice(0, 4) : undefined}
								posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null}
								onClick={() => navigate(`/movie/${movie.id}`)}
							/>
						))}
					</div>
					{hasMoreMovies && (
						<NeonButton
							className="mt-4"
							disabled={loadingMore}
							onClick={() => loadMore('movies')}
						>
							{t('searchPage.loadMore')}
						</NeonButton>
					)}
				</div>
			)}

			{people.length > 0 && (
				<div className="mt-[35px]">
					<SectionTitle className="mb-[18px]">{t('searchPage.actorsDirectors')}</SectionTitle>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{people.map((person) => (
							<ProfileCard
								key={person.id}
								name={person.name}
								avatarUrl={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : defaultActor}
								onClick={() => navigate(`/actor/${person.id}`)}
							/>
						))}
					</div>
					{hasMorePeople && (
						<button
							type="button"
							className="mt-4 inline-flex items-center rounded-full border border-pink-500/60 bg-pink-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink-50 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loadingMore}
							onClick={() => loadMore('people')}
						>
							{t('searchPage.loadMore')}
						</button>
					)}
				</div>
			)}

			{users.length > 0 && (
				<div className="mt-[35px]">
					<SectionTitle className="mb-[18px]">{t('searchPage.users')}</SectionTitle>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{users.map((user) => (
							<ProfileCard
								key={user.id}
								name={user.username}
								avatarUrl={getAvatarUrl(user.avatar_url)}
								onClick={() => navigate(`/profile/${user.id}`)}
							/>
						))}
					</div>
					{hasMoreUsers && (
						<button
							type="button"
							className="mt-4 inline-flex items-center rounded-full border border-pink-500/60 bg-pink-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink-50 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loadingMore}
							onClick={() => loadMore('users')}
						>
							{t('searchPage.loadMore')}
						</button>
					)}
				</div>
			)}
		</NeonCard>
	);
}

export default SearchResultsPage;