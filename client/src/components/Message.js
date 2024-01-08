import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={message && own ? "message own" : "message"}>
      <div className='messageTop'>
        {!own && (
          <i className='bi bi-person-circle text-4xl text-gray-400 mr-2 pt-1'></i>
        )}
        <p className='messageText'>{message?.text}</p>
        {own && (
          <i className='bi bi-person-circle text-4xl text-gray-400 ml-2 pt-1'></i>
        )}
      </div>
      <div className='messageBottom'>{format(message?.createdAt)}</div>
    </div>
  );
}
