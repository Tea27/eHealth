import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useDeleteNotification = () => {
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const deleteNotification = async (id) => {
    setError(null);
    const response = await fetch(`/api/notification/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
  };

  return { deleteNotification, error };
};
