import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
  Message,
  SocketContextType,
  SocketProviderProps,
  TopRoom,
} from "../interfaces";

const SocketContext = createContext<SocketContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [topRooms, setTopRooms] = useState<TopRoom[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3005");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const contextValue = {
    socket,
    room,
    setRoom,
    username,
    setUsername,
    text,
    setText,
    messages,
    setMessages,
    topRooms,
    setTopRooms,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
