import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './VisitorCounter.css';

function VisitorCounter() {

	const { t } = useTranslation();
	const [count, setCount] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const hasFetched = useRef(false); //evite le probleme de +2 a chaque visite a cause de StrictMode

	useEffect(() => {
		if (hasFetched.current)
			return;

		hasFetched.current = true;

		const alreadyCounted = sessionStorage.getItem('letterblog_visited');

		let url = '/api/visitors/count';
		let method = 'GET';

		if (!alreadyCounted)
        {
			url = '/api/visitors/increment';
			method = 'POST';
		}

		fetch(url, { method })
			.then(async (res) =>
            {
				const data = await res.json();
				if (!res.ok)
					throw (new Error(data.error || 'Error'));

				setCount(data.count);
				sessionStorage.setItem('letterblog_visited', 'true');
			})
			.catch(() => setCount(null))
			.finally(() => setLoading(false));
	}, []);

	if (loading)
		return (<p className="visitor-counter-status">{t('home.loading')}</p>);
    
	if (count === null)
		return (<p className="visitor-counter-status">{t('home.noRecommendation')}</p>);

    //cree le compteur mecanique des visites
	const paddedCount = String(count).padStart(6, '0');
	const digits = paddedCount.split('');

	return (
        <div className="visitor-counter-wrapper">
            <div className="visitor-counter">
                {digits.map((digit, index) => (
                    <span key={index} className="visitor-counter-digit">{digit}</span>
                ))}
            </div>

            <p className="visitor-counter-text">
                {t('home.visitorCounterText')}
            </p>
        </div>
    );
}

export default VisitorCounter;