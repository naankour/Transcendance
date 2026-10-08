import { useTranslation } from 'react-i18next';
import HoverLink from '../components/HoverLink';

function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="flex w-full items-center justify-between gap-[10px] border-t border-[var(--color-accent)] bg-[var(--color-bg)] px-[30px] py-4 text-[0.85rem] text-[var(--color-accent-soft)] max-[600px]:flex-col max-[600px]:justify-center max-[600px]:text-center">
			<p className="m-0">© 2026 LetterBlog</p>

			<nav className="flex items-center gap-6 max-[600px]:flex-wrap max-[600px]:justify-center max-[600px]:gap-x-5 max-[600px]:gap-y-3" aria-label={t('footer.legalInformation')}>
				<HoverLink to="/privacy-policy" className="text-[#ff80bd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-text)] focus-visible:outline-offset-4">
					{t('footer.privacyPolicy')}
				</HoverLink>

				<HoverLink to="/terms-of-service" className="text-[#ff80bd] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--color-text)] focus-visible:outline-offset-4">
					{t('footer.termsOfService')}
				</HoverLink>
			</nav>
		</footer>
	);
}

export default Footer;