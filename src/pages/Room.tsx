import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {
  type PlayerJoinedEvent,
  type RoomJoinedEvent,
  type Story,
  type StoryCreatedEvent,
  type StorySetActiveEvent, StoryStatus, VALID_VOTES
} from "../util/types.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import CreateStoryModal from "../components/modal/CreateStoryModal.tsx";
import SetActiveStoryModal from "../components/modal/SetStoryActiveModal.tsx";

const Room = () => {

  const {roomId} = useParams();

  const [players, setPlayers] = useState<string[]>([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isCreateStoryLoading, setIsCreateStoryLoading] = useState<boolean>(false);
  const [isSetActiveStoryLoading, setIsSetActiveStoryLoading] = useState<boolean>(false);

  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState<boolean>(false);
  const [setActiveStoryModalData, setSetActiveStoryModalData] = useState<{
    storyId: string,
    storyName: string,
    storyDescription: string,
    isActive: boolean
  } | null>(null);

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
        setActiveStory(roomJoinedEvent.stories.find(s => s.status === StoryStatus.ACTIVE) || null);

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

        setIsSetActiveStoryLoading(false);
        setSetActiveStoryModalData(null);
      } else if (eventData.action === "playerVoted") {

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
    setIsSetActiveStoryLoading(true);
  }

  const handleVote = (voteValue: string) => {
    wsRef.current?.send(JSON.stringify({
      action: "vote",

    }));
    console.log(voteValue);
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
            onClick={() => setSetActiveStoryModalData({
              storyId: story.storyId,
              storyName: story.name,
              storyDescription: story.description,
              isActive: isActive
            })}
            className={`cursor-pointer ${isActive ? 'text-red-500 font-bold' : ''}`}
          >
            {story.name}
          </div>
        );
      })}

      <div>
        Active Story: name: {activeStory?.name}, description: {activeStory?.description}
      </div>

      {VALID_VOTES.map((voteValue: string) => (
        <div key={voteValue} onClick={() => handleVote(voteValue)}>
          {voteValue}
        </div>
      ))}

      {isCreateStoryModalOpen && (
        <CreateStoryModal
          onClose={() => setIsCreateStoryModalOpen(false)}
          onCreateStory={handleCreateStory}
          isLoading={isCreateStoryLoading}
        />
      )}

      {setActiveStoryModalData && (
        <SetActiveStoryModal
          onClose={() => setSetActiveStoryModalData(null)}
          onSetActive={() => handleSetActiveStory(setActiveStoryModalData.storyId)}
          storyName={setActiveStoryModalData.storyName}
          storyDescription={setActiveStoryModalData.storyDescription}
          isActive={setActiveStoryModalData.isActive}
          isRoomOwner={roomOwner === user?.username}
          isLoading={isSetActiveStoryLoading}
        />
      )}
    </>
  );
}

export default Room;
