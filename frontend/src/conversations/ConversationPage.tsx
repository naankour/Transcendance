import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewMessageList from './NewMessageList';

const tabBase =
  'flex-1 p-[12px] cursor-pointer font-hand text-[18px] transition-colors duration-200';

const tabActive = 'bg-linear-to-r from-brand-pink-soft to-brand-pink text-brand-black font-bold';

const tabInactive = 'bg-brand-dark text-brand-white hover:bg-brand-pink/20';

export default function ConversationPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get('id');


    const[selectedConversationId, setSelectedConversationId] = useState<number | null>(idFromUrl ? Number(idFromUrl) : null);

    const [showNewMessage, setShowNewMessage] = useState(false);

    return (
    <div className="flex h-[calc(100vh_-_120px)] bg-brand-black text-brand-white font-hand border-t-3 border-brand-pink">
      <div className="w-[320px] flex flex-col border-r-3 border-brand-pink bg-linear-to-b from-brand-black to-brand-dark">
        <div className="flex border-b-2 border-brand-pink">
          <button
            onClick={() => setShowNewMessage(false)}
            className={`${tabBase} ${!showNewMessage ? tabActive : tabInactive}`}
          >
            {t('conversationPage.myConversations')}
          </button>
          <button
            onClick={() => setShowNewMessage(true)}
            className={`${tabBase} ${showNewMessage ? tabActive : tabInactive}`}
          >
            {t('conversationPage.follows')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-brand-black [&::-webkit-scrollbar-thumb]:bg-brand-pink-soft [&::-webkit-scrollbar-thumb]:rounded">
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

      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} />
        ) : (
          <p className="flex-1 flex items-center justify-center gap-[8px] p-[20px] text-center text-[26px] text-brand-pink-soft [text-shadow:0_0_8px_rgba(255,46,154,0.6)] before:content-['✦'] after:content-['✦']">
            {t('conversationPage.emptyState')}
          </p>
        )}
      </div>
    </div>
  );
}