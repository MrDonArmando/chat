import React, { useState, useEffect, FormEvent } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../../../redux/chat/actions";

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
        placeholder="Wpisz wiadomość..."
      />
      <button id="submit-button-chat">Send</button>
    </form>
  );
};

export default MessageForm;
