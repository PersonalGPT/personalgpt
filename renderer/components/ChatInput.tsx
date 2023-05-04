import React from "react";
import { useSelector } from "react-redux";
import { addChatMessage, selectConversation, selectIsChatLoading, selectPrompt, setPrompt } from "../state/chat/chatSlice";
import { useAppDispatch } from "../state/hooks";
import { ChatCompletionRole } from "../models/chat";
import { createChatCompletion } from "../state/chat/thunks/createChatCompletionThunk";

export default function ChatInput({
  handleSubmit
}: {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const isLoading = useSelector(selectIsChatLoading);
  const conversation = useSelector(selectConversation);
  const prompt = useSelector(selectPrompt);
  const dispatch = useAppDispatch();

  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const abortRef = React.useRef(null);

  if (!handleSubmit) {
    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setInputDisabled(true);
      dispatch(
        addChatMessage([
          { role: ChatCompletionRole.USER, content: prompt },
          { role: ChatCompletionRole.ASSISTANT, content: "" }
        ])
      );
    };
  }

  React.useEffect(() => {
    if (prompt.length > 0) {
      const promise = dispatch(createChatCompletion(conversation));
      abortRef.current = promise.abort;
      setInputDisabled(false);
      dispatch(setPrompt(""));
    }
  }, [conversation]);

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
          onChange={e => dispatch(setPrompt(e.target.value))}
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
