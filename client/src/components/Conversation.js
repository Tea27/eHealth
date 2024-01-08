import { useEffect, useState } from "react";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId =
      conversation.firstUserID !== currentUser._id
        ? conversation.firstUserID
        : conversation.secondUserID;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${friendId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [currentUser, conversation]);

  return (
    <div className='conversation '>
      <i className='bi bi-person-circle text-3xl text-gray-400'></i>
      <span className='conversationName ml-5 text-gray-700'>
        {user?.firstName} {user?.lastName}
      </span>
    </div>
  );
}
