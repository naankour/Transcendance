import { useState, useEffect } from 'react'
import "./Follows.css"
import FollowsButton from "../components/FollowsButton";

const Follows = () => {
    const [follows, setFollows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('/api/follows', {
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

            setFollows(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError(err.message);
            setLoading(false);
        });

    }, []);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error : {error}</p>

    return (
        <div className="follows-page">

            <h1 className="follows_title">
                My Follows
            </h1>

            {follows.length === 0 ? (
                <p className="followers-empty">
                    You don't have any followers yet.
                </p>
            ) : (

                <div className="follows-list">
                    {follows.map((item: any) => (
                        <div 
                            key={item.id} 
                            className="follow-card">

                                <h2>
                                    {item.users_follows_followed_idTousers.username}
                                </h2>
                            
                            <FollowsButton
                                userId={item.followed_id}
                                action="unfollow"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Follows;