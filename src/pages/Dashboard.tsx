import {useContext, useEffect, useState} from "react";
import CreateRoomModal from "../components/modal/CreateRoomModal.tsx";
import {AuthContext} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import type {Rooms} from "../util/types.ts";
import roomApi from "../api/roomApi.ts";

const Dashboard = () => {

  const {user} = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Rooms[] | null>(null);
  const [isFetchingRooms, setIsFetchingRooms] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomApi.getRooms();
        console.log(response.data);
        setRooms(response.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingRooms(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 12l10 10 10-10L12 2z"/>
          </svg>
          <span className="text-sm font-semibold tracking-tight text-gray-800">Rooms</span>
        </div>
        <div onClick={() => navigate("/user-profile")}
          className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold cursor-pointer">
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
          <div>
            Fetching Rooms
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center">
            <div className="text-2xl mb-3">◇</div>
            <p className="text-sm font-medium text-gray-500">No rooms yet</p>
            <p className="text-xs text-gray-400 mt-1">Click <span className="font-medium">+ New room</span> to create one.</p>
          </div>
        )}
      </main>

      {isModalOpen && <CreateRoomModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;
