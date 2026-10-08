import { useTranslation } from 'react-i18next';

function TermsOfService() {
	const { t } = useTranslation();
	const acceptableUseItems = t('terms.s4.items', { returnObjects: true }) as string[];

	return (
		<main className="w-full min-h-[calc(100vh-140px)] px-3 py-10 md:px-5">
			<article className="mx-auto max-w-4xl rounded-2xl border border-pink-500/60 bg-[#120b12]/80 p-6 shadow-[0_0_30px_rgba(255,46,154,0.12)] md:p-10">
				<h1 className="mb-2 text-center text-3xl font-semibold uppercase tracking-[0.12em] text-pink-50 md:text-5xl">{t('terms.title')}</h1>
				<p className="mb-8 text-center text-xs uppercase tracking-[0.24em] text-pink-100/70">{t('terms.lastUpdated')}</p>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s1.heading')}</h2>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s1.p1')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s2.heading')}</h2>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s2.p1')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s3.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s3.p1')}</p>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s3.p2')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s4.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s4.intro')}</p>
					<ul className="ml-5 list-disc space-y-2 text-base leading-7 text-pink-50/90">
						{acceptableUseItems.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s5.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s5.p1')}</p>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s5.p2')}</p>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s5.p3')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s6.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s6.p1')}</p>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s6.p2')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s7.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s7.p1')}</p>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s7.p2')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s8.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s8.p1')}</p>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s8.p2')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s9.heading')}</h2>
					<p className="mb-3 text-base leading-7 text-pink-50/90">{t('terms.s9.p1')}</p>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s9.p2')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s10.heading')}</h2>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s10.p1')}</p>
				</section>

				<section className="mb-7">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s11.heading')}</h2>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s11.p1')}</p>
				</section>

				<section className="mb-0">
					<h2 className="mb-2 border-b border-pink-500/30 pb-2 text-lg font-semibold text-pink-200">{t('terms.s12.heading')}</h2>
					<p className="text-base leading-7 text-pink-50/90">{t('terms.s12.p1')}</p>
				</section>
			</article>
		</main>
	);
}

export default TermsOfService;