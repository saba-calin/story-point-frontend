import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

const Room = () => {

  const {roomId} = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);
    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({
        action: "join-room",
        roomId: roomId
      }));
    };
  }, []);

  return (
    <>
      <div>{roomId}</div>
    </>
  );
}

export default Room;
