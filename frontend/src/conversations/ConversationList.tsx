// composant qui liste les conversations d'un user
// utilise GET /api/conversations (getMyConversations)

import {useState, useEffect} from 'react';
import { socket } from '../../socket';
import './ChatBubble.css'

interface User {
  id: number;
  username: string;
  avatar_url: string | null;
}

interface Message {
  id: number;
  content: string;
  created_at: string;
}

interface Conv {
  id: number;
  otherUser: User;
  lastMessage: Message | null;
  updated_at: string;
}

interface ConversationListProps {
  selectedConversationId: number | null;
  onSelect: (conversationId: number) => void;
}

export default function ConversationList({ selectedConversationId, onSelect }: ConversationListProps) {
    
    const [conversation, setConversation] = useState<Conv[]>([]);

    async function fetchConversations() {
  try {
    const token = localStorage.getItem('token');

        console.log("TOKEN :", token);

    const request = await fetch('/api/conversations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("STATUS :", request.status);

    const data = await request.json();

    console.log("DATA CONVERSATIONS :", data);

    if (!request.ok) {
      throw new Error(`Erreur HTTP ${request.status}`);
    }

    
    setConversation(data);
  } catch (error) {
    console.error(error);
  }
}

    useEffect(() =>{
    fetchConversations();

    socket.on('conversationUpdated', fetchConversations);

      return () => {
        socket.off('conversationUdpdated', fetchConversations);
      };
    }, []);

    return (
    <div>
      {conversation.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`chat-bubble-list-item ${conv.id === selectedConversationId ? 'active' : ''}`}
        >
          <img
            src={conv.otherUser.avatar_url || '/avatars/default_avatar.png'}
            alt={conv.otherUser.username}
            className="chat-bubble-avatar"
          />
          <p className="chat-bubble-list-name">{conv.otherUser.username}</p>

          {conv.lastMessage && ( <p className="chat-bubble-list-preview">{conv.lastMessage.content}</p>)}
        </div>
      ))}
    </div>
  );
}