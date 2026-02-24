import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {PlayerJoinedEvent, RoomJoinedEvent} from "../util/types.ts";

const Room = () => {

  const {roomId} = useParams();

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);
    ws.onopen = () => {
      console.log("WebSocket connected");

      ws.send(JSON.stringify({
        action: "join-room",
        roomId: roomId
      }));

      ws.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        console.log("Message received: ", eventData);

        if (eventData.action === "roomJoined") {
          const roomJoinedEvent = eventData as RoomJoinedEvent;
          setPlayers(roomJoinedEvent.players);
        } else if (eventData.action === "playerJoined") {
          const playerJoinedEvent = eventData as PlayerJoinedEvent;
          setPlayers(prevPlayers => [...prevPlayers, playerJoinedEvent.player.username]);
        }
      }
    };
  }, []);

  return (
    <>
      <div>{roomId}</div>
      <br />
      {players.map((player: string) => (
        <div key={player}>{player}  </div>
      ))}
    </>
  );
}

export default Room;
