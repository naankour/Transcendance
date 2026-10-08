import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { socket } from '../../socket';
import { subscribeUnreadCount, refreshUnreadCount, getUnreadCount } from '../notification';
import NewMessageList from './NewMessageList';

const headerBtn =
  "bg-brand-black/45 border border-brand-white/60 text-brand-white rounded-[3px] px-2 py-1 text-[16px] cursor-pointer transition-all duration-200 hover:bg-brand-black/70 hover:shadow-[0_0_8px_rgba(245,245,245,0.5)]";


export default function ChatBubble() {
    const { t } = useTranslation();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [unreadCount, setUnreadCountLocal] = useState(getUnreadCount());

    useEffect(() => {
        refreshUnreadCount();

        const unsubscribe = subscribeUnreadCount((count) => {
            setUnreadCountLocal(count);
        });
        
        return unsubscribe;
    }, []);

	useEffect(() => {
		socket.on('conversationUpdated', refreshUnreadCount);

		return () => {
			socket.off('conversationUpdated', refreshUnreadCount);
		};
	}, []);

    if (location.pathname.startsWith('/conversations') || location.pathname.startsWith('/auth'))
    {
        return null;
    }

    function handleBubbleClick() {
        setIsOpen((prev) => !prev);
    }

    function handleSelectConversation(id: number) {
        setActiveConversationId(id);
    }

    function handleBackToList() {
        setActiveConversationId(null);
        setShowNewMessage(false);
    }

    return (
  <div className="fixed bottom-5 right-5 z-1000 font-hand">
    {isOpen && (
      <div className="relative flex flex-col overflow-hidden w-[320px] h-[450px] mb-3 bg-linear-160 from-brand-black to-brand-dark border-3 border-brand-pink rounded shadow-[0_0_20px_rgba(255,46,154,0.5),inset_0_0_25px_rgba(255,46,154,0.08)] before:content-['✦'] before:absolute before:top-4 before:left-37 before:z-2 before:text-[20px] before:text-brand-white before:[text-shadow:0_0_6px_var(--color-brand-white),0_0_12px_var(--color-brand-pink)] before:animate-sparkle before:pointer-events-none">

        <div className="flex items-center gap-2 px-3 py-2.5 bg-linear-90 from-brand-pink-soft to-brand-pink border-b-2 border-brand-pink">
          {(activeConversationId || showNewMessage) && (
            <button onClick={handleBackToList} className={headerBtn}>
              {t('chatBubble.back')}
            </button>
          )}

          <h3 className="flex-1 m-0 text-[22px] text-brand-white tracking-[0.5px] [text-shadow:0_0_6px_rgba(0,0,0,0.6)]">
            {t('chatBubble.messages')}
          </h3>

          {!activeConversationId && !showNewMessage && (
            <button onClick={() => setShowNewMessage(true)} className={headerBtn}>
              {t('chatBubble.contacts')}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto text-brand-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-brand-black [&::-webkit-scrollbar-thumb]:bg-brand-pink-soft [&::-webkit-scrollbar-thumb]:rounded">
          {activeConversationId ? (
            <ChatWindow conversationId={activeConversationId} />
          ) : showNewMessage ? (
            <NewMessageList
              onConversationStarted={(id) => {
                setActiveConversationId(id);
                setShowNewMessage(false);
              }}
            />
          ) : (
            <ConversationList
              selectedConversationId={activeConversationId}
              onSelect={handleSelectConversation}
            />
          )}
        </div>
      </div>
    )}

    <div className="relative w-fit ml-auto">
      <button
        onClick={handleBubbleClick}
        className="w-[58px] h-[58px] flex items-center justify-center rounded-full bg-radial-[at_35%_30%] from-brand-pink-soft to-brand-pink border-2 border-brand-white text-[26px] cursor-pointer shadow-[0_0_10px_var(--color-brand-white),0_0_22px_var(--color-brand-pink),0_0_38px_var(--color-brand-pink-soft)] animate-bubble-pulse"
      >
        💬
      </button>

      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 flex items-center justify-center rounded-full bg-brand-pink text-brand-white border-2 border-brand-white font-retro text-[12px] font-bold shadow-[0_0_10px_rgba(255,46,154,0.8)] animate-badge-blink">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  </div>
);
}