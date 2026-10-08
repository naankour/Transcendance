import {useState, useEffect} from 'react';
import { socket } from '../../socket';

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

    async function fetchConversations() 
    {
      const token = localStorage.getItem('token');

      if (!token) 
      {
        setConversation([]);
        return;
      }
    
    try 
    {
    const request = await fetch('/api/conversations', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!request.ok) 
    {
      throw new Error(`Erreur HTTP ${request.status}`);
    }

    const data = await request.json();
    setConversation(data);
  } 
  catch (error) 
  {
    console.error(error);
  }
}

    useEffect(() =>{
    fetchConversations();

    socket.on('conversationUpdated', fetchConversations);

      return () => {
        socket.off('conversationUpdated', fetchConversations);
      };
    }, []);

    return (
    <div>
      {conversation.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`flex items-center gap-[10px] px-[10px] py-[8px] cursor-pointer border-b border-brand-white/8 transition-colors duration-150 ${
            conv.id === selectedConversationId ? 'bg-brand-pink/25' : 'hover:bg-brand-pink/15'
          }`}
        >
          <img
            src={conv.otherUser.avatar_url || '/avatars/default_avatar.png'}
            alt={conv.otherUser.username}
            className="size-[40px] shrink-0 rounded-full object-cover border-2 border-brand-pink-soft shadow-[0_0_6px_var(--color-brand-pink-soft)]"
          />

          <div className="min-w-0">
            <p className="text-[18px] text-brand-white">{conv.otherUser.username}</p>

            {conv.lastMessage && (
              <p className="font-retro text-[13px] text-brand-white/60 truncate">
                {conv.lastMessage.content}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}