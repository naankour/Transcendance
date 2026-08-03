import { useState, useEffect } from 'react'
import "./Followers.css"
import FollowsButton from "../components/FollowsButton";

const Followers = () => {
    const [followers, setFollowers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('/api/follows/followers', {
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

            setFollowers(data);
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

            <h1 className="followers_title">
                My Followers
            </h1>

            {followers.length === 0 ? (
                <p className="followers-empty">
                    Your followers list is empty
                </p>
            ) : (

                <div className="followers-list">
                    {followers.map((item: any) => (
                        <div 
                            key={item.id} 
                            className="followers-card">

                                <h2>
                                    {item.users_follows_follower_idTousers.username}
                                </h2>
                                
                                <FollowsButton 
                                    userId={item.follower_id}
                                    action="follow" 
                                />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Followers;