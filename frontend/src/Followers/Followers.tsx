import { useState, useEffect } from 'react'
import "./Followers.css"
import FollowsButton from "../components/FollowsButton";
import { Link } from "react-router-dom";

const Followers = () => {
    const [followers, setFollowers] = useState([])
    const [myFollows, setMyFollows] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token');

        Promise.all([
            fetch('/api/follows', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            }),

            fetch('/api/follows/followers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
        ])
        .then(([followsData, followersData]) => {
            setMyFollows(followsData);
            setFollowers(followersData);
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
        <div className="followers-page">

            <h1 className="followers-title">
                My Followers
            </h1>

            {followers.length === 0 ? (
                <p className="followers-empty">
                    You don't have any followers yet.
                </p>
            ) : (
                <div className="followers-list">
                    {followers.map((item: any) => {

                        const alreadyFollowing = myFollows.some(
                            (follow: any) => follow.followed_id === item.follower_id
                        );

                        return (
                            <div key={item.id} className="followers-card">

                                <Link
                                    to={`/profile/${item.users_follows_follower_idTousers.id}`}
                                    className="link"
                                >
                                    <div className="heart-avatar-wrapper">
                                        <img
                                            src={item.users_follows_follower_idTousers.avatar_url}
                                            alt={item.users_follows_follower_idTousers.username}
                                            className="followers-user-avatar"
                                        />
                                    </div>
                                </Link>

                                <h2 className="followers-user-username">
                                    {item.users_follows_follower_idTousers.username}
                                </h2>

                                <FollowsButton
                                    userId={item.follower_id}
                                    action={alreadyFollowing ? "unfollow" : "follow"}
                                />

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Followers;