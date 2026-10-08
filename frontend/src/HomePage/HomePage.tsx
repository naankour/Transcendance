import { useTranslation } from 'react-i18next';
import HomeModule from '../components/HomeModule';
import DailyRecommendation from './DailyRecommendation';
import VisitorCounter from './VisitorCounter';
import FriendsActivity from './FriendsActivity';
import ProfilePreview from './ProfilePreview';
import LatestReviews from './LatestReviews';

function HomePage() {
	const { t } = useTranslation();

	return (
		<div className="m-5 flex min-h-[calc(100vh-250px)] flex-col gap-10 md:flex-row md:items-stretch md:justify-between max-[750px]:items-center max-[750px]:gap-[25px]">
			<div className="flex w-full flex-col gap-10 md:w-1/4 max-[750px]:gap-[25px]">
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
			<div className="flex w-full flex-col gap-10 md:w-1/2 max-[750px]:gap-[25px]">
				<HomeModule title={t('home.latestReviews')}>
					<LatestReviews />
				</HomeModule>
			</div>
			<div className="flex w-full flex-col gap-10 md:w-1/4 max-[750px]:gap-[25px]">
				<HomeModule title={t('home.friendsActivity')}>
					<FriendsActivity />
				</HomeModule>
			</div>
		</div>
	);
}

export default HomePage;