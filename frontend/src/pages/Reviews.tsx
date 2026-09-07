import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const Reviews = () => {
  const { t } = useTranslation()
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
      <h1>{t('reviewsSimple.title')}</h1>
      {reviews.map((item: any) => (
        <div key={item.id}>
          <p>{t('reviewsSimple.movieId')} : {item.movie_id}</p>
          <p>{t('reviewsSimple.rating')} : {item.rating}/5</p>
          <p>{t('reviewsSimple.content')} : {item.content}</p>
          <a href={`/reviews/${item.id}/edit`}>{t('reviewsSimple.edit')}</a>
        </div>
      ))}
    </div>
  )
}

export default Reviews