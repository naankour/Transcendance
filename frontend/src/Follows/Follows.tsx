import { useState, useEffect } from 'react'
import "./Follows.css"
import FollowsButton from "../components/FollowsButton";
import UserCard from '../components/UserCard';
import { Link } from "react-router-dom";


const Follows = ({ triggerToast }) => {
    const [follows, setFollows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const removeFollow = (userId:number) => 
    {
        setFollows(prev =>
            prev.filter(item => item.followed_id !== userId)
        );
    };


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

            <h1 className="follows-title">
                My Follows
            </h1>

            {follows.length === 0 ? (
                <p className="follows-empty">
                    You are not following anyone yet..
                </p>
            ) : (

                <div className="follows-list">
                    {follows.map((item: any) => (

                        <div 
                            key={item.id} 
                            className="follows-card">

                            <Link 
                                to={`/profile/${item.users_follows_followed_idTousers.id}`} 
                                className="link"
                            >
                                <div className="heart-avatar-wrapper">

                                    <img
                                        src={item.users_follows_followed_idTousers.avatar_url}
                                        alt={item.users_follows_followed_idTousers.username}
                                        className="follows-user-avatar"
                                    />

                                </div>
                            </Link>

                             <Link 
                                to={`/profile/${item.users_follows_followed_idTousers.id}`} 
                                className="link"
                            >

                                <h2 className="follows-user-username">
                                    {item.users_follows_followed_idTousers.username}
                                </h2>
                            </Link>

                            <FollowsButton
                                userId={item.followed_id}
                                action="unfollow"
                                triggerToast ={triggerToast}
                                onSuccess={() => removeFollow(item.followed_id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Follows;