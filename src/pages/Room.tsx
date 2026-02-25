import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import type {CreateRoomResponse, PlayerJoinedEvent, RoomJoinedEvent} from "../util/types.ts";
import {AuthContext} from "../context/AuthContext.tsx";

const Room = () => {

  const {roomId} = useParams();

  const [players, setPlayers] = useState<string[]>([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateStoryLoading, setIsCreateStoryLoading] = useState(false);

  const {user} = useContext(AuthContext)!;

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      ws.send(JSON.stringify({
        action: "join-room",
        roomId: roomId
      }));
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      console.log("Message received: ", eventData);

      if (eventData.action === "roomJoined") {
        const roomJoinedEvent = eventData as RoomJoinedEvent;
        setPlayers(roomJoinedEvent.players);
        setRoomOwner(roomJoinedEvent.room.ownerUsername);
        setIsPageLoading(false);
      } else if (eventData.action === "playerJoined") {
        const playerJoinedEvent = eventData as PlayerJoinedEvent;
        setPlayers(prevPlayers => [...prevPlayers, playerJoinedEvent.player.username]);
      } else if (eventData.action == "storyCreated") {
        setIsCreateStoryLoading(false);
      }
    }

    ws.onerror = (event) => {
      console.log(event);
    }

    return () => ws.close();
  }, []);

  const handleCreateStory = () => {
    wsRef.current?.send(JSON.stringify({
      action: "create-story",
      roomId: roomId,
      name: "story_name",
      description: "description"
    }));
    setIsCreateStoryLoading(true);
  }

  if (isPageLoading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div>{roomId}</div>
      <br/>
      {players.map((player: string) => (
        <div key={player}>{player}  </div>
      ))}

      {roomOwner === user?.username && (
        <>
          {isCreateStoryLoading ? (
            <div>
              Creating Story...
            </div>
          ) : (
            <button onClick={handleCreateStory}>
              Create story
            </button>
          )}

          <div>
            <h4>Active Story</h4>
          </div>
        </>
      )}
    </>
  );
}

export default Room;
