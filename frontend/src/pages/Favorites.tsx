import { useState, useEffect } from 'react'
import axios from 'axios'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('/api/favorites', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(res => setFavorites(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Mes Favoris</h1>
      {favorites.map((item: any) => (
        <div key={item.id}>
          <p>Film ID : {item.movie_id}</p>
        </div>
      ))}
    </div>
  )
}

export default Favorites