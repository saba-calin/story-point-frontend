import {useContext, useEffect, useState} from "react";
import CreateRoomModal from "../components/modal/CreateRoomModal.tsx";
import {AuthContext} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import type {RoomResponse} from "../util/types.ts";
import roomApi from "../api/roomApi.ts";

const Dashboard = () => {

  const {user} = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [roomResponse, setRoomResponse] = useState<RoomResponse | null>(null);
  const [isFetchingRooms, setIsFetchingRooms] = useState<boolean>(true);
  const [isFetchingNextRooms, setIsFetchingNextRooms] = useState<boolean>(false);
  const [isFetchingPrevRooms, setIsFetchingPrevRooms] = useState<boolean>(false);
  const [tokenHistory, setTokenHistory] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const roomsPageLimit = import.meta.env.VITE_ROOMS_PAGEf_LIMIT || 3;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomApi.getRooms(roomsPageLimit);
        setRoomResponse(response.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingRooms(false);
      }
    }

    fetchRooms();
  }, []);

  const handleNextPage = async () => {
    setIsFetchingNextRooms(true);
    try {
      const response = await roomApi.getRooms(roomsPageLimit, roomResponse?.nextToken);
      const data = response.data as RoomResponse;

      if (data.rooms.length === 0) {
        setRoomResponse(prev => prev ? ({...prev, hasMore: false}) : null);
        return;
      }

      setRoomResponse(data);
      setTokenHistory(prev => [...prev.slice(0, currentPage + 1), roomResponse?.nextToken]);
      setCurrentPage(p => p + 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingNextRooms(false);
    }
  }

  const handlePrevPage = async () => {
    setIsFetchingPrevRooms(true);
    try {
      const prevToken = tokenHistory[currentPage - 1];
      const response = await roomApi.getRooms(roomsPageLimit, prevToken);
      setRoomResponse(response.data);
      setCurrentPage(p => p - 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingPrevRooms(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-800">Story Point</span>
        </div>
        <div
          onClick={() => navigate("/user-profile")}
          className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold cursor-pointer"
        >
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </header>

      <main className="flex-1 px-8 py-10 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Your rooms</h1>
            <p className="text-sm text-gray-400 mt-0.5">Create or join a planning room.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            + New room
          </button>
        </div>

        {isFetchingRooms ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="text-sm">Loading rooms...</span>
          </div>
        ) : roomResponse?.rooms && roomResponse.rooms.length > 0 ? (
          <>
            <div className="space-y-3">
              {roomResponse.rooms.map(room => {
                const isOwner = user?.username === room.ownerUsername;
                return (
                  <div
                    key={room.roomId}
                    onClick={() => navigate(`/room/${room.roomId}`)}
                    className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{room.roomName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {isOwner ? "Created by you" : `Owned by @${room.ownerUsername}`}
                        </p>
                        <p className="text-xs text-gray-300 mt-0.5 font-mono">{room.roomId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        isOwner
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {isOwner ? "Owner" : "Participant"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {(currentPage > 0 || roomResponse?.hasMore) && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isFetchingPrevRooms}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isFetchingPrevRooms ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                  )}
                  Previous
                </button>

                <span className="text-xs text-gray-400">Page {currentPage + 1}</span>

                <button
                  onClick={handleNextPage}
                  disabled={!roomResponse?.hasMore || isFetchingNextRooms}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                  {isFetchingNextRooms ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center">
            <div className="text-2xl mb-3">◇</div>
            <p className="text-sm font-medium text-gray-500">No rooms yet</p>
            <p className="text-xs text-gray-400 mt-1">Click <span className="font-medium">+ New room</span> to create one.</p>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-100">
        © {new Date().getFullYear()} Story Point
      </footer>

      {isModalOpen && <CreateRoomModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;