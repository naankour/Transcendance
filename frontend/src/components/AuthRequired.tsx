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
		<div className="flex min-h-[22rem] flex-col items-center justify-center gap-6 rounded-2xl border border-pink-500/60 bg-[#120b12]/80 p-8 text-center shadow-[0_0_30px_rgba(255,46,154,0.18)]">
			<div className="flex max-w-md flex-col items-center gap-4">
				<p className="text-4xl">🔒</p>
				<p className="text-lg font-medium text-pink-50">{displayMessage}</p>
				<Link
					to="/auth"
					className="inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#180b12] transition hover:bg-pink-400"
				>
					{t('auth.requiredButton')}
				</Link>
			</div>
			<div className="flex items-center justify-center">
				<img
					src={StickerKuromi}
					alt="Kuromi Sticker"
					className="h-28 w-auto drop-shadow-[0_0_14px_rgba(255,46,154,0.45)]"
				/>
			</div>
		</div>
	);
}

export default AuthRequired;