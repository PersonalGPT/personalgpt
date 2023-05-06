import React from "react";
import { useSelector } from "react-redux";
import { selectIsChatLoading, selectPrompt, setPrompt } from "../state/chat/chatSlice";
import { useAppDispatch } from "../state/hooks";
import { createChatCompletion } from "../state/chat/thunks/createChatCompletionThunk";
import { useCreateConversationMutation } from "../state/services/conversation";

export default function ChatInput() {
  const isLoading = useSelector(selectIsChatLoading);

  const [prompt, setPrompt] = React.useState("");
  const [createConversation, convoResult] = useCreateConversationMutation({
    fixedCacheKey: "shared-convoResult",
  });
  const dispatch = useAppDispatch();

  const [isInputDisabled, setInputDisabled] = React.useState(false);
  const abortRef = React.useRef(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputDisabled(true);
    console.log("Creating conversation...");
    await createConversation({ prompt });
  };

  React.useEffect(() => {
    if (convoResult.data && prompt.length > 0) {
      console.log(convoResult.data);
      const { id, messages } = convoResult.data;
      console.log("Creating chat completion...")
      const promise = dispatch(createChatCompletion({ id, messages }));
      abortRef.current = promise.abort;
      setInputDisabled(false);
      setPrompt("");
    }
  }, [convoResult]);

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
