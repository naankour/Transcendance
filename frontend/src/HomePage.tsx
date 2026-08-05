import { useTranslation } from 'react-i18next';
import HomeModule from './components/HomeModule';
import DailyRecommendation from './components/DailyRecommendation';
import './styles/HomePage.css';

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

function HomePage() {
	// const [id, setId] = useState('');
	// const navigate = useNavigate();

	// const handleSearch = () => {
	// 	if (!id.trim()) return;
	// 	navigate(`/movie/${id.trim()}`);
	//   };
	
	//   return (
	// 	<div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
	
	// 	  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
	// 		<h1>Recherche de film</h1>
	// 		<button 
	// 		  onClick={() => navigate('/profile')} 
	// 		  style={{ padding: '8px 16px', fontSize: 16, cursor: 'pointer' }}
	// 		>
	// 		  Mon Profil
	// 		</button>
	// 	  </div>
	
	// 	  <input
	// 		type="text"
	// 		value={id}
	// 		onChange={(e) => setId(e.target.value)}
	// 		onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
	// 		placeholder="ID TMDB du film (ex: 27205)..."
	// 		style={{ padding: 8, width: '70%', fontSize: 16 }}
	// 	  />
	// 	  <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: 16, marginLeft: 8 }}>
	// 		Rechercher
	// 	  </button>
	// 	</div>
	//   );

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