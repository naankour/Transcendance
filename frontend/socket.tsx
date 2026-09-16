import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

export const socket = io("https://localhost", {
  transports: ["websocket"]
});

export function identifySocket() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const { id } = jwtDecode<{ id: number }>(token);

    if (socket.connected) {
      socket.emit('identify', id);
    } else {
      socket.once('connect', () => {
        socket.emit('identify', id);
      });
    }
  } catch (e) {
    console.error('Token invalide (socket identify):', e);
  }
}

identifySocket();