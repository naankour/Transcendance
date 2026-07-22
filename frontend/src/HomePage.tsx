import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!id.trim()) return;
    navigate(`/movie/${id.trim()}`);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <h1>Recherche de film par ID</h1>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="ID TMDB du film (ex: 27205)..."
        style={{ padding: 8, width: '70%', fontSize: 16 }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: 16, marginLeft: 8 }}>
        Rechercher
      </button>
    </div>
  );
}

export default HomePage;