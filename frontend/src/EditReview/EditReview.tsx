import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditReview.css";

interface Props {
    triggerToast: (message: string, icon?: string) => void;
}

const EditReview = ({ triggerToast }: Props) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`/api/reviews/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || `Error ${res.status}`);
                }

                return data;
            })
            .then((data) => {
                setRating(Number(data.rating));
                setContent(data.content);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                triggerToast(error.message, "⚠️");
                setLoading(false);
            });
    }, [id, triggerToast]);

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
            triggerToast(
                "Rating must be between 0.5 and 5",
                "⚠️"
            );
            return;
        }

        const token = localStorage.getItem("token");

        setSaving(true);

        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating,
                    content: content.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Error ${res.status}`);
            }

            triggerToast("Review updated successfully", "✏️");

            setTimeout(() => {
                navigate(-1);
            }, 500);
        } catch (error: any) {
            console.error(error);

            triggerToast(
                error.message || "Unable to update review",
                "⚠️"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="edit-review-page">

            <div className="edit-review-card">

                <h1 className="edit-review-title">
                    Edit Review
                </h1>

                <form
                    className="edit-review-form"
                    onSubmit={handleSubmit}
                >

                    <div className="edit-review-field">

                        <label>
                            Your rating
                        </label>

                        <div className="edit-review-rating">

                            {[1, 2, 3, 4, 5].map((star) => (

                                <div
                                    key={star}
                                    className="edit-rating-star-wrapper"
                                >

                                    <span
                                        className={`edit-rating-star-left ${
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
                                        className={`edit-rating-star-right ${
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

                        <p className="edit-rating-value">
                            {rating > 0
                                ? `${rating} / 5`
                                : "Choose your rating"}
                        </p>

                    </div>

                    <div className="edit-review-field">

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

                    <div className="edit-review-buttons">

                        <button
                            type="button"
                            className="edit-review-cancel"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-review-submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Update Review"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditReview;

