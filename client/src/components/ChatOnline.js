// import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { userRole } from "../enums/UserRole";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const { user } = useAuthContext();
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const userData = await fetch(`/api/user/${currentId}`);
        const userJson = await userData.json();
        const res =
          user.role === userRole.Doctor
            ? await fetch(`/api/user/patientsByDoctor/${currentId}`)
            : await fetch(`/api/user/${userJson.doctorID}`);
        let data = await res.json();

        if (!Array.isArray(data)) {
          data = [data];
        }

        setFriends(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (user && currentId) {
      getFriends();
    }
  }, [user, currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await fetch(
        `/api/conversations/find/${currentId}/${user._id}`
      );
      const conversation = await res.json();
      setCurrentChat(conversation);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='chatOnline'>
      {onlineFriends.map((o) => (
        <div className='chatOnlineFriend' onClick={() => handleClick(o)}>
          <div className='chatOnlineImgContainer'>
            <div className='chatOnlineBadge'></div>
          </div>
          <span className='chatOnlineName'>{o?.email}</span>
        </div>
      ))}
    </div>
  );
}
