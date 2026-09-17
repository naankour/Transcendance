import { useState, useEffect } from 'react';
import { socket } from '../../socket';

interface OnlineStatusProps {
    userId: number;
}

export default function OnlineStatus({ userId }: OnlineStatusProps)
{
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        fetch(`/api/users/${userId}/online-status`)
        .then((res) => res.json())
        .then((data) => setIsOnline(data.isOnline))
        .catch((err) => console.error(err));

        function handleUserOnline(data: { userId: number}) {
            if (data.userId === userId)
                setIsOnline(true);
        }

        function handleUserOffline(data: { userId: number })
        {
            if (data.userId === userId)
                setIsOnline(false);
        }

        socket.on('userOnline', handleUserOnline);
        socket.on('userOffline', handleUserOffline);

        return () => {
            socket.off('userOnline', handleUserOnline);
            socket.off('userOffline', handleUserOffline);
        };
    }, [userId]);

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
            <span
                style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isOnline ? '#2ecc71' : '#888',
                    display: 'inline-block',
                }}
                />
            <span style={{ fontSize: '14px', color: isOnline ? '#2ecc71' : '#888' }}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
        </span>
    );
}