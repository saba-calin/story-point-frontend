import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {CreateRoomRequest, CreateRoomResponse} from "../../util/types.ts";
import roomApi from "../../api/roomApi.ts";

interface IOwnProps {
  onClose: () => void;
}

const CreateRoomModal = ({onClose}: IOwnProps) => {

  const [roomName, setRoomName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    onClose();
  }

  const handleCreateRoom = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const createRoomRequest: CreateRoomRequest = { name: roomName };
      const response = await roomApi.createRoom(createRoomRequest);
      const createdRoom: CreateRoomResponse = response.data;
      navigate(`/room/${createdRoom.roomId}`);

    } catch (error: any) {
      setErrorMessage(error.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">New room</h2>
            <p className="text-xs text-gray-400 mt-0.5">Give your room a name to get started.</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none mt-0.5 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-xs font-medium text-gray-500 mb-1.5">
              Room name
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Sprint Planning #4"
              required
              autoFocus
              disabled={isLoading}
              className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-500">{errorMessage}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !roomName.trim()}
              className="flex-1 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating…
                </>
              ) : "Create →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
