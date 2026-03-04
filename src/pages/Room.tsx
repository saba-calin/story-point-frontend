import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {
  type AiEstimateResponse,
  type PlayerJoinedEvent, type PlayerLeftEvent, type PlayerVotedEvent,
  type RoomJoinedEvent,
  type Story,
  type StoryCreatedEvent,
  type StorySetActiveEvent, StoryStatus, VALID_VOTES, type VotesRevealedEvent
} from "../util/types.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import CreateStoryModal from "../components/modal/CreateStoryModal.tsx";
import SetActiveStoryModal from "../components/modal/SetStoryActiveModal.tsx";
import storyApi from "../api/storyApi.ts";

const Room = () => {

  const {roomId} = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<string[]>([]);
  const [roomOwner, setRoomOwner] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [votes, setVotes] = useState<Map<string, string | null>>(new Map());
  const [vote, setVote] = useState<string | null>(null);
  const [aiEstimate, setAiEstimate] = useState<string | null>(null);
  const [hasRevealedVotes, setHasRevealedVotes] = useState<boolean>(false);
  const [showCopyUrlConfirmation, setShowCopyUrlConfirmation] = useState<boolean>(false);

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isVotingLoading, setIsVotingLoading] = useState<boolean>(false);
  const [isRevealingVotesLoading, setIsRevealingVotesLoading] = useState<boolean>(false);
  const [isCreateStoryLoading, setIsCreateStoryLoading] = useState<boolean>(false);
  const [isSetActiveStoryLoading, setIsSetActiveStoryLoading] = useState<boolean>(false);
  const [isAiEstimateLoading, setIsAiEstimateLoading] = useState<boolean>(false);

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
        setAiEstimate(null);
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
          storyEstimation: votesRevealedEvent.storyEstimationRounded
        }));
        setStories(prevStories =>
          prevStories.map(story =>
            story.storyId !== votesRevealedEvent.storyId ?
              story :
              {...story, storyEstimation: votesRevealedEvent.storyEstimationRounded}
          )
        );
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
    // if (voteValue === vote) {
    //   return;
    // }

    wsRef.current?.send(JSON.stringify({
      action: "vote",
      roomId: roomId,
      storyId: activeStory?.storyId,
      voteValue: voteValue
    }));
    // setVote(voteValue);
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

  const handleShowCopyUrlConfirmation = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyUrlConfirmation(true);
    setTimeout(() => setShowCopyUrlConfirmation(false), 1500);
  }

  const handleGoBack = () => {
    navigate("/dashboard");
  }

  const handleAiEstimate = async () => {
    try {
      setIsAiEstimateLoading(true);
      const response = await storyApi.aiEstimate({
        storyName: activeStory?.name,
        storyDescription: activeStory?.description
      });
      const data = response.data as AiEstimateResponse;
      setAiEstimate(data.estimate);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAiEstimateLoading(false);
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"
           style={{fontFamily: "'DM Sans', sans-serif"}}>
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm">Loading room...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-tight text-gray-800">
            {roomOwner}'{roomOwner?.endsWith("s") ? '' : 's'} room
          </span>
          <button
            onClick={handleShowCopyUrlConfirmation}
            className="relative text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Copy room URL"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            {showCopyUrlConfirmation && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                Invite link copied to clipboard!
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {activeStory && (
            aiEstimate ? (
              <div className="h-9 flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-sm font-medium px-4 rounded-lg text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                AI: {aiEstimate}
              </div>
            ) : isAiEstimateLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-xs text-gray-400">Estimating...</span>
              </div>
            ) : (
              <button
                onClick={handleAiEstimate}
                className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                AI estimate
              </button>
            )
          )}
          {roomOwner === user?.username && (
            <button
              onClick={() => setIsCreateStoryModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              + New story
            </button>
          )}
          <div onClick={() => navigate("/user-profile")}
            className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold cursor-pointer">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stories</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {stories.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-400">No stories yet</p>
                  </div>
                ) : (
                  stories.map((story: Story) => {
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
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isActive ? 'bg-gray-50 border-l-2 border-l-gray-900' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0"></div>
                            )}
                            <span
                              className={`text-sm truncate ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                              {story.name}
                            </span>
                          </div>
                          {story.storyEstimation && (
                            <span
                              className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                              {story.storyEstimation}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {activeStory ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{activeStory.name}</h3>
                    <p className="text-sm text-gray-500">{activeStory.description}</p>
                  </div>
                  {activeStory.storyEstimation && (
                    <div className="ml-4 bg-gray-100 rounded-lg px-4 py-2 text-center">
                      <div className="text-xs text-gray-500 mb-0.5">Estimation</div>
                      <div className="text-2xl font-semibold text-gray-900">{activeStory.storyEstimation}</div>
                    </div>
                  )}
                </div>

                {!activeStory.storyEstimation && (
                  <div className="mt-6">
                    <div className="text-xs font-medium text-gray-500 mb-3">Cast your vote</div>
                    {isVotingLoading ? (
                      <div className="flex items-center justify-center py-4 text-gray-400">
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-sm">Submitting vote...</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {VALID_VOTES.map((voteValue: string) => (
                          <button
                            key={voteValue}
                            onClick={() => handleVote(voteValue)}
                            className={`border-2 font-semibold rounded-lg w-14 h-14 transition-all duration-150 cursor-pointer 
                              ${vote === voteValue ? 'bg-gray-900 text-white border-gray-900' : 'bg-white hover:bg-gray-900 hover:text-white border-gray-200 hover:border-gray-900 text-gray-900'}`}
                          >
                            {voteValue}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {roomOwner === user?.username && activeStory && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    {isRevealingVotesLoading ? (
                      <div className="flex items-center justify-center py-2 text-gray-400">
                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-sm">Revealing votes...</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleRevealCards}
                        disabled={hasRevealedVotes}
                        className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {hasRevealedVotes ? 'Votes revealed' : 'Reveal votes'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                <div className="text-2xl mb-3">◇</div>
                <p className="text-sm font-medium text-gray-500">No active story</p>
                <p className="text-xs text-gray-400 mt-1">
                  {roomOwner === user?.username ?
                    "Select a story from the sidebar to start voting" :
                    "Waiting on the moderator to select a story"}
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Players ({players.length})
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {players.map(player => {
                    const voteValue = votes.get(player);
                    const hasVoted = votes.has(player);
                    const isOwner = player === roomOwner;

                    return (
                      <div
                        key={player}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-600 font-semibold">
                            {player.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate flex-1">
                            {player}
                          </span>
                          {isOwner && (
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd"
                                    d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-.506.135h-.008a.995.995 0 01-.506-.135l-1.734-.992a1 1 0 01-.372-1.364z"
                                    clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center justify-center h-12 bg-white rounded border border-gray-200">
                          {hasVoted ? (
                            voteValue ? (
                              <span className="text-xl font-semibold text-gray-900">{voteValue}</span>
                            ) : (
                              <span className="text-emerald-500 text-sm font-medium">✓ Voted</span>
                            )
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
}

export default Room;
