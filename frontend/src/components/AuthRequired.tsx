import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StickerKuromi from '../assets/sticker-kuromi.png';

interface AuthRequiredProps {
	message?: string;
}

function AuthRequired({ message }: AuthRequiredProps) {
	const { t } = useTranslation();

	let displayMessage = t('auth.requiredDefault');
	if (message) {
		displayMessage = message;
	}

	return (
		<div className="mt-[70px] flex flex-col items-center justify-center">
			<div className="relative flex w-[70%] flex-col items-center justify-center rounded-[10px] border-[3px] border-dashed border-[var(--color-accent)] px-[25px] py-[45px] text-center shadow-[0_0_0_5px_var(--color-surface-alt),0_0_0_8px_var(--color-accent-soft),8px_8px_0_rgba(255,46,154,0.25)] before:absolute before:left-5 before:top-[14px] before:text-[18px] before:text-[var(--color-accent-soft)] before:[text-shadow:0_0_5px_var(--color-accent),0_0_10px_var(--color-accent)] before:content-['★'] after:absolute after:bottom-[14px] after:right-5 after:text-[18px] after:text-[var(--color-accent-soft)] after:[text-shadow:0_0_5px_var(--color-accent),0_0_10px_var(--color-accent)] after:content-['★']">
				<p className="mb-[14px] text-[42px] leading-none [filter:drop-shadow(0_0_5px_var(--color-accent))_drop-shadow(0_0_12px_rgba(255,46,154,0.5))]">🔒</p>
				<p className="mb-[22px] max-w-[450px] text-[16px] leading-[1.5] text-[var(--color-text)] [text-shadow:0_0_4px_rgba(255,159,209,0.25)]">{displayMessage}</p>
				<Link
					to="/auth"
					className="rounded-[25px] border-2 border-[var(--color-accent-soft)] px-5 py-[10px] text-[15px] font-bold text-[var(--color-text-muted)] no-underline transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:shadow-[0_0_8px_var(--color-accent)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--color-text)] focus-visible:outline-offset-4"
				>
					{t('auth.requiredButton')}
				</Link>
				<div className="mt-[50px] [animation:moving-sticker_4s_ease-in-out_infinite]">
				<img
					src={StickerKuromi}
					alt="Kuromi Sticker"
					className="h-[230px] w-auto [filter:drop-shadow(0_0_1px_var(--color-accent))_drop-shadow(0_0_1px_var(--color-accent-softer))]"
				/>
			</div>
		</div>
		</div>
	);
}

export default AuthRequired;