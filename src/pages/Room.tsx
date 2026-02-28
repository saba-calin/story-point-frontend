import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {
  type PlayerJoinedEvent, type PlayerLeftEvent, type PlayerVotedEvent,
  type RoomJoinedEvent,
  type Story,
  type StoryCreatedEvent,
  type StorySetActiveEvent, StoryStatus, VALID_VOTES, type VotesRevealedEvent
} from "../util/types.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import CreateStoryModal from "../components/modal/CreateStoryModal.tsx";
import SetActiveStoryModal from "../components/modal/SetStoryActiveModal.tsx";

const Room = () => {

  const {roomId} = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<string[]>([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [votes, setVotes] = useState<Map<string, string | null>>(new Map());
  const [hasRevealedVotes, setHasRevealedVotes] = useState<boolean>(false);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isVotingLoading, setIsVotingLoading] = useState<boolean>(false);
  const [isRevealingVotesLoading, setIsRevealingVotesLoading] = useState<boolean>(false);
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
        const activeStory = roomJoinedEvent.stories.find(s => s.status === StoryStatus.ACTIVE) || null;
        setPlayers(roomJoinedEvent.players);
        setRoomOwner(roomJoinedEvent.room.ownerUsername);
        setStories(roomJoinedEvent.stories);
        setActiveStory(activeStory);
        setVotes(prevVotes => {
          const newVotes = new Map(prevVotes);
          roomJoinedEvent.votes.forEach(vote => {
            newVotes.set(vote.username, vote.voteValue ? vote.voteValue : null);
          });
          return newVotes;
        });

        activeStory?.storyEstimation ? setHasRevealedVotes(true) : setHasRevealedVotes(false);
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
        setVotes(() => {
          const newVotes = new Map();
          storySetActiveEvent.votes.forEach(vote => {
            newVotes.set(vote.username, vote.voteValue ? vote.voteValue : null);
          });
          return newVotes;
        });

        storySetActiveEvent.story.storyEstimation ? setHasRevealedVotes(true) : setHasRevealedVotes(false);
        setIsSetActiveStoryLoading(false);
        setSetActiveStoryModalData(null);
      } else if (eventData.action === "playerVoted") {
        const playerVotedEvent = eventData as PlayerVotedEvent;

        setVotes(prevVotes => {
          const newVotes = new Map(prevVotes);
          newVotes.set(playerVotedEvent.vote.username, null);
          return newVotes;
        });
        setIsVotingLoading(false);
      } else if (eventData.action === "votesRevealed") {
        const votesRevealedEvent = eventData as VotesRevealedEvent;

        setVotes(prevVotes => {
          const newVotes = new Map(prevVotes);
          votesRevealedEvent.votes.forEach(vote => {
            newVotes.set(vote.username, vote.voteValue);
          });
          return newVotes;
        });
        setActiveStory(prevActiveStory => ({
          ...prevActiveStory!,
          storyEstimation: votesRevealedEvent.storyEstimation
        }));
        setIsRevealingVotesLoading(false);
        setHasRevealedVotes(true);
      } else if (eventData.action == "playerLeft") {
        const playerLeftEvent = eventData as PlayerLeftEvent;

        setPlayers(prevPlayers => prevPlayers.filter(prevPlayer => prevPlayer !== playerLeftEvent.player));
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
      roomId: roomId,
      storyId: activeStory?.storyId,
      voteValue: voteValue
    }));
    setIsVotingLoading(true);
  }

  const handleRevealCards = () => {
    wsRef.current?.send(JSON.stringify({
      action: "reveal",
      roomId: roomId,
      storyId: activeStory?.storyId
    }));
    setIsRevealingVotesLoading(true);
  }

  const handleGoBack = () => {
    navigate("/dashboard");
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
      <button onClick={handleGoBack}>
        Back
      </button>
      <br />
      <br />

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

      {activeStory && (
        <div>
          Active Story: name: {activeStory?.name}, description: {activeStory?.description}
          {activeStory.storyEstimation && (
            <span>
              estimation: {activeStory.storyEstimation}
            </span>
          )}
        </div>
      )}

      {activeStory && !activeStory.storyEstimation && (
        isVotingLoading ? (
          <div>
            Voting...
          </div>
        ) : (
          VALID_VOTES.map((voteValue: string) => (
            <button key={voteValue} onClick={() => handleVote(voteValue)}>
              {voteValue}
            </button>
          ))
        )
      )}

      <div>
        <h3>Votes:</h3>
        {players.map(player => {
          const voteValue = votes.get(player);
          const hasVoted = votes.has(player);

          return (
            <div key={player}>
              {player}: {hasVoted ? (voteValue ? voteValue : '✓ Voted') : 'Not voted'}
            </div>
          );
        })}
      </div>

      <br />
      {roomOwner == user?.username && activeStory && (
        isRevealingVotesLoading ? (
          <div>
            Revealing Votes...
          </div>
        ) : (
          <button onClick={handleRevealCards} disabled={hasRevealedVotes} className="disabled:cursor-not-allowed">
            Reveal Votes
          </button>
        )
      )}

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
