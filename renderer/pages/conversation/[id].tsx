import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatInput from "../../components/ChatInput";
import ChatMessages from "../../components/ChatMessages";
import { useGetConversationByIdQuery } from "../../state/services/conversation";
import StreamDataRenderer from "../../components/StreamDataRenderer";
import { useSelector } from "react-redux";
import { selectConversationById } from "../../state/chat/chatSlice";

export default function Conversation() {
  const router = useRouter();
  const { id } = router.query;
  const { error, isLoading } = useGetConversationByIdQuery(id as string);
  const conversation = useSelector(selectConversationById(id as string));

  return (
    <React.Fragment>
      <Head>
        <title>Conversation {id} - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar selectedId={id as string} />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          {error ? (<p>There was an error.</p>) : isLoading ? (
            <p>Loading...</p>
          ) : conversation ? (
            <ChatMessages conversationId={id as string} />
          ) : null}
          <ChatInput />
        </div>
        <StreamDataRenderer />
      </main>
    </React.Fragment>
  );
}
