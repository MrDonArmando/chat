import React, { useState, useEffect, FormEvent } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../../../redux/chat/actions";
import { RiSendPlane2Fill } from "react-icons/ri";

const MessageForm = ({ friendID }: { friendID: string }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const submitMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message === "") return;
    dispatch(sendMessage(message, friendID));
    setMessage("");
  };

  useEffect(() => {
    //console.log("PARAMS: ", friendID);
  });

  return (
    <form id="form-chat" onSubmit={submitMessage}>
      <input
        type="text"
        id="input-chat"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button id="submit-chat-button">
        <RiSendPlane2Fill id="submit-chat-button__icon" />
      </button>
    </form>
  );
};

export default MessageForm;
