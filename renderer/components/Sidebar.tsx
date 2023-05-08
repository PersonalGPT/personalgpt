import React from "react";
import Link from "next/link";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { useGetAllConversationsQuery } from "../state/services/conversation";
import { useSelector } from "react-redux";
import { selectConversations } from "../state/chat/chatSlice";

export default function Sidebar({ selectedId }: { selectedId?: string }) {
  const { error, isLoading } = useGetAllConversationsQuery();
  const conversations = useSelector(selectConversations);

  return (
    <nav className="shrink-0 h-full w-60 bg-gray-700 px-3 py-4 overflow-y-auto">
      <Link href="/home">
        <span className="
          flex gap-3 place-items-center w-full h-12 p-2 hover:bg-gray-600
          outline outline-1 outline-gray-500 rounded-md hover:cursor-pointer
        ">
          <FiPlus className="w-5 h-5" /> New Chat
        </span>
      </Link>
      <div className="flex flex-col gap-2 mt-6">
        {error ? (<p>There was an error.</p>) : isLoading ? (
          <p>Loading...</p>
        ) : conversations ? (
          <>
            {Object.values(conversations)
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((conversation, index) => (
              <Link key={index} href={`/conversation/${conversation.id}`}>
                <div className={`
                  flex gap-3 place-items-center w-full p-2 h-12 rounded-md
                  hover:cursor-pointer hover:bg-gray-600 overflow-hidden
                  ${conversation.id === selectedId ? "bg-gray-600" : ""}
                `}>
                  <BsChatLeft className="text-gray-300 w-5 h-5 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                  {conversation.id === selectedId ? (
                    <div className="grow grid place-content-end">
                      <FiEdit3 className="w-5 h-5 shrink-0 text-gray-400 hover:text-white" />
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </nav>
  );
}
