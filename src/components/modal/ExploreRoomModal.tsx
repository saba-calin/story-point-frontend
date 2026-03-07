import {useEffect, useState} from "react";
import type {Story, Vote} from "../../util/types.ts";
import roomApi from "../../api/roomApi.ts";
import storyApi from "../../api/storyApi.ts";

interface IOwnProps {
  roomId: string;
  roomName: string;
  onClose: () => void;
}

const ExploreRoomModal = ({roomId, roomName, onClose}: IOwnProps) => {

  const [stories, setStories] = useState<Story[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, Vote[]>>({});
  const [fetchingVotesFor, setFetchingVotesFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await roomApi.getStoriesByRoomId(roomId);
        setStories(response.data.stories);
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStories();
  }, []);

  const handleToggleStory = async (storyId: string) => {
    if (expandedStoryId === storyId) {
      setExpandedStoryId(null);
      return;
    }

    setExpandedStoryId(storyId);

    if (votes[storyId]) {
      return;
    }

    setFetchingVotesFor(storyId);
    try {
      const response = await storyApi.getVotesByStoryId(storyId);
      setVotes(prev => ({
        ...prev,
        [storyId]: response.data.votes
      }));
    } catch (error: any) {
      console.error(error);
    } finally {
      setFetchingVotesFor(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 overflow-hidden flex flex-col"
        style={{maxHeight: "80vh"}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{roomName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isFetching ? "Loading..." : `${stories.length} ${stories.length === 1 ? "story" : "stories"}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-2">
          {isFetching ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-sm">Loading stories...</span>
            </div>
          ) : stories.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-xl mb-2">◇</div>
              <p className="text-sm text-gray-400">No stories</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stories.map(story => {
                const isExpanded = expandedStoryId === story.storyId;
                const storyVotes = votes[story.storyId] ?? [];
                const isLoadingVotes = fetchingVotesFor === story.storyId;

                return (
                  <div key={story.storyId}>
                    <button
                      onClick={() => handleToggleStory(story.storyId)}
                      className="w-full flex items-center justify-between gap-3 py-3.5 text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <svg
                          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{story.name}</p>
                          {story.description && !isExpanded && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{story.description}</p>
                          )}
                        </div>
                      </div>
                      {story.storyEstimation ? (
                        <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                          {story.storyEstimation}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 shrink-0">Not estimated</span>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pb-4 pl-6">
                        {story.description && (
                          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{story.description}</p>
                        )}

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Votes</p>

                        {isLoadingVotes ? (
                          <div className="flex items-center gap-2 text-gray-400 py-2">
                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            <span className="text-xs">Loading votes...</span>
                          </div>
                        ) : storyVotes.length === 0 ? (
                          <p className="text-xs text-gray-300">No votes yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {storyVotes.map(vote => (
                              <div
                                key={vote.username}
                                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5"
                              >
                                <span className="text-xs text-gray-600">{vote.username}</span>
                                <span className="text-xs font-semibold text-gray-900 ml-1">
                                  {vote.voteValue ?? "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreRoomModal;
