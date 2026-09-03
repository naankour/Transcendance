// composant qui affiche une conversation 
// utilise GET /api/conversations/:id/messages (getMessages)
// écoute les nouveaux messages en temps réel
// envoie des messages

import {useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { socket } from '../../socket';
import { refreshUnreadCount } from '../notification'
import './ChatBubble.css'

interface Sender {
  id: number;
  username: string;
  avatar_url: string | null;
}

interface Message {
  id: number;
  content: string;
  created_at: string;
  sender: Sender;
}

interface ChatWindowProps {
    conversationId: number;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');

  const token = localStorage.getItem('token');
  let myId: number | null = null;
  if (token) {
    try {
      myId = jwtDecode<{ id: number }>(token).id;
    }
    catch (e) {
      console.error('Invalid Token :', e);
    }
  }

    async function fetchMessages() {
    try {
      const token = localStorage.getItem('token');

      const request = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!request.ok) {
        throw new Error(`Erreur HTTP ${request.status}`);
      }
      
      const data = await request.json();
      setMessages(data);
    }
    
    catch (error) {
        console.error(error);
    }
    finally {
        setLoading(false);
        }
    }

    async function markAsRead() {
      try {
        await fetch(`/api/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        refreshUnreadCount();
      }
      catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
        setLoading(true);
        fetchMessages().then(() => markAsRead());
        
        socket.emit('joinConversation', conversationId);

        function handleNewMessage(message: Message) {
          setMessages((prev) => [...prev, message]);

          if (message.sender.id !== myId)
          {
            markAsRead();
          }
        }
    
        socket.on('newMessage', handleNewMessage);
        return() => {
          socket.emit('leaveConversation', conversationId);
          socket.off('newMessage', handleNewMessage);
        }
    }, [conversationId]);

    async function handleSend() {
      if (!newMessage.trim())
        return;

    try {
      const token = localStorage.getItem('token');

      const request = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });
      
      if (!request.ok){
        throw new Error(`Erreur HTTP ${request.status}`);
      }
      setNewMessage('');

    } catch (error) {
      console.error(error);
    }
  }
    if (loading) {
        return <div className="chat-window-loading">Loading messages...</div>;
    }

    return (
      <div className="chat-window">
        <div className="chat-window-messages">
      {messages.map((message) => {
        const isOwn = message.sender.id === myId;
        

        return (
            <div key={message.id} className={`chat-message-row ${isOwn ? 'own' : 'other'}`}>
              {!isOwn && <p className="chat-message-sender">{message.sender.username}</p>}
              <div className="chat-message-bubble">{message.content}</div>
            </div>
          );
    })}
     </div>

      <div className="chat-window-input-bar">
       <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') 
            handleSend();
        }}
        placeholder="Write a Message..."
        />
        <button className="chat-window-send-btn" onClick={handleSend}>Send ✦</button>
      </div>
     </div>
    );
}