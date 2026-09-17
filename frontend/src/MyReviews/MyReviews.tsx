import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./MyReviews.css";
import { Link } from "react-router-dom";

const MyReviews = () => {
    const { t } = useTranslation();
    const [myreviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/reviews/me', {
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
            setMyReviews(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p className="myreviews-loading">{t('myReviews.loading')}</p>;
    if (error) return <p className="myreviews-error">{t('myReviews.error', { message: error })}</p>;

    return (
        <div className="myreviews-page">
            <h1 className="myreviews-title">{t('myReviews.title')}</h1>

            {myreviews.length === 0 ? (
                <p className="myreviews-empty">
                    {t('myReviews.empty')}
                </p>
            ) : (
                <div className="myreviews-list">
                    {myreviews.map((review: any) => (

                    <div key={review.id} className="myreviews-card">

                        <Link to={`/movie/${review.movies.tmdb_id}`} className="link">
                            <img
                                src={review.movies.poster}
                                alt={review.movies.title}
                                className="myreviews-poster"
                            />
                        </Link>

                        <div className="myreviews-info">

                            <Link to={`/movie/${review.movies.tmdb_id}`} className="link">
                                <h2 className="myreviews-movie-title">
                                    {review.movies.title}
                                </h2>
                            </Link>

                                <p className="myreviews-content">
                                    {review.content}
                                </p>

                                <p className="myreviews-rating">
                                    {t('myReviews.rating')} : {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;