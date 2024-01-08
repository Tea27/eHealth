import { useAuthContext } from "../hooks/useAuthContext.js";

export const useUpdateNotifications = () => {
  const { user } = useAuthContext();

  const updateNotifications = async (notifications) => {
    for (const notification of notifications) {
      const response = await fetch(
        `/api/notification/updateNotification/${notification._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(notification),
        }
      );
      const json = await response.json();
    }
  };

  return updateNotifications;
};
