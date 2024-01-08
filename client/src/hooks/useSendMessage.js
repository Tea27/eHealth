import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSendMessage = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({});
  const { user } = useAuthContext();

  const sendMessage = async (newMessage, userID, currentChatID) => {
    setError(null);

    const response = await fetch(`/api/message/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        text: newMessage,
        senderID: userID,
        conversationID: currentChatID,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
    } else {
      setMessage(json);
      return json;
    }
  };

  return { sendMessage, message, error };
};
