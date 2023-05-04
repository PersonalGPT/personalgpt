import React from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function Sidebar() {
  return (
    <nav className="shrink-0 h-full w-60 bg-gray-700 px-3 py-4 overflow-y-auto">
      <button
        className="
          w-full h-12 p-2 hover:bg-gray-600 border border-gray-500
          rounded-md
        "
      >
        <Link href="/home">
          <span className="flex gap-2 place-items-center">
            <FiPlus size={18} /> New Chat
          </span>
        </Link>
      </button>
      <div className="flex flex-col gap-4 mt-6">
        <Link href="/conversation/1">Conversation 1</Link>
        <Link href="/conversation/2">Conversation 2</Link>
      </div>
    </nav>
  );
}
