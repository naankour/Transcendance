import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import MoviePage from './MoviePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;