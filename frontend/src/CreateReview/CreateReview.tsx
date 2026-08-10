import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateReview.css";

interface Props {
    triggerToast: (message: string, icon?: string) => void;
}

const CreateReview = ({ triggerToast }: Props) => {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRatingClick = (star: number, half: boolean) => {
        setRating(half ? star - 0.5 : star);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !content.trim()) {
            triggerToast("Rating and review are required", "⚠️");
            return;
        }

        if (rating < 0.5 || rating > 5) {
            triggerToast("Rating must be between 0.5 and 5", "⚠️");
            return;
        }

        const token = localStorage.getItem("token");

        setLoading(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    movie_id: Number(movieId),
                    rating,
                    content: content.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Error ${res.status}`);
            }

            triggerToast("Review posted successfully", "🎬");

            setTimeout(() => {
                navigate(-1);
            }, 500);
        } catch (error: any) {
            console.error(error);

            triggerToast(
                error.message || "Unable to post review",
                "⚠️"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-review-page">

            <div className="create-review-card">

                <h1 className="create-review-title">
                    Write a Review
                </h1>

                <form
                    className="create-review-form"
                    onSubmit={handleSubmit}
                >

                    <div className="create-review-field">

                        <label>
                            Your rating
                        </label>

                        <div className="create-review-rating">

                            {[1, 2, 3, 4, 5].map((star) => (

                                <div
                                    key={star}
                                    className="rating-star-wrapper"
                                >

                                    <span
                                        className={`rating-star-left ${
                                            rating >= star - 0.5
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleRatingClick(star, true)
                                        }
                                    >
                                        ★
                                    </span>

                                    <span
                                        className={`rating-star-right ${
                                            rating >= star
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleRatingClick(star, false)
                                        }
                                    >
                                        ★
                                    </span>

                                </div>

                            ))}

                        </div>

                        <p className="rating-value">
                            {rating > 0
                                ? `${rating} / 5`
                                : "Choose your rating"}
                        </p>

                    </div>

                    <div className="create-review-field">

                        <label htmlFor="review-content">
                            Your review
                        </label>

                        <textarea
                            id="review-content"
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            placeholder="Write your review..."
                            rows={7}
                        />

                    </div>

                    <div className="create-review-buttons">

                        <button
                            type="button"
                            className="create-review-cancel"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-review-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Posting..."
                                : "Post Review"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateReview;

