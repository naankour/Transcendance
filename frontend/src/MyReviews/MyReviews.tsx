import { useState, useEffect } from 'react';
import "./MyReviews.css";

const MyReviews = () => {
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

    if (loading) return <p className="myreviews-loading">Loading...</p>;
    if (error) return <p className="myreviews-error">Error : {error}</p>;

    return (
        <div className="myreviews-page">
            <h1 className="myreviews-title">My Reviews</h1>

            {myreviews.length === 0 ? (
                <p className="myreviews-empty">
                    You don't have any reviews yet
                </p>
            ) : (
                <div className="myreviews-list">
                    {myreviews.map((review: any) => (
                        <div key={review.id} className="review-card">
                            <h2 className="review-movie-title">
                                {review.movies.title}
                            </h2>
                            <p className="review-content">
                                {review.content}
                            </p>
                            <p className="review-rating">
                                Rating : {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;

