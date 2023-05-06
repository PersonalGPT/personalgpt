import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatInput from "../../components/ChatInput";
import ChatMessages from "../../components/ChatMessages";
import { useGetConversationByIdQuery } from "../../state/services/conversation";
import StreamDataRenderer from "../../components/StreamDataRenderer";

export default function Conversation() {
  const router = useRouter();
  const { id } = router.query;
  const { data: conversation, error, isLoading } = useGetConversationByIdQuery(id as string);

  React.useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  return (
    <React.Fragment>
      <Head>
        <title>Conversation {id} - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          <ChatMessages conversationId={id as string} />
          <ChatInput />
        </div>
        <StreamDataRenderer />
      </main>
    </React.Fragment>
  );
}
