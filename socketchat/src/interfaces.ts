import { ReactNode } from "react";
import { Socket } from "socket.io-client";

export interface RoomUser {
  socketId: string;
  username: string;
  room: string;
}

export interface Message {
  text: string;
  username: string;
  room: string;
  createdAt: Date;
}

export interface SocketProviderProps {
  children: ReactNode;
}
export interface SocketContextType {
  socket: Socket | null;
  room: string;
  setRoom: (room: string) => void;
  username: string;
  setUsername: (username: string) => void;
  text: string;
  setText: (text: string) => void;
  messages: Message[];
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void;
  topRooms: TopRoom[];
  setTopRooms: (
    topRooms: TopRoom[] | ((prevTopRooms: TopRoom[]) => TopRoom[])
  ) => void;
}

export interface RoomResponse {
  socketId: string;
  username: string;
  room: string;
}

export interface TopRoom {
  room: string;
  messages: number;
  users: number;
}
