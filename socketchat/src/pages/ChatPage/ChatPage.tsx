import React, { useEffect } from "react";
import { useSocket } from "../../components/SocketContext";
import { useNavigate } from "react-router-dom";
import { Message } from "../../interfaces";
import "./ChatPage.css";

export const ChatPage = () => {
  const { socket, room, username, text, setText, messages, setMessages } =
    useSocket()!;
  const navigate = useNavigate();

  const sendMessage = () => {
    if (!socket) return;
    if (text !== "" && room !== "") {
      socket.emit("message", { text, username, room });
      setText("");
    }
  };

  const DateFormat = (date: Date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");

    return `${hours}:${minutes} ${day}/${month}`;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!socket) return;
    const messageListener = (newMessage: Message) => {
      setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);
    };

    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
    };
  }, [socket, setMessages]);

  useEffect(() => {
    if (!socket || !room || !username) navigate("/home");
  }, [navigate, room, socket, username]);
  return (
    <section className="chat-section">
      <div className="chat-box">
        <h1 className="room-title">
          Sala - <i>{room}</i>
        </h1>
        <div className="chat">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username} : </strong>
              {msg.text} - {DateFormat(msg.createdAt)}
            </div>
          ))}
        </div>
        <input
          className="input-message"
          type="text"
          value={text}
          onKeyDown={handleKeyPress}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage} className="send-button">
          Enviar
        </button>
      </div>
    </section>
  );
};
