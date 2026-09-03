// page conversation qui contient les composants ConversationList et ChatWindow

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewMessageList from './NewMessageList';

export default function ConversationPage() {
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get('id');


    const[selectedConversationId, setSelectedConversationId] = useState<number | null>(idFromUrl ? Number(idFromUrl) : null);

    const [showNewMessage, setShowNewMessage] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px', borderRight: '1px solid #ccc'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    <button onClick={() => setShowNewMessage(false)}>My conversations</button>
                    <button onClick={() => setShowNewMessage(true)}>Follows</button>
                </div>
                {/* <ConversationList 
                selectedConversationId={selectedConversationId}
                onSelect={(id) => setSelectedConversationId(id)} /> */}

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

            <div style={{ flex: 1 }}>
                {selectedConversationId ? (
                    <ChatWindow conversationId={selectedConversationId} />
                ) : (
                    <p>Select a conversation to start discussing.</p>
                )}
            </div>
        </div>
    );
}