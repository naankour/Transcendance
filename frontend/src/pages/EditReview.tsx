import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const EditReview = () => {
  const { id } = useParams()
  const { t } = useTranslation()
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
    .then(() => setMessage(t('editReview.updated')))
    .catch(err => setMessage(t('editReview.error', { message: err.message })))
  }

  const handleDelete = () => {
    axios.delete(`/api/reviews/${id}`)
    .then(() => setMessage(t('editReview.deleted')))
    .catch(err => setMessage(t('editReview.error', { message: err.message })))
  }

  return (
    <div>
      <h1>{t('editReview.title')}</h1>
      <input placeholder={t('editReview.ratingPlaceholder')} value={rating} onChange={e => setRating(e.target.value)} />
      <textarea placeholder={t('editReview.contentPlaceholder')} value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleUpdate}>{t('editReview.update')}</button>
      <button onClick={handleDelete}>{t('editReview.delete')}</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default EditReview