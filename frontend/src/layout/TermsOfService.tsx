import { useTranslation } from 'react-i18next';
import '../styles/LegalPage.css';

function TermsOfService() {
	const { t } = useTranslation();
	const acceptableUseItems = t('terms.s4.items', { returnObjects: true }) as string[];

	return (
		<main className="legal-page">
			<article className="legal-content">
				<h1>{t('terms.title')}</h1>

				<p className="legal-date">{t('terms.lastUpdated')}</p>

				<section>
					<h2>{t('terms.s1.heading')}</h2>
					<p>{t('terms.s1.p1')}</p>
				</section>

				<section>
					<h2>{t('terms.s2.heading')}</h2>
					<p>{t('terms.s2.p1')}</p>
				</section>

				<section>
					<h2>{t('terms.s3.heading')}</h2>
					<p>{t('terms.s3.p1')}</p>
					<p>{t('terms.s3.p2')}</p>
				</section>

				<section>
					<h2>{t('terms.s4.heading')}</h2>
					<p>{t('terms.s4.intro')}</p>
					<ul>
						{acceptableUseItems.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</section>

				<section>
					<h2>{t('terms.s5.heading')}</h2>
					<p>{t('terms.s5.p1')}</p>
					<p>{t('terms.s5.p2')}</p>
					<p>{t('terms.s5.p3')}</p>
				</section>

				<section>
					<h2>{t('terms.s6.heading')}</h2>
					<p>{t('terms.s6.p1')}</p>
					<p>{t('terms.s6.p2')}</p>
				</section>

				<section>
					<h2>{t('terms.s7.heading')}</h2>
					<p>{t('terms.s7.p1')}</p>
					<p>{t('terms.s7.p2')}</p>
				</section>

				<section>
					<h2>{t('terms.s8.heading')}</h2>
					<p>{t('terms.s8.p1')}</p>
					<p>{t('terms.s8.p2')}</p>
				</section>

				<section>
					<h2>{t('terms.s9.heading')}</h2>
					<p>{t('terms.s9.p1')}</p>
					<p>{t('terms.s9.p2')}</p>
				</section>

				<section>
					<h2>{t('terms.s10.heading')}</h2>
					<p>{t('terms.s10.p1')}</p>
				</section>

				<section>
					<h2>{t('terms.s11.heading')}</h2>
					<p>{t('terms.s11.p1')}</p>
				</section>

				<section>
					<h2>{t('terms.s12.heading')}</h2>
					<p>{t('terms.s12.p1')}</p>
				</section>
			</article>
		</main>
	);
}

export default TermsOfService;