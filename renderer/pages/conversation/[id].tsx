import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatInput from "../../components/ChatInput";
import ChatMessages from "../../components/ChatMessages";
import StreamDataRenderer from "../../components/StreamDataRenderer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../state/hooks";
import { fetchConversationById } from "../../state/conversation/thunks";
import { selectConversationById } from "../../state/conversation/conversationSlice";

export default function Conversation() {
  const router = useRouter();
  const { id } = router.query;
  const conversation = useSelector(selectConversationById(id as string));
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchConversationById(id as string));
  }, [id]);

  return (
    <React.Fragment>
      <Head>
        <title>Conversation {id} - PersonalGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar selectedId={id as string} />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          {conversation ? (
            <ChatMessages conversationId={id as string} />
          ) : null}
          <ChatInput />
        </div>
        <StreamDataRenderer />
      </main>
    </React.Fragment>
  );
}
