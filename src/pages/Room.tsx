import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import type {
  PlayerJoinedEvent,
  RoomJoinedEvent,
  Story,
  StoryCreatedEvent,
  StorySetActiveEvent
} from "../util/types.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import CreateStoryModal from "../components/modal/CreateStoryModal.tsx";

const Room = () => {

  const {roomId} = useParams();

  const [players, setPlayers] = useState<string[]>([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isCreateStoryLoading, setIsCreateStoryLoading] = useState<boolean>(false);
  const [setIsActiveStoryLoading, setSetIsActiveStoryLoading] = useState<boolean>(false);

  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState<boolean>(false);

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
        setStories(roomJoinedEvent.stories);

        setIsPageLoading(false);
      } else if (eventData.action === "playerJoined") {
        const playerJoinedEvent = eventData as PlayerJoinedEvent;

        setPlayers(prevPlayers => [...prevPlayers, playerJoinedEvent.player.username]);
      } else if (eventData.action === "storyCreated") {
        const storyCreatedEvent = eventData as StoryCreatedEvent;
        setStories(stories => [...stories, storyCreatedEvent.story]);

        setIsCreateStoryLoading(false);
        setIsCreateStoryModalOpen(false);
      } else if (eventData.action === "storySetActive") {
        const storySetActiveEvent = eventData as StorySetActiveEvent;
        setActiveStory(storySetActiveEvent.story);
      }
    }

    ws.onerror = (event) => {
      console.log(event);
    }

    return () => ws.close();
  }, []);

  const handleCreateStory = (name: string, description: string) => {
    wsRef.current?.send(JSON.stringify({
      action: "create-story",
      roomId: roomId,
      name: name,
      description: description
    }));
    setIsCreateStoryLoading(true);
  }

  const handleSetActiveStory = (storyId: string) => {
    wsRef.current?.send(JSON.stringify({
      action: "set-active-story",
      roomId: roomId,
      storyId: storyId
    }));
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
        <button onClick={() => setIsCreateStoryModalOpen(true)}>
          Create Story
        </button>
      )}

      {stories.map((story: Story) => {
        const isActive = activeStory?.storyId === story.storyId;

        return (
          <div
            key={story.storyId}
            onClick={() => handleSetActiveStory(story.storyId)}
            style={{
              cursor: "pointer",
              color: isActive ? "red" : "inherit",
              fontWeight: isActive ? "bold" : "normal"
            }}
          >
            {story.name}
          </div>
        );
      })}

      {isCreateStoryModalOpen && (
        <CreateStoryModal
          onClose={() => setIsCreateStoryModalOpen(false)}
          onCreateStory={handleCreateStory}
          isLoading={isCreateStoryLoading}
        />
      )}
    </>
  );
}

export default Room;
