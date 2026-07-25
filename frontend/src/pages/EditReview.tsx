import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const EditReview = () => {
  const { id } = useParams()
  const [rating, setRating] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api/reviews')
      .then(res => {
        const review = res.data.find((r: any) => r.id === parseInt(id!))
        if (review) {
          setRating(review.rating)
          setContent(review.content)
        }
      })
  }, [id])

  const handleUpdate = () => {
    axios.put(`/api/reviews/${id}`, {
      rating: parseFloat(rating),
      content: content
    })
    .then(() => setMessage('Review modifiée !'))
    .catch(err => setMessage('Erreur : ' + err.message))
  }

  const handleDelete = () => {
    axios.delete(`/api/reviews/${id}`)
    .then(() => setMessage('Review supprimée !'))
    .catch(err => setMessage('Erreur : ' + err.message))
  }

  return (
    <div>
      <h1>Modifier la Review</h1>
      <input placeholder="Note (0.5 - 5)" value={rating} onChange={e => setRating(e.target.value)} />
      <textarea placeholder="Votre review..." value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleUpdate}>Modifier</button>
      <button onClick={handleDelete}>Supprimer</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default EditReview