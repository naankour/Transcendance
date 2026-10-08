import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import defaultActor from '../assets/sticker-mask.png';

interface FilmographyEntry {
	id: number;
	title: string;
	role: 'Actor' | 'Director';
	detail: string | null;
	release_date: string;
}

interface Actor {
	id: number;
	name: string;
	biography: string;
	biographyIsFallback: boolean;
	profile_path: string | null;
	birthday: string | null;
	filmography: FilmographyEntry[];
}

function ActorPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();

	const [actor, setActor] = useState<Actor | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setActor(null);

		fetch(`/api/actors/${id}?lang=${i18n.language}`)
			.then(async (res) => {
				const data = await res.json();

				if (!res.ok)
					throw new Error(data.error || 'Error');

				setActor(data);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id, i18n.language]);

	return (
		<div className="mx-auto my-10 w-[min(1050px,calc(100%-40px))] rounded-[18px] border-[3px] border-[var(--color-accent)] bg-[rgba(0,0,0,0.6)] p-7 shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_var(--color-accent-soft),0_0_24px_rgba(255,46,154,0.5)] max-[700px]:my-5 max-[700px]:w-[calc(100%-24px)] max-[700px]:p-[18px]">
			<button
				onClick={() => navigate(-1)}
				className="mb-[25px] rounded-[18px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-bg)] px-[10px] py-[6px] font-inherit font-bold text-[var(--color-text)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:shadow-[5px_5px_0_#36051f,0_0_14px_var(--color-accent)]"
			>
				{t('actorPage.back')}
			</button>

			{loading && <p className="text-[var(--color-text-muted)]">{t('actorPage.loading')}</p>}
			{error && <p className="text-[#ff91aa]">{error}</p>}

			{actor && (
				<div className="grid grid-cols-[250px_1fr] items-start gap-[30px] max-[700px]:flex max-[700px]:flex-col">
					<div className="relative rotate-[-1deg] bg-gradient-to-br from-[#ff86c3] via-[#82134b] to-[#ff46a3] p-2 shadow-[6px_6px_0_#36051f,0_0_15px_var(--color-accent)] max-[700px]:mx-auto max-[700px]:w-[210px]">
						<img
							src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : defaultActor}
							alt={actor.name}
							className="block h-[340px] w-full rounded-[10px] border-4 border-[var(--color-bg)] object-cover max-[700px]:h-[300px]"
						/>
						<span className="block pt-2 text-center text-[12px] font-bold tracking-[4px] text-white [text-shadow:0_0_6px_var(--color-accent)]">✦ CINEMA ✦</span>
					</div>

					<div className="space-y-[15px]">
						<div>
							<h2 className="mb-[15px] rounded-[15px] border-2 border-[var(--color-accent-soft)] bg-gradient-to-b from-[#b52b75] to-[#681039] px-[15px] py-[10px] text-center text-[30px] uppercase text-[var(--color-text)] shadow-[4px_4px_0_#36051f,0_0_12px_var(--color-accent)] max-[700px]:text-[28px]">★ {actor.name} ★</h2>

							{actor.birthday && (
								<p className="w-fit rounded-[18px] border border-dashed border-[var(--color-accent-soft)] px-[10px] py-[6px] text-[var(--color-text-muted)]">
									<span><strong className="text-[var(--color-accent-soft)]">{t('actorPage.born')}</strong> {actor.birthday}</span>
								</p>
							)}
						</div>

						<div className="mt-[15px] rounded-[15px] border-l-[5px] border-t border-[var(--color-accent)] border-t-[var(--color-accent-soft)] bg-[rgba(0,0,0,0.6)] p-[18px]">
							<p className="text-justify leading-[1.5] text-[var(--color-text)] max-[700px]:text-left">
								{actor.biography || t('actorPage.noBiography')}
								{actor.biographyIsFallback && (
									<span className="text-[12px] italic text-[var(--color-text-muted)]"> {t('actorPage.biographyFallbackNotice')}</span>
								)}
							</p>
						</div>

						<div className="col-span-full">
							<h3 className="mb-3 rounded-[15px] border-2 border-[var(--color-accent-soft)] bg-gradient-to-b from-[#c83280] to-[#701040] px-[14px] py-[9px] text-center uppercase tracking-[3px] text-white shadow-[4px_4px_0_#36051f,0_0_10px_var(--color-accent)]">★ {t('actorPage.filmography')} ★</h3>

							<div className="flex flex-col">
								{actor.filmography.map((movie, index) => (
									<Link
										key={`${movie.id}-${movie.role}-${index}`}
										to={`/movie/${movie.id}`}
										className="flex items-center justify-between gap-5 border-b border-[rgba(255,159,209,0.5)] px-[10px] py-[7px] text-[var(--color-text)] transition hover:rounded-[15px] hover:bg-[rgba(250,117,186,0.2)] hover:pl-[18px] hover:text-white"
									>
										<span className="font-semibold">{movie.title}</span>
										<span className="shrink-0 text-[13px] text-[var(--color-text-muted)]">
											{movie.release_date && movie.release_date.slice(0, 4)}
											{movie.release_date && ' · '}
											{movie.role === 'Director' ? t('actorPage.roleDirector') : t('actorPage.roleActor')}
										</span>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ActorPage;