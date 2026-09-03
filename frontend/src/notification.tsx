type Listener = (count: number) => void;

let unreadCount = 0;
const listeners: Listener[] = [];

export function getUnreadCount() {
    return unreadCount;
}

export function setUnreadCount(count: number) {
    unreadCount = count;
    listeners.forEach((listener) => listener(unreadCount));
}

export function subscribeUnreadCount(listener: Listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1)
            listeners.splice(index, 1);
    };
}

export async function refreshUnreadCount() {
    try {
        const token = localStorage.getItem('token');
        const request = await fetch('/api/conversations/unread-count', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await request.json();
        setUnreadCount(data.count);
    }
    catch (error) {
        console.error(error);
    }
}