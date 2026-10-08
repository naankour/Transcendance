import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import defaultActor from '../assets/sticker-mask.png';
import { getAvatarUrl } from '../utils/avatar.js';

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
		<div className="mx-auto my-10 w-[min(1100px,calc(100%-40px))] rounded-[18px] border-2 border-[var(--border)] bg-[rgba(0,0,0,0.6)] p-[25px] shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_var(--color-accent-soft),0_0_24px_rgba(255,46,154,0.5)] max-[750px]:my-5 max-[750px]:w-[calc(100%-24px)] max-[750px]:p-[18px] max-[450px]:w-[calc(100%-16px)] max-[450px]:p-[14px]">
			<h1 className="mb-[30px] text-center text-[32px] font-bold text-[var(--text-h)] [text-shadow:0_0_5px_var(--accent),0_0_12px_rgba(255,46,154,0.35)] max-[750px]:text-[26px]">{t('searchPage.resultsFor', { query })}</h1>

			{loading && <p className="my-10 text-center text-base text-[var(--text)] opacity-80">{t('searchPage.loading')}</p>}
			{error && <p className="my-10 text-center text-base text-[var(--text)] opacity-80">{error}</p>}

			{!loading && !error && movies.length === 0 && people.length === 0 && users.length === 0 && (
				<p className="my-10 text-center text-base text-[var(--text)] opacity-80">{t('searchPage.noResults')}</p>
			)}

			{movies.length > 0 && (
				<div className="mt-[35px] first:mt-0">
					<h2 className="mb-[18px] rounded-[15px] border-2 border-[var(--color-accent-soft)] bg-gradient-to-b from-[#b52b75] to-[#681039] px-[14px] py-[10px] text-center text-[25px] font-bold uppercase text-[var(--text-h)] shadow-[inset_0_8px_15px_-10px_#ff63ae,0_3px_8px_rgba(0,0,0,0.5)] max-[750px]:text-[18px]">{t('searchPage.movies')}</h2>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{movies.map((movie) => (
							<div key={movie.id} className="group relative flex min-w-0 cursor-pointer flex-col items-center rounded-[6px] border border-[var(--border)] bg-gradient-to-b from-[rgba(255,46,154,0.05)] to-[rgba(0,0,0,0.25)] p-[10px] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:from-[rgba(255,46,154,0.12)] hover:to-[rgba(0,0,0,0.3)] hover:shadow-[0_0_6px_var(--accent),0_0_16px_rgba(255,46,154,0.3)] max-[750px]:p-[7px]" onClick={() => navigate(`/movie/${movie.id}`)}>
								{movie.poster_path && <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="h-[215px] w-full rounded-[3px] border-2 border-[var(--bg)] object-cover outline outline-1 outline-[var(--border)] shadow-[0_0_0_1px_var(--bg),0_0_6px_rgba(255,46,154,0.25)] max-[750px]:h-[175px] max-[450px]:h-[210px]" />}
								<p className="my-[10px] w-full overflow-hidden text-center text-[14px] font-semibold leading-[1.35] text-[var(--text)]">{movie.title} {movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ''}</p>
							</div>
						))}
					</div>
					{hasMoreMovies && (
						<button
							type="button"
							className="mt-4 inline-flex items-center rounded-full border border-pink-500/60 bg-pink-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-pink-50 transition hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loadingMore}
							onClick={() => loadMore('movies')}
						>
							{t('searchPage.loadMore')}
						</button>
					)}
				</div>
			)}

			{people.length > 0 && (
				<div className="mt-[35px]">
					<h2 className="mb-[18px] rounded-[15px] border-2 border-[var(--color-accent-soft)] bg-gradient-to-b from-[#b52b75] to-[#681039] px-[14px] py-[10px] text-center text-[25px] font-bold uppercase text-[var(--text-h)] shadow-[inset_0_8px_15px_-10px_#ff63ae,0_3px_8px_rgba(0,0,0,0.5)] max-[750px]:text-[18px]">{t('searchPage.actorsDirectors')}</h2>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{people.map((person) => (
							<div key={person.id} className="group relative flex min-w-0 cursor-pointer flex-col items-center rounded-[6px] border border-[var(--border)] bg-gradient-to-b from-[rgba(255,46,154,0.05)] to-[rgba(0,0,0,0.25)] p-[10px] text-center transition hover:-translate-y-1 hover:border-[var(--accent)] hover:from-[rgba(255,46,154,0.12)] hover:to-[rgba(0,0,0,0.3)] hover:shadow-[0_0_6px_var(--accent),0_0_16px_rgba(255,46,154,0.3)] max-[750px]:p-[7px]" onClick={() => navigate(`/actor/${person.id}`)}>
								<img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : defaultActor} alt={person.name} className="h-[180px] w-[140px] rounded-[4px] border-[3px] border-[var(--bg)] object-cover outline outline-1 outline-[var(--color-accent-soft)] shadow-[0_0_0_1px_var(--bg),0_0_7px_rgba(255,46,154,0.3)] max-[750px]:h-[145px] max-[750px]:w-[110px] max-[450px]:h-[160px] max-[450px]:w-[120px]" />
								<p className="my-[10px] w-full overflow-hidden text-center text-[14px] font-semibold leading-[1.35] text-[var(--text)]">{person.name}</p>
							</div>
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
					<h2 className="mb-[18px] rounded-[15px] border-2 border-[var(--color-accent-soft)] bg-gradient-to-b from-[#b52b75] to-[#681039] px-[14px] py-[10px] text-center text-[25px] font-bold uppercase text-[var(--text-h)] shadow-[inset_0_8px_15px_-10px_#ff63ae,0_3px_8px_rgba(0,0,0,0.5)] max-[750px]:text-[18px]">{t('searchPage.users')}</h2>
					<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] max-[750px]:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] max-[750px]:gap-3 max-[450px]:grid-cols-2">
						{users.map((user) => (
							<div key={user.id} className="group relative flex min-w-0 cursor-pointer flex-col items-center rounded-[6px] border border-[var(--border)] bg-gradient-to-b from-[rgba(255,46,154,0.05)] to-[rgba(0,0,0,0.25)] p-[10px] text-center transition hover:-translate-y-1 hover:border-[var(--accent)] hover:from-[rgba(255,46,154,0.12)] hover:to-[rgba(0,0,0,0.3)] hover:shadow-[0_0_6px_var(--accent),0_0_16px_rgba(255,46,154,0.3)] max-[750px]:p-[7px]" onClick={() => navigate(`/profile/${user.id}`)}>
								<img src={getAvatarUrl(user.avatar_url)} alt={user.username} className="h-[140px] w-[140px] rounded-[4px] border-[3px] border-[var(--bg)] object-cover outline outline-1 outline-[var(--color-accent-soft)] shadow-[0_0_0_1px_var(--bg),0_0_7px_rgba(255,46,154,0.3)] max-[750px]:h-[110px] max-[750px]:w-[110px] max-[450px]:h-[120px] max-[450px]:w-[120px]" />
								<p className="my-[10px] w-full overflow-hidden text-center text-[14px] font-semibold leading-[1.35] text-[var(--text)]">{user.username}</p>
							</div>
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
		</div>
	);
}

export default SearchResultsPage;