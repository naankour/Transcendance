import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./Reviews.css";
import UserCard from '../components/UserCard';
import { Link } from "react-router-dom";

const Reviews = () => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/reviews', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setReviews(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="reviews-loading">{t('reviews.loading')}</p>;
    if (error) return <p className="reviews-error">{t('reviews.error', { message: error })}</p>;

    return (
        <div className="reviews-page">
            <h1 className="reviews-title">{t('reviews.title')}</h1>

            {reviews.length === 0 ? (
                <p className="reviews-empty">
                    {t('reviews.empty')}
                </p>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review: any) => (

                        <div key={review.id} className="reviews-card">

                            <Link to={`/movie/${review.movies.tmdb_id}`} className="link">
                                <img
                                    src={review.movies.poster}
                                    alt={review.movies.title}
                                    className="reviews-poster"
                                />
                            </Link>

                            <Link to={`/profile/${review.users.id}`} className="link">
                                <UserCard 
                                    user={review.users}
                                    className="reviews-user"
                                />
                            </Link>

                            <div className="reviews-info">

                                <Link to={`/movie/${review.movies.tmdb_id}`} className="link">
                                    <h2 className="reviews-movie-title">
                                        {review.movies.title}
                                    </h2>
                                </Link>
                                <p className="reviews-content">
                                    {review.content}
                                </p>

                                <p className="reviews-rating">
                                    {t('reviews.rating')} : {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;