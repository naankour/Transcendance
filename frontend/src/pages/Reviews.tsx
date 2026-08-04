import { useState, useEffect } from 'react'
import axios from 'axios'

const Reviews = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('/api/reviews', {
      headers: {
        Authorization: `Bearer ${token}`
    }
  })
      .then(res => {setReviews(res.data); console.log(res.data)})
      .catch(err => console.error(err))
  }, [])

  console.log("here")
  return (
    <div>
      <h1>Mes Review</h1>
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