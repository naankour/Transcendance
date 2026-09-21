import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { socket } from '../../socket';
import { subscribeUnreadCount, refreshUnreadCount, getUnreadCount } from '../notification';
import NewMessageList from './NewMessageList';
import './ChatBubble.css'

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

    if (location.pathname.startsWith('/conversations'))
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

    return (<div className="chat-bubble-wrapper">
        {isOpen && (
        <div className="chat-bubble-panel">
        	<div className="chat-bubble-header">
            {(activeConversationId || showNewMessage) && (
                <button onClick={handleBackToList} 
                className="chat-bubble-back-btn">
                   {t('chatBubble.back')}
                </button>
            )}
            <h3 className="chat-bubble-header-title">{t('chatBubble.messages')}</h3>

            {!activeConversationId && !showNewMessage && (
                <button onClick={() => setShowNewMessage(true)}
				 className="chat-bubble-contacts-btn">
                    {t('chatBubble.contacts')}
                </button>
            )}
    </div>

    <div className="chat-bubble-body">
        {
            activeConversationId ? (
                <ChatWindow conversationId={activeConversationId}/>
            ) : showNewMessage ? (
                <NewMessageList
                onConversationStarted={(id) => {
                    setActiveConversationId(id);
                    setShowNewMessage(false);
                }}
                />
            ): (
                <ConversationList 
                selectedConversationId={activeConversationId}
                onSelect={handleSelectConversation}
                />
            )}
            </div>
        </div>
    )}
    
    <div className="chat-bubble-button-wrapper">
    	<button
        	onClick={handleBubbleClick}
        	className="chat-bubble-button"
        >
            💬
        </button>

		{unreadCount > 0 && (
			<span
			className="chat-bubble-badge"
			>
				{unreadCount > 99 ? '99+' : unreadCount}
			</span>
		)}
    </div>
</div>
);
}