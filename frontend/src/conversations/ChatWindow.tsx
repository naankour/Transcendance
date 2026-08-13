// composant qui affiche une conversation 
// utilise GET /api/conversations/:id/messages (getMessages)
// écoute les nouveaux messages en temps réel
// envoie des messages

import {useState, useEffect} from 'react';

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
    useEffect(() => {
        setLoading(true);
        fetchMessages();
    
    }, [conversationId]);

    if (loading) {
        return <div> Chargement des messages...</div>;
    }

    return (
        <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender.username}</strong>: {message.content}
        </div>
      ))}
     </div>
    );
}