import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RoomPage } from "./pages/RoomPage/RoomPage";
import { ChatPage } from "./pages/ChatPage/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomPage />} />
        <Route path="/home" element={<RoomPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
