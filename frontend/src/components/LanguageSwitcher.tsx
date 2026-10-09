import { useTranslation } from 'react-i18next';

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'fr', label: 'FR' },
	{ code: 'es', label: 'ES' },
];

function LanguageSwitcher() {
	const { i18n } = useTranslation();

	return (
		<div className="box-border flex h-[50px] items-center gap-[6px] rounded-[20px] border-2 border-[var(--color-accent-soft)] bg-[var(--color-surface)] px-3 py-[5px]">
			{LANGUAGES.map((lang) => {
				const isActive = i18n.language === lang.code;

				return (
					<button
						key={lang.code}
						onClick={() => i18n.changeLanguage(lang.code)}
						className={[
							'w-[36px] h-[26px] rounded-[16px] border-0 bg-transparent text-[12px] font-semibold tracking-[0.5px] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]',
							isActive
								? '!bg-[var(--color-accent)] !text-[var(--color-bg)] shadow-[0_0_8px_var(--color-accent)] hover:!bg-[var(--color-accent)] hover:!text-[var(--color-bg)]'
								: 'text-[var(--color-text-muted)]',
						].join(' ')}
					>
						{lang.label}
					</button>
				);
			})}
		</div>
	);
}

export default LanguageSwitcher;