import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { useTranslation } from 'react-i18next';

function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="footer">
			<p className="footer-copyright">
				© 2026 LetterBlog
			</p>

			<nav className="footer-links" aria-label={t('footer.legalInformation')}>
				<Link to="/privacy-policy">
					{t('footer.privacyPolicy')}
				</Link>

				<Link to="/terms-of-service">
					{t('footer.termsOfService')}
				</Link>
			</nav>
		</footer>
	);
}

export default Footer;