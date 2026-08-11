import { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://localhost", {
  transports: ["websocket"]
});

// const3 socket = io("http://localhost:3000", {
//   transports: ["websocket"]
// });

// socket.on("connect", () => {
//   console.log("Socket connecté :", socket.id);
// });

// socket.on("connect_error", (error) => {
//   console.log("Erreur socket :", error.message);
// });

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import { Auth } from './auth/AuthPage';
import { Toast } from './auth/Toast';
import { ProfilePage } from './user/ProfilePage'; 
// import ConversationPage from './conversations/ConversationPage';
import Watchlist from './Watchlist/Watchlist';
import Favorites from './Favorites/Favorites';
import Follows from './Follows/Follows';
import Followers from './Followers/Followers';
import MyReviews from './MyReviews/MyReviews'
import Reviews from './Reviews/Reviews'
import CreateReview from './pages/CreateReview'
import EditReview from './pages/EditReview'
// import ActorSearchPage from './ActorSearchPage';
// import ActorPage from './ActorPage';
import Discover from './pages/Discover'
// import GenreMovies from './pages/GenreMovies'
// import ActorSearchPage from './pages/ActorSearchPage';
import ActorPage from './pages/ActorPage';
import Header from './layout/Header';
import SearchResultsPage from './pages/SearchResultsPage';

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Footer from './layout/Footer';
import './App.css';

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

  useEffect(() => {

    socket.on("reviewCreated", (data) => {
      triggerToast(`${data.author} published a new review !`, "⭐"); });
    
    return () => 
      {socket.off("reviewCreated");}; 
    
    }, []);

return (
  <BrowserRouter>
    <div className="app">
      <Toast message={toastMessage} icon={toastIcon} />

      <Header />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/auth" element={<Auth triggerToast={triggerToast} />} />
          <Route path="/profile" element={<ProfilePage triggerToast={triggerToast} />} />
          <Route path="/profile/:id" element={<ProfilePage triggerToast={triggerToast} />} />
          <Route path="/watchlist" element={<Watchlist triggerToast={triggerToast} />} />
          <Route path="/favorites" element={<Favorites triggerToast={triggerToast} />} />
          <Route path="/follows" element={<Follows triggerToast={triggerToast} />} />
          <Route path="/follows/followers" element={<Followers triggerToast={triggerToast} />} />
		  <Route path="/reviews" element={<Reviews />} />
		  <Route path="/reviews/me" element={<MyReviews />} />
		  <Route path="/reviews/create" element={<CreateReview />} />
		  <Route path="/reviews/:id/edit" element={<EditReview />} />
          <Route path="/search/:query" element={<SearchResultsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/actor/:id" element={<ActorPage />} />
          <Route path="/discover" element={<Discover />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </BrowserRouter>
);

}

export default App;