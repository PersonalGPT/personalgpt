import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../state/hooks";
import { appendToLastMessage, selectCurrentConversationId, selectStreamData } from "../state/conversation/conversationSlice";

export default function StreamDataRenderer() {
  const streamData = useSelector(selectStreamData);
  const id = useSelector(selectCurrentConversationId);
  const dispatch = useAppDispatch();

  // Whenever streamData is updated, the AI conversation message is also updated
  // This will give us the trailing text/typing effect
  React.useEffect(() => {
    if (streamData.length > 0) {
      dispatch(appendToLastMessage({
        id,
        contentToAppend: streamData,
      }));
    }
  }, [streamData]);

  return <></>;
}
