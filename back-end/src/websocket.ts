import { io } from "./http";

interface RoomUser {
  socketId: string;
  username: string;
  room: string;
}

interface Message {
  text: string;
  username: string;
  room: string;
  createdAt: Date;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    let username = data.username.trim();
    const room = data.room.trim().toUpperCase();

    socket.join(room);

    if (
      username === "admin" ||
      username === "Admin" ||
      username === "Server" ||
      username === "server"
    )
      username = "User" + Math.floor(Math.random() * 10000);

    const userInRoom = users.find(
      (user) => user.username === username && user.room === room
    );

    if (userInRoom) {
      userInRoom.socketId = socket.id;
    } else {
      users.push({
        socketId: socket.id,
        username: username,
        room: room,
      });
    }

    const usersInRoom = users.filter((user) => user.room === room);
    io.to(room).emit("message", {
      text: `Welcome ${data.username}!`,
      username: "Server",
      createdAt: new Date(),
    });
    callback(usersInRoom);
  });

  socket.on("message", (data) => {
    const username = data.username.trim();
    const room = data.room.trim().toUpperCase();

    const message: Message = {
      text: data.text,
      username: username,
      room: room,
      createdAt: new Date(),
    };

    messages.push(message);
    console.table(messages);
    console.log(message);

    io.to(room).emit("message", message);
  });

  socket.on("disconnect", () => {
    const userIndex = users.findIndex((user) => user.socketId === socket.id);

    const user = users[userIndex];

    if (user) {
      users.splice(userIndex, 1);

      io.to(user.room).emit("message", {
        text: `${user.username} left!`,
        username: "Server",
        createdAt: new Date(),
      });
    }
  });

  socket.on("top_rooms", (callback) => {
    const rooms = users.map((user) => user.room);
    const roomsUnique = rooms.filter(
      (room, index) => rooms.indexOf(room) === index
    );
    const roomsWithMessages = roomsUnique.map((room) => {
      const messagesInRoom = messages.filter(
        (message) => message.room === room
      );
      return {
        room,
        messages: messagesInRoom.length,
      };
    });
    const topRooms = roomsWithMessages.sort((a, b) => b.messages - a.messages);
    callback(topRooms);
  });
});
