import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'fr', label: 'FR' },
	{ code: 'es', label: 'ES' },
];

function LanguageSwitcher() {
	const { i18n } = useTranslation();

	return (
		<div className="language-switcher">
			{LANGUAGES.map((lang) => {
				let buttonClass = 'lang-button';
				if (i18n.language === lang.code)
					buttonClass = 'lang-button lang-button-active';

				return (
					<button
						key={lang.code}
						onClick={() => i18n.changeLanguage(lang.code)}
						className={buttonClass}
					>
						{lang.label}
					</button>
				);
			})}
		</div>
	);
}

export default LanguageSwitcher;