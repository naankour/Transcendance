import { useTranslation } from 'react-i18next';
import HomeModule from './components/HomeModule';
import DailyRecommendation from './components/DailyRecommendation';
import './styles/HomePage.css';

function HomePage() {
	const { t } = useTranslation();

	return (
		<div className="home-grid">
			<div className='right-column'>
				<HomeModule title={t('home.dailyPick')}>
					<DailyRecommendation />
				</HomeModule>
			</div>
			<div className='middle-column'>
				<HomeModule title="Reviews">
					<p>test</p>
				</HomeModule>
			</div>
			<div className='left-column'>
				<HomeModule title="Friends activity">
					<p>test</p>
				</HomeModule>
			</div>
		</div>
	);
}

export default HomePage;