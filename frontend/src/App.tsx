import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import { Auth } from './auth/AuthPage';
import { Toast } from './auth/Toast';
import { ProfilePage } from './user/ProfilePage'; 
// import ConversationPage from './conversations/ConversationPage';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import Follows from './pages/Follows';
import Reviews from './pages/Reviews'
import CreateReview from './pages/CreateReview'
import EditReview from './pages/EditReview'
// import ActorSearchPage from './pages/ActorSearchPage';
import ActorPage from './pages/ActorPage';
import Header from './layout/Header';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {

  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('💾');

  const triggerToast = (msg, icon = '💾') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  return (
    <BrowserRouter>
      <Toast message={toastMessage} icon={toastIcon} />
	  <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/auth" element={<Auth triggerToast={triggerToast} />} />
        <Route path="/profile" element={<ProfilePage triggerToast={triggerToast} />} />
        <Route path="/profile/:id" element={<ProfilePage triggerToast={triggerToast} />} />
        {/* <Route path="/chat" element={<ConversationPage triggerToast={triggerToast} />} /> */}
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/create" element={<CreateReview />} />
        <Route path="/reviews/:id/edit" element={<EditReview />} />
		<Route path="/search/:query" element={<SearchResultsPage />} />

		    {/* <Route path="/actors" element={<ActorSearchPage />} /> */}
		<Route path="/actor/:id" element={<ActorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;