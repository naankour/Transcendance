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

      navigate(`/movie/${data.tmdb_id}`); // 👈 tmdb_id, pas id
    } catch (err) {
      setError('Erreur serveur');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: '0 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Recherche de film</h1>
        <button 
          onClick={() => navigate('/profile')} 
          style={{ padding: '8px 16px', fontSize: 16, cursor: 'pointer' }}
        >
          Mon Profil
        </button>
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Name of movie (ex: Dune)..."
        style={{ padding: 8, width: '70%', fontSize: 16 }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px', fontSize: 16, marginLeft: 8 }}>
        Rechercher
      </button>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default HomePage;