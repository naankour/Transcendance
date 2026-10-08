import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatusMessage from '../components/StatusMessage';
import Stickers from '../assets/pixel-art-thank-you.png';

function VisitorCounter() {
	const { t } = useTranslation();
	const [count, setCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const hasFetched = useRef(false);

	useEffect(() => {
		if (hasFetched.current)
			return;

		hasFetched.current = true;

		const alreadyCounted = sessionStorage.getItem('letterblog_visited');

		let url = '/api/visitors/count';
		let method = 'GET';

		if (!alreadyCounted) {
			url = '/api/visitors/increment';
			method = 'POST';
		}

		fetch(url, { method })
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok)
					throw new Error(data.error || 'Error');

				setCount(data.count);
				sessionStorage.setItem('letterblog_visited', 'true');
			})
			.catch(() => setCount(null))
			.finally(() => setLoading(false));
	}, []);

	if (loading)
		return <StatusMessage message={t('home.loading')} />;

	if (count === null)
		return <StatusMessage message={t('errors.generic')} />;

	const paddedCount = String(count).padStart(6, '0');
	const digits = paddedCount.split('');

	return (
		<div className="flex flex-col items-center gap-[10px] pt-2">
			<div className="flex justify-center gap-[3px]">
				{digits.map((digit, index) => (
					<span key={index} className="rounded-[8px] border border-[var(--color-accent-soft)] bg-[var(--color-bg)] px-[6px] py-[6px] text-[24px] font-bold text-[var(--color-text)] [text-shadow:0_0_8px_var(--color-accent)]">
						{digit}
					</span>
				))}
			</div>

			<p className="pt-[5px] text-center text-[16px] font-semibold uppercase text-[var(--color-text)] [text-shadow:0_0_8px_var(--color-accent)]">{t('home.visitorCounterText')}</p>
			<div className="flex justify-center">
				<img src={Stickers} alt="thank-you" className="mt-2 h-auto w-[200px]" />
			</div>
		</div>
	);
}

export default VisitorCounter;