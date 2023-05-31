import React from "react";
import { ChatCompletionRole } from "../models/chat";
import { useSelector } from "react-redux";
import { selectConversationById } from "../state/conversation/conversationSlice";

export default function ChatMessages({
  conversationId
}: {
  conversationId: string;
}) {
  const conversation = useSelector(selectConversationById(conversationId));
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  return (
    <div className="grow w-full max-w-4xl place-self-center">
      {conversation ? conversation.messages.map((convo, index) => (
        <div key={index} className="flex gap-6 px-6 py-8 even:bg-gray-800">
          <div className={`
            w-8 h-8 rounded shrink-0
            ${convo.role === ChatCompletionRole.ASSISTANT ? "bg-green-500" : "bg-gray-500"}
          `} />
          <p className="place-self-center whitespace-pre-wrap">
            {convo.content}
          </p>
        </div>
      )) : <p>Loading...</p>}
      <div ref={scrollRef} />
    </div>
  );
}
