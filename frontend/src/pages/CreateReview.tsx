import { useState } from 'react'
import axios from 'axios'

const CreateReview = () => {
  const [movieId, setMovieId] = useState('')
  const [rating, setRating] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {

    const token = localStorage.getItem('token');

    axios.post('/api/reviews', {
    movie_id: parseInt(movieId),
    rating: parseFloat(rating),
    content: content
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(() => setMessage('Review créée !'))
    .catch(err => setMessage('Erreur : ' + err.message))
  }

  return (
    <div>
      <h1>Créer une Review</h1>
      <input placeholder="Movie ID" value={movieId} onChange={e => setMovieId(e.target.value)} />
      <input placeholder="Note (0.5 - 5)" value={rating} onChange={e => setRating(e.target.value)} />
      <textarea placeholder="Votre review..." value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSubmit}>Envoyer</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreateReview