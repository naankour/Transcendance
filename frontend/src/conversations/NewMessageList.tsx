import { useState, useEffect } from 'react';
import './ChatBubble.css'

interface FollowedUser {
    id: number;
    username: string;
    avatar_url: string | null;
}

interface NewMessageListProps {
    onConversationStarted: (conversationId: number) => void;
}

export default function NewMessageList({ onConversationStarted }: NewMessageListProps) {
    const [follows, setFollows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('/api/follows', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setFollows(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    async function handleStartConversation(otherUserId: number) {
        try {
            const token = localStorage.getItem('token');

            const request = await fetch('/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ otherUserId }),
            });

            const conversation = await request.json();

            if (!request.ok)
            {
                throw new Error(conversation.error || 'Failed to start conversation');
            }
            
            onConversationStarted(conversation.id);
        }
        catch (error)
        {
            console.error(error);
        }
    }
    
    if (loading) {
        return <p className="chat-bubble-empty">Loading...</p>
    }

    if (follows.length === 0) {
        return <p className="chat-bubble-empty">You're following nobody at the moment ✦</p>;
    }

    return (
        <div>
            {follows.map((item: any) => {
                const followedUser: FollowedUser = item.users_follows_followed_idTousers;

            return (
                <div
                key={followedUser.id}
                onClick={() => handleStartConversation(followedUser.id)}
                className="chat-bubble-list-item"
                >
                <img 
                    src={followedUser.avatar_url || '/avatars/default_avatar.png'}
                    alt={followedUser.username}
                    className="chat-bubble-avatar"
                />
                <p className="chat-bubbke-list-name">{followedUser.username}</p>
                </div>
            );
            })}
        </div>
    );
}