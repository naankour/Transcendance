import {useState, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { socket } from '../../socket';
import { refreshUnreadCount } from '../notification'

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
    const { t } = useTranslation();
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

      if (!token) 
      {
        setLoading(false);
        return;
      }

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
    finally 
      {
        setLoading(false);
      }
    }

    async function markAsRead() {

      const token = localStorage.getItem('token');
      if (!token) 
        return;

      try {
        const request = await fetch(`/api/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!request.ok)
          return;
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
        return (
      <div className="p-[20px] text-center text-[18px] text-brand-white/60">
        {t('chatWindow.loadingMessages')}
      </div>
    );
    }

    return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-[10px] flex flex-col gap-[8px]">
        {messages.map((message) => {
          const isOwn = message.sender.id === myId;

          return (
            <div
              key={message.id}
              className={`flex flex-col max-w-[75%] ${
                isOwn ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {!isOwn && (
                <p className="mb-[2px] ml-[4px] font-retro text-[12px] text-brand-pink-soft">
                  {message.sender.username}
                </p>
              )}
              <div
                className={`px-[12px] py-[8px] rounded-[4px] text-[17px] leading-[1.3] break-words ${
                  isOwn
                    ? 'bg-linear-135 from-brand-pink to-brand-pink-soft text-brand-black border border-brand-pink shadow-[0_0_8px_rgba(255,46,154,0.4)]'
                    : 'bg-brand-dark text-brand-white border border-brand-white/20'
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-[6px] p-[8px] border-t-2 border-brand-pink bg-brand-black">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == 'Enter') handleSend();
          }}
          placeholder={t('chatWindow.writeMessagePlaceholder')}
          className="flex-1 px-[10px] py-[8px] rounded-[3px] bg-brand-dark border border-brand-pink-soft text-brand-white font-hand text-[17px] placeholder:text-brand-white/40 focus:outline-none focus:shadow-[0_0_8px_var(--color-brand-pink)]"
        />
        <button
          onClick={handleSend}
          className="px-[16px] rounded-[3px] bg-brand-pink text-brand-white font-hand text-[18px] cursor-pointer transition-shadow duration-200 hover:shadow-[0_0_10px_var(--color-brand-pink)]"
        >
          {t('chatWindow.send')}
        </button>
      </div>
    </div>
  );
}