import { useState, useEffect } from 'react';
import "./Reviews.css";
import UserCard from '../components/UserCard';
import { Link } from "react-router-dom";

const Reviews = () => {
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

    if (loading) return <p className="reviews-loading">Loading...</p>;
    if (error) return <p className="reviews-error">Error : {error}</p>;

    return (
        <div className="reviews-page">
            <h1 className="reviews-title"> All Reviews</h1>

            {reviews.length === 0 ? (
                <p className="reviews-empty">
                    You don't have any reviews yet
                </p>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review: any) => (

                        <div key={review.id} className="reviews-card">

                            <img
                                src={review.movies.poster}
                                alt={review.movies.title}
                                className="reviews-poster"
                            />
                            <Link to={`/profile/${review.users.id}`} className="link">
                                <UserCard 
                                    user={review.users}
                                    className="reviews-user"
                                />
                            </Link>

                            <div className="reviews-info">

                                <h2 className="reviews-movie-title">
                                    {review.movies.title}
                                </h2>

                                <p className="reviews-content">
                                    {review.content}
                                </p>

                                <p className="reviews-rating">
                                    Rating : {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
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