import { useTranslation } from 'react-i18next';
import HomeModule from './HomeModule';
import DailyRecommendation from './DailyRecommendation';
import VisitorCounter from './VisitorCounter';
import FriendsActivity from './FriendsActivity';
import ProfilePreview from './ProfilePreview';
import LatestReviews from './LatestReviews';
import './HomePage.css';

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