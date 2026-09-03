// page conversation qui contient les composants ConversationList et ChatWindow

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewMessageList from './NewMessageList';
import './ConversationPage.css';

export default function ConversationPage() {
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get('id');


    const[selectedConversationId, setSelectedConversationId] = useState<number | null>(idFromUrl ? Number(idFromUrl) : null);

    const [showNewMessage, setShowNewMessage] = useState(false);

    return (
        <div className="conversation-page">
            <div className="conversation-page-sidebar">
                <div className="conversation-page-tabs">
                    <button onClick={() => setShowNewMessage(false)}className={`conversation-page-tab ${!showNewMessage ? 'active' : ''}`}>My conversations</button>
                    <button className={`conversation-page-tab ${showNewMessage ? 'active' : ''}`}
                    onClick={() => setShowNewMessage(true)}>Follows</button>
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
                    <p className="conversation-page-empty">Select a conversation to start discussing.</p>
                )}
            </div>
        </div>
    );
}