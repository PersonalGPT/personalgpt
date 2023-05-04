import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { appendToLastMessage, selectStreamData } from "../../state/chat/chatSlice";
import { useAppDispatch } from "../../state/hooks";
import ChatInput from "../../components/ChatInput";
import ChatMessages from "../../components/ChatMessages";

export default function Conversation() {
  const router = useRouter();
  const { id } = router.query;

  const streamData = useSelector(selectStreamData);
  const dispatch = useAppDispatch();

  // Whenever streamData is updated, the AI conversation message is also updated
  // This will give us the trailing text/typing effect
  React.useEffect(() => {
    if (streamData.length > 0) {
      dispatch(appendToLastMessage(streamData));
    }
  }, [streamData]);

  return (
    <React.Fragment>
      <Head>
        <title>Conversation {id} - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen flex overflow-x-hidden">
        <Sidebar />
        <div className="grow flex flex-col w-full relative overflow-y-auto">
          <ChatMessages />
          <ChatInput />
        </div>
      </main>
    </React.Fragment>
  );
}
