import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthRequired from '../components/AuthRequired';

interface FollowedUser {
    id: number;
    username: string;
    avatar_url: string | null;
}

interface NewMessageListProps {
    onConversationStarted: (conversationId: number) => void;
}

export default function NewMessageList({ onConversationStarted }: NewMessageListProps) {
    const { t } = useTranslation();
    const [follows, setFollows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthError, setIsAuthError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token)
        {
            setIsAuthError(true);
            setLoading(false);
            return; 
        }

        fetch('/api/follows', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) =>
                {
                if (res.status === 401 || res.status === 403) {
                setIsAuthError(true);
                throw new Error('Unauthorized');
                }
                return res.json();
            })
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
    
    if (isAuthError) {
    return <AuthRequired />;
    }
    
    if (loading) {
        return (
      <p className="p-[20px] text-center text-[18px] text-brand-white/60">
        {t('newMessageList.loading')}
      </p>
    );

    }

    if (follows.length === 0) {
        return (
      <p className="p-[20px] text-center text-[18px] text-brand-white/60">
        {t('newMessageList.empty')}
      </p>
    );
    }

    return (
    <div>
      {follows.map((item: any) => {
        const followedUser: FollowedUser = item.users_follows_followed_idTousers;

        return (
          <div
            key={followedUser.id}
            onClick={() => handleStartConversation(followedUser.id)}
            className="flex items-center gap-[10px] px-[10px] py-[8px] cursor-pointer border-b border-brand-white/8 transition-colors duration-150 hover:bg-brand-pink/15"
          >
            <img
              src={followedUser.avatar_url || '/avatars/default_avatar.png'}
              alt={followedUser.username}
              className="size-[40px] shrink-0 rounded-full object-cover border-2 border-brand-pink-soft shadow-[0_0_6px_var(--color-brand-pink-soft)]"
            />
            <p className="text-[18px] text-brand-white">{followedUser.username}</p>
          </div>
        );
      })}
    </div>
  );
}