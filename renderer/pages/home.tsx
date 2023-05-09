import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import ChatInput from '../components/ChatInput';
import { useCreateConversationMutation } from '../state/services/conversation';
import ChatMessages from '../components/ChatMessages';
import StreamDataRenderer from '../components/StreamDataRenderer';
import { useSelector } from 'react-redux';
import { selectConversationById, selectCurrentConversationId, setCurrentConversationId } from '../state/chat/chatSlice';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../state/hooks';

export default function Home() {
  const currentConversationId = useSelector(selectCurrentConversationId);
  const conversation = useSelector(selectConversationById(currentConversationId));
  const router = useRouter();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setCurrentConversationId(null));
  }, [router.query])

  return (
    <React.Fragment>
      <Head>
        <title>Home - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar selectedId={currentConversationId} />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          {conversation ? (
            <ChatMessages conversationId={conversation.id} />
          ) : (
            <div className="grow grid place-items-center">
              <div className="text-center grid gap-6 max-w-sm">
                <h1 className="text-4xl font-bold">BetterGPT</h1>
                <p>A feature-rich alternative to ChatGPT, with a better interface and  user experience</p>
              </div>
            </div>
          )}
          <ChatInput />
        </div>
        <StreamDataRenderer />
      </main>
    </React.Fragment>
  );
}
