import { useTranslation } from 'react-i18next';
import HomeModule from './components/HomeModule';
import DailyRecommendation from './components/DailyRecommendation';
import VisitorCounter from './components/VisitorCounter';
import FriendsActivity from './components/FriendsActivity';
import ProfilePreview from './components/ProfilePreview';
import LatestReviews from './components/LatestReviews';
import './styles/HomePage.css';

function HomePage() {
	const { t } = useTranslation();

	return (
		<div className="home-grid">
			<div className='right-column'>
				<HomeModule title={t('home.aboutMe')}>
					<ProfilePreview />
				</HomeModule>
				<HomeModule title={t('home.dailyPick')}>
					<DailyRecommendation />
				</HomeModule>
				<HomeModule title={t('home.visitorCount')}>
					<VisitorCounter />
				</HomeModule>
			</div>
			<div className='middle-column'>
				<HomeModule title={t('home.latestReviews')}>
					<LatestReviews />
				</HomeModule>
			</div>
			<div className='left-column'>
			<HomeModule title={t('home.friendsActivity')}>
				<FriendsActivity />
			</HomeModule>
			</div>
		</div>
	);
}

export default HomePage;