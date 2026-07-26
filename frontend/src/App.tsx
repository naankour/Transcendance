import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import { Auth } from './auth/AuthPage';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import Follows from './pages/Follows';
import Reviews from './pages/Reviews'
import CreateReview from './pages/CreateReview'
import EditReview from './pages/EditReview'
import Genres from './pages/Genres'
import GenreMovies from './pages/GenreMovies'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/follows" element={<Follows />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/create" element={<CreateReview />} />
        <Route path="/reviews/:id/edit" element={<EditReview />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/genres/:id" element={<GenreMovies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;