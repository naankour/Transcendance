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
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import Follows from './pages/Follows';
import Reviews from './pages/Reviews'
import CreateReview from './pages/CreateReview'
import EditReview from './pages/EditReview'
import ActorSearchPage from './ActorSearchPage';
import ActorPage from './ActorPage';
import Discover from './pages/Discover'
// import GenreMovies from './pages/GenreMovies'

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
      <Toast message={toastMessage} icon={toastIcon} />
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
		    <Route path="/actors" element={<ActorSearchPage />} />
		    <Route path="/actor/:id" element={<ActorPage />} />
        <Route path="/discover" element=
        {<Discover />} />
        {/* <Route path="/genres/:id" element={<GenreMovies />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;