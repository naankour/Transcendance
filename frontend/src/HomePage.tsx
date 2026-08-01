import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!name.trim()) return;
    setError(null);

    try {
      const res = await fetch(`/api/movies/search/${encodeURIComponent(name.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Film introuvable');
        return;
      }

      navigate(`/movie/${data.id}`);
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      <h1>Recherche de film par nom</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Nom du film (ex: Dune)..."
        style={{ padding: 8, width: '70%', fontSize: 16 }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: 16, marginLeft: 8 }}>
        Rechercher
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default HomePage;