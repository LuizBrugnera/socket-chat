import { useEffect } from "react";
import { useSocket } from "../../components/SocketContext";
import { useNavigate } from "react-router-dom";
import { RoomResponse, TopRoom } from "../../interfaces";
import "./RoomPage.css";

export const RoomPage = () => {
  const {
    socket,
    room,
    setRoom,
    username,
    setUsername,
    setMessages,
    topRooms,
    setTopRooms,
  } = useSocket()!;
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!socket) return;
    if (room !== "" && username !== "") {
      socket.emit(
        "select_room",
        { username, room },
        (response: RoomResponse[]) => {
          const thisResponse = response[response.length - 1];
          setRoom(thisResponse.room);
          setUsername(thisResponse.username);
        }
      );

      navigate("/chat");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.emit("top_rooms", (response: TopRoom[]) => {
      setTopRooms(response);
    });
  }, [socket, setTopRooms]);

  useEffect(() => {
    setMessages([]);
  }, [setMessages]);

  return (
    <section className="main-section">
      <div className="room-page">
        <div className="data-box">
          <input
            className="input-username"
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-room"
            type="text"
            placeholder="Nome da sala"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom} className="submit-button">
            Entrar/Criar Sala
          </button>
        </div>
        <div className="best-rooms">
          <h3>Salas Principais</h3>
          <ul>
            {topRooms.slice(0, 5).map((room) => (
              <li key={room.room + "key"}>
                {room.room} - {room.messages} msgs
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
