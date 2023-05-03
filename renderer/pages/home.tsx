import React from 'react';
import Head from 'next/head';
import { ChatCompletionRole } from '../models/chat';
import { useSelector } from 'react-redux';
import {
  addChatMessage,
  editLastMessage,
  selectConversation,
  selectPrompt,
  selectStreamData,
  setPrompt
} from '../state/chat/chatSlice';
import { useAppDispatch } from '../state/hooks';
import { createChatCompletion } from '../state/chat/thunks/createChatCompletionThunk';

export default function Home() {
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const scrollRef = React.useRef(null);

  const conversation = useSelector(selectConversation);
  const prompt = useSelector(selectPrompt);
  const streamData = useSelector(selectStreamData);
  const dispatch = useAppDispatch();

  // Whenever streamData is updated, the AI conversation message is also updated
  // This will give us the trailing text/typing effect
  React.useEffect(() => {
    if (streamData.length > 0) {
      dispatch(editLastMessage(streamData));
    }
  }, [streamData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputDisabled(true);
    dispatch(
      addChatMessage([
        { role: ChatCompletionRole.USER, content: prompt },
        { role: ChatCompletionRole.ASSISTANT, content: "" }
      ])
    );
  };

  React.useEffect(() => {
    if (prompt.length > 0) {
      dispatch(createChatCompletion(conversation));
      setInputDisabled(false);
      dispatch(setPrompt(""));
    }
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  return (
    <React.Fragment>
      <Head>
        <title>Home - BetterGPT UI</title>
      </Head>
      <main className="w-screen h-screen grid overflow-x-hidden">
        <div className="flex flex-col gap-8 pt-12 px-24 max-w-7xl mx-auto w-full relative">
          <div className="grow overflow-y-auto">
            {conversation.map((convo, index) => (
              <div key={index} className="flex gap-6 px-6 py-8 even:bg-gray-800">
                <div className={`
                  w-8 h-8 rounded shrink-0
                  ${convo.role === ChatCompletionRole.ASSISTANT ? "bg-green-500" : "bg-gray-500"}
                `} />
                <p className="place-self-center whitespace-pre-wrap">
                  {convo.content}
                </p>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 h-28 bg-gradient-to-t from-gray-900 to-gray-900/90"
          >
            <input
              type="text"
              value={prompt}
              placeholder="Enter your message here..."
              onChange={e => dispatch(setPrompt(e.target.value))}
              disabled={isInputDisabled}
              className="
                rounded-md p-3 bg-gray-700 text-white w-full
                focus-visible:outline-gray-500 focus-visible:outline-none
                focus-visible:outline-offset-0 disabled:text-gray-500
              "
            />
          </form>
        </div>
      </main>
    </React.Fragment>
  );
}
