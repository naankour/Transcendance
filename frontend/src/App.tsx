import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import ActorSearchPage from './ActorSearchPage';
import ActorPage from './ActorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
		<Route path="/actors" element={<ActorSearchPage />} />
		<Route path="/actor/:id" element={<ActorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;