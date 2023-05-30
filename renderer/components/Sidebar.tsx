import React from "react";
import Link from "next/link";
import { BsChatLeft } from "react-icons/bs";
import { FiPlus, FiEdit3, FiTrash2 } from "react-icons/fi";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useDeleteConversationMutation } from "../state/services/conversation";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useAppDispatch } from "../state/hooks";
import { selectConversations } from "../state/conversation/conversationSlice";
import { fetchAllConversations } from "../state/conversation/thunks/fetchAllConversationsThunk";
import { patchConversationTitle } from "../state/conversation/thunks/patchConversationTitleThunk";

export default function Sidebar({ selectedId }: { selectedId?: string }) {
  const conversations = useSelector(selectConversations);
  const [idConvoToEdit, setIdConvoToEdit] = React.useState<string>(null);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchAllConversations());
  }, []);

  const startTitleEdit = (convoId: string) => {
    setIdConvoToEdit(convoId);
  };

  const cancelTitleEdit = () => {
    setIdConvoToEdit(null);
  };

  React.useEffect(() => {
    if (idConvoToEdit !== selectedId)
      setIdConvoToEdit(null);
  }, [selectedId]);

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
        {conversations ? (
          Object.values(conversations).sort((a, b) => b.createdAt - a.createdAt).map((conversation, index) => (
            <ChatItem
              key={index}
              id={conversation.id}
              title={conversation.title}
              isSelected={conversation.id === selectedId}
              isEditable={conversation.id === idConvoToEdit}
              startEdit={startTitleEdit}
              cancelEdit={cancelTitleEdit}
            />
          ))
        ) : <p>Loading...</p>}
      </div>
    </nav>
  );
}

export function ChatItem({
  id,
  title,
  isSelected,
  isEditable,
  startEdit,
  cancelEdit,
}: {
  id: string;
  title: string;
  isSelected: boolean;
  isEditable: boolean;
  startEdit: (convoId: string) => void;
  cancelEdit: () => void;
}) {
  const [newTitle, setNewTitle] = React.useState(title);

  const [isDeleting, setDeleting] = React.useState(false);
  const [deleteConversation, __] = useDeleteConversationMutation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleChangeSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await dispatch(patchConversationTitle({ id, title: newTitle }));
    cancelEdit();
  };

  const startDelete = () => setDeleting(true);
  const cancelDelete = () => setDeleting(false);

  const confirmDelete = async () => {
    await deleteConversation({ id });
    router.push("/home");
  };

  return (
    <Link href={`/conversation/${id}`}>
      <div
        className={`
          flex gap-3 place-items-center w-full p-2 h-12 rounded-md
          hover:cursor-pointer hover:bg-gray-600
          ${isSelected ? "bg-gray-600" : ""}
      `}>
        {isDeleting ?
          <FiTrash2 className="w-5 h-5 text-gray-300 shrink-0"/>
        :
          <BsChatLeft className="w-5 h-5 text-gray-300 shrink-0" />
        }
        <div className="flex w-full gap-2 overflow-hidden">
          {isSelected && isEditable ? (
            <form onSubmit={handleTitleChangeSubmit}>
              <input
                type="text"
                defaultValue={title}
                onChange={handleTitleChange}
                className="
                  bg-gray-600 border border-gray-400 rounded w-full
                  focus-within:outline-none focus-within:border-gray-300
                "
              />
            </form>
          ) : (
            <span className="truncate">
              {isDeleting ? `Delete '${title}'?` : title}
            </span>
          )}
          {isSelected ? (
            <div className="grow grid self-center place-content-end">
              {isEditable || isDeleting ? (
                <div className="flex gap-2">
                  <ImCheckmark
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={
                      isEditable ? handleTitleChangeSubmit :
                      isDeleting ? confirmDelete : null
                    }
                  />
                  <ImCross
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={() => {
                      if (isEditable) cancelEdit();
                      if (isDeleting) cancelDelete();
                    }}
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <FiEdit3
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={() => startEdit(id)}
                  />
                  <FiTrash2
                    className="w-5 h-5 shrink-0 text-gray-400 hover:text-white"
                    onClick={() => startDelete()}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
