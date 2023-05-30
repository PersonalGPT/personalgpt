import React from "react";
import { useSelector } from "react-redux";
import { selectIsChatLoading } from "../state/chat/chatSlice";
import { useAppDispatch } from "../state/hooks";
import { createChatCompletion } from "../state/chat/thunks/createChatCompletionThunk";
import { useUpdateConversationMessagesMutation } from "../state/services/conversation";
import { ChatCompletionMessage, ChatCompletionRole } from "../models/chat";
import { selectConversationById, selectCurrentConversationId } from "../state/conversation/conversationSlice";
import { postConversation } from "../state/conversation/thunks/postConversationThunk";

export default function ChatInput() {
  const isLoading = useSelector(selectIsChatLoading);
  const currentConversationId = useSelector(selectCurrentConversationId);
  const currentConversation = useSelector(selectConversationById(currentConversationId));
  const dispatch = useAppDispatch();

  const [prompt, setPrompt] = React.useState("");
  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const abortRef = React.useRef(null);

  const [updateConversationMessages, { data: existingConversation }] = useUpdateConversationMessagesMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputDisabled(true);

    if (!currentConversationId) {
      dispatch(postConversation({ prompt }));
    }
    else {
      const messages = currentConversation.messages;
      const newMessages: ChatCompletionMessage[] = [
        ...messages,
        { role: ChatCompletionRole.USER, content: prompt },
      ];

      await updateConversationMessages({
        id: currentConversationId,
        messages: newMessages,
      })
    }
  };

  React.useEffect(() => {
    if (currentConversation && prompt.length > 0) {
      const { id, messages } = currentConversation;
      generateChatCompletion({ id, messages });
    }
  }, [currentConversation]);

  function generateChatCompletion({ id, messages }: {
    id: string;
    messages: ChatCompletionMessage[];
  }) {
    const promise = dispatch(createChatCompletion({ id, messages }));
    abortRef.current = promise.abort;
    setInputDisabled(false);
    setPrompt("");
  }

  return (
    <div
      className="
        flex flex-col gap-6 sticky bottom-0 w-full pt-10 pb-20
        bg-gradient-to-t from-gray-900
      "
    >
      <button
        className={`
          bg-gray-700 w-fit px-2 py-2.5 rounded-md place-self-center
          hover:bg-gray-600 ${isLoading ? "block" : "hidden"}
        `}
        onClick={() => abortRef.current("Stop generating")}
      >
        🛑 Stop Generating
      </button>
      <form
        onSubmit={handleSubmit}
        className=" place-self-center w-full max-w-4xl"
      >
        <input
          type="text"
          value={prompt}
          placeholder={isLoading ? "Please wait for AI response..." : "Enter your message here..."}
          onChange={e => setPrompt(e.target.value)}
          disabled={isInputDisabled || isLoading}
          className="
            rounded-md p-3 bg-gray-700 text-white w-full
            focus-visible:outline-gray-500 focus-visible:outline-none
            focus-visible:outline-offset-0 disabled:placeholder:text-gray-500
            disabled:hover:cursor-not-allowed
          "
        />
      </form>
    </div>
  );
}
