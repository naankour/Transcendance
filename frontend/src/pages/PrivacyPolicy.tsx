import { useTranslation } from 'react-i18next';
import '../styles/LegalPage.css';

function PrivacyPolicy() {
	const { t } = useTranslation();
	const infoUseItems = t('privacy.s4.items', { returnObjects: true }) as string[];

	return (
		<main className="legal-page">
			<article className="legal-content">
				<h1>{t('privacy.title')}</h1>

				<p className="legal-date">{t('privacy.lastUpdated')}</p>

				<section>
					<h2>{t('privacy.s1.heading')}</h2>
					<p>{t('privacy.s1.p1')}</p>
					<p>{t('privacy.s1.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s2.heading')}</h2>
					<p>{t('privacy.s2.p1')}</p>
					<p>{t('privacy.s2.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s3.heading')}</h2>
					<p>{t('privacy.s3.p1')}</p>
				</section>

				<section>
					<h2>{t('privacy.s4.heading')}</h2>
					<p>{t('privacy.s4.intro')}</p>
					<ul>
						{infoUseItems.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</section>

				<section>
					<h2>{t('privacy.s5.heading')}</h2>
					<p>{t('privacy.s5.p1')}</p>
					<p>{t('privacy.s5.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s6.heading')}</h2>
					<p>{t('privacy.s6.p1')}</p>
					<p>{t('privacy.s6.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s7.heading')}</h2>
					<p>{t('privacy.s7.p1')}</p>
					<p>{t('privacy.s7.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s8.heading')}</h2>
					<p>{t('privacy.s8.p1')}</p>
				</section>

				<section>
					<h2>{t('privacy.s9.heading')}</h2>
					<p>{t('privacy.s9.p1')}</p>
					<p>{t('privacy.s9.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s10.heading')}</h2>
					<p>{t('privacy.s10.p1')}</p>
				</section>

				<section>
					<h2>{t('privacy.s11.heading')}</h2>
					<p>{t('privacy.s11.p1')}</p>
					<p>{t('privacy.s11.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s12.heading')}</h2>
					<p>{t('privacy.s12.p1')}</p>
					<p>{t('privacy.s12.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s13.heading')}</h2>
					<p>{t('privacy.s13.p1')}</p>
					<p>{t('privacy.s13.p2')}</p>
				</section>

				<section>
					<h2>{t('privacy.s14.heading')}</h2>
					<p>{t('privacy.s14.p1')}</p>
				</section>
			</article>
		</main>
	);
}

export default PrivacyPolicy;