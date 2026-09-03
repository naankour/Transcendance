import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode';

export const socket = io("https://localhost", {
    transports: ["websocket"]
});

const token = localStorage.getItem('token');
if (token) {
    try {
        const { id } = jwtDecode<{ id: number }>(token);
        socket.on('connect', () => {
            socket.emit('identify', id);
        });
    }
    catch (e) 
    {
        console.error('Invalid token (socket identify):', e);
    }
}