import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import ChatInput from '../components/ChatInput';
import { useCreateConversationMutation } from '../state/services/conversation';
import ChatMessages from '../components/ChatMessages';
import StreamDataRenderer from '../components/StreamDataRenderer';

export default function Home() {
  const [_, convoResult] = useCreateConversationMutation({
    fixedCacheKey: "shared-convoResult",
  });

  return (
    <React.Fragment>
      <Head>
        <title>Home - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          {convoResult.data ? (
            <ChatMessages conversationId={convoResult.data?.id} />
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
