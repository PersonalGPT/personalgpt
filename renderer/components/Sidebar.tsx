import React from "react";
import Link from "next/link";
import { BsChatLeft } from "react-icons/bs";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useGetAllConversationsQuery } from "../state/services/conversation";
import { useSelector } from "react-redux";
import { selectConversations } from "../state/chat/chatSlice";
import { Conversation } from "../models/conversation";

export default function Sidebar({ selectedId }: { selectedId?: string }) {
  const { error, isLoading } = useGetAllConversationsQuery();
  const conversations = useSelector(selectConversations);

  return (
    <nav className="shrink-0 h-full w-72 bg-gray-700 px-3 py-4 overflow-y-auto">
      <Link href="/home">
        <span className="
          flex gap-3 place-items-center w-full h-12 p-2 hover:bg-gray-600
          outline outline-1 outline-gray-500 rounded-md hover:cursor-pointer
        ">
          <FiPlus className="w-5 h-5" /> New Chat
        </span>
      </Link>
      <div className="flex flex-col gap-2 mt-6">
        {error ? (
          <p>There was an error.</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : conversations ? (
          Object.values(conversations).sort((a, b) => b.createdAt - a.createdAt).map((conversation, index) => (
            <ChatItem
              key={index}
              conversation={conversation}
              selectedId={selectedId}
            />
          ))
        ) : null}
      </div>
    </nav>
  );
}

export function ChatItem({
  conversation,
  selectedId
}: {
  conversation: Conversation,
  selectedId: string;
}) {
  const isSelected = conversation.id === selectedId;
  const [isEditingTitle, setEditingTitle] = React.useState(false);

  return (
    <Link href={`/conversation/${conversation.id}`}>
      <div
        className={`
          flex gap-3 place-items-center w-full p-2 h-12 rounded-md
          hover:cursor-pointer hover:bg-gray-600
          ${isSelected ? "bg-gray-600" : ""}
      `}>
        <BsChatLeft className="text-gray-300 w-5 h-5 shrink-0" />
        <div className="flex w-full gap-2 overflow-hidden">
          {isSelected && isEditingTitle ? (
            <form>
              <input
                type="text"
                defaultValue={conversation.title}
                className="
                  bg-gray-600 border border-gray-400 rounded w-full
                  focus-within:outline-none focus-within:border-gray-300
                "
              />
            </form>
          ) : (
            <span className="truncate">{conversation.title}</span>
          )}
          {conversation.id === selectedId ? (
            <div className="grow grid self-center place-content-end">
              {isEditingTitle ? (
                <div className="flex gap-2">
                  <ImCheckmark
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={() => setEditingTitle(false)}
                  />
                  <ImCross
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={() => setEditingTitle(false)}
                  />
                </div>
              ) : (
                <FiEdit3
                  className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                  onClick={() => setEditingTitle(true)}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
