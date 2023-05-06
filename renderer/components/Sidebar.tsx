import React from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { useGetAllConversationsQuery } from "../state/services/conversation";

export default function Sidebar() {
  const { data: previews, error, isLoading } = useGetAllConversationsQuery();

  React.useEffect(() => {
    console.log(previews);
  }, [previews]);

  return (
    <nav className="shrink-0 h-full w-60 bg-gray-700 px-3 py-4 overflow-y-auto">
      <button
        className="
          w-full h-12 p-2 hover:bg-gray-600 outline outline-1 outline-gray-500
          rounded-md
        "
      >
        <Link href="/home">
          <span className="flex gap-3 place-items-center">
            <FiPlus className="w-5 h-5" /> New Chat
          </span>
        </Link>
      </button>
      <div className="flex flex-col gap-2 mt-6">
        {error ? (<p>There was an error.</p>) : isLoading ? (
          <p>Loading...</p>
        ) : previews ? (
          <>
            {previews.map((conversation, index) => (
              <button key={index} className="w-full p-2 h-12 rounded-md hover:bg-gray-600 overflow-hidden">
                <Link href={`/conversation/${conversation.id}`}>
                  <div className="flex gap-3 place-items-center">
                    <BsChatLeft className="text-gray-300 w-5 h-5 shrink-0" />
                    <span className="truncate">{conversation.title}</span>
                  </div>
                </Link>
              </button>
            ))}
          </>
        ) : null}
      </div>
    </nav>
  );
}
