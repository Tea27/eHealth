import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import Conversation from "../components/Conversation";
import Message from "../components/Message";
import { useSendMessage } from "../hooks/useSendMessage.js";
import { io } from "socket.io-client";
import NotAuthorized from "../components/NotAutorized";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const socket = useRef();
  const { user } = useAuthContext();
  const scrollRef = useRef();
  const { sendMessage, message, error } = useSendMessage();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      (arrivalMessage.sender === currentChat?.firstUserID ||
        arrivalMessage.sender === currentChat?.secondUserID) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user?._id);
    socket.current.on("getUsers", (users) => {});
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        if (user) {
          const res = await fetch(`/api/conversation/${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const data = await res.json(0);
          setConversations(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/message/get/${currentChat?._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      getMessages();
    }
  }, [currentChat, user]);

  const handleSubmit = async (e) => {
    if (!user) return;

    e.preventDefault();

    const res = await sendMessage(newMessage, user._id, currentChat._id);

    const receiverId =
      currentChat?.firstUserID !== user._id
        ? currentChat.firstUserID
        : currentChat.secondUserID;
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    if (!error) {
      setMessages([...messages, res]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <>
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            {Array.isArray(conversations) &&
              conversations?.map((c) => (
                <div key={c._id} onClick={() => setCurrentChat(c)}>
                  <Conversation
                    key={c._id}
                    conversation={c}
                    currentUser={user}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {Array.isArray(messages) &&
                    messages?.map((m) => (
                      <div key={m?._id}>
                        <Message
                          key={m?._id}
                          message={m}
                          own={m?.senderID === user?._id}
                        />
                      </div>
                    ))}
                  <div ref={scrollRef}></div>
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='write something...'
                    value={newMessage}
                    onInput={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button className='chatSubmitButton' onClick={handleSubmit}>
                    <i class='bi bi-send-plus'></i>
                  </button>
                </div>
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className='chatOnline'></div>
      </div>
    </>
  );
};

export default Messenger;
