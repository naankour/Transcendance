// page conversation qui contient les composants ConversationList et ChatWindow

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewMessageList from './NewMessageList';
import './ConversationPage.css';

export default function ConversationPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get('id');


    const[selectedConversationId, setSelectedConversationId] = useState<number | null>(idFromUrl ? Number(idFromUrl) : null);

    const [showNewMessage, setShowNewMessage] = useState(false);

    return (
        <div className="conversation-page">
            <div className="conversation-page-sidebar">
                <div className="conversation-page-tabs">
                    <button onClick={() => setShowNewMessage(false)}className={`conversation-page-tab ${!showNewMessage ? 'active' : ''}`}>{t('conversationPage.myConversations')}</button>
                    <button className={`conversation-page-tab ${showNewMessage ? 'active' : ''}`}
                    onClick={() => setShowNewMessage(true)}>{t('conversationPage.follows')}</button>
                </div>
                {/* <ConversationList 
                selectedConversationId={selectedConversationId}
                onSelect={(id) => setSelectedConversationId(id)} /> */}
                <div className="conversation-page-list">
                {showNewMessage ? (
                    <NewMessageList
                    onConversationStarted={(id) => {
                        setSelectedConversationId(id);
                        setShowNewMessage(false);
                    }}
                    />
                ) : (
                    <ConversationList
                        selectedConversationId={selectedConversationId}
                        onSelect={(id) => setSelectedConversationId(id)}
                    />
                )}
                </div>
            </div>

            <div className="conversation-page-main">
                {selectedConversationId ? (
                    <ChatWindow conversationId={selectedConversationId} />
                ) : (
                    <p className="conversation-page-empty">{t('conversationPage.emptyState')}</p>
                )}
            </div>
        </div>
    );
}