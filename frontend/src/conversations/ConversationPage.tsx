// page conversation qui contient les composants ConversationList et ChatWindow

import { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

export default function ConversationPage() {
    const[selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px', borderRight: '1px solid #ccc'}}>
                <ConversationList 
                selectedConversationId={selectedConversationId}
                onSelect={(id) => setSelectedConversationId(id)} />
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