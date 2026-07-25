import { useState, useEffect } from 'react'
import axios from 'axios'

const Reviews = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    axios.get('/api/reviews')
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Mes Reviews</h1>
      {reviews.map((item: any) => (
        <div key={item.id}>
          <p>Film ID : {item.movie_id}</p>
          <p>Note : {item.rating}/5</p>
          <p>Contenu : {item.content}</p>
          <a href={`/reviews/${item.id}/edit`}>Modifier</a>
        </div>
      ))}
    </div>
  )
}

export default Reviews