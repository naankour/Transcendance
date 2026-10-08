import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<section className="mx-auto my-16 flex min-h-[420px] w-[min(850px,calc(100%-32px))] flex-col items-center justify-center rounded-[18px] border-2 border-[var(--color-accent)] bg-[rgba(0,0,0,0.6)] px-6 py-12 text-center shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_var(--color-accent-soft),0_0_24px_rgba(255,46,154,0.5)]">
			<p className="font-[var(--font-display)] text-[clamp(5rem,18vw,10rem)] leading-none text-[var(--color-accent-soft)] [text-shadow:0_0_8px_var(--color-accent),0_0_24px_var(--color-accent)]">
				404
			</p>
			<h1 className="mt-6 text-3xl font-bold text-[var(--color-text)]">{t('notFound.title')}</h1>
			<p className="mt-3 max-w-md text-[var(--color-text-muted)]">
				{t('notFound.message')}
			</p>
			<div className="mt-8 flex flex-wrap justify-center gap-4">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="rounded-[25px] border-2 border-[var(--color-accent-soft)] px-5 py-[10px] text-[15px] font-bold text-[var(--color-text-muted)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:shadow-[0_0_8px_var(--color-accent)]"
				>
					{t('notFound.back')}
				</button>
				<Link
					to="/"
					className="rounded-[25px] bg-[var(--color-accent)] px-5 py-3 text-[15px] font-bold text-[var(--color-bg)] no-underline transition hover:bg-[var(--color-accent-soft)] hover:shadow-[0_0_12px_var(--color-accent)]"
				>
					{t('notFound.home')}
				</Link>
			</div>
		</section>
	);
}

export default NotFoundPage;
