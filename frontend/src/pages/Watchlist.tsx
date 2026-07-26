import { useState, useEffect } from 'react'
import axios from 'axios'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    axios.get('/api/watchlist')
      .then(res => setWatchlist(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Ma Watchlist</h1>
      {watchlist.map((item: any) => (
        <div key={item.id}>
          <p>Film ID : {item.movie_id}</p>
        </div>
      ))}
    </div>
  )
}

export default Watchlist