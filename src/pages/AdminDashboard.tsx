import {useContext, useEffect, useState} from "react";
import ExploreRoomModal from "../components/modal/ExploreRoomModal.tsx";
import {AuthContext} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import type {RoomResponse, User, UsersResponse} from "../util/types.ts";
import roomApi from "../api/roomApi.ts";
import userApi from "../api/userApi.ts";
import authApi from "../api/authApi.ts";

type Tab = "rooms" | "users";

const AdminDashboard = () => {

  const {user} = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("rooms");

  const [roomResponse, setRoomResponse] = useState<RoomResponse | null>(null);
  const [isFetchingRooms, setIsFetchingRooms] = useState<boolean>(true);
  const [isFetchingNextRooms, setIsFetchingNextRooms] = useState<boolean>(false);
  const [isFetchingPrevRooms, setIsFetchingPrevRooms] = useState<boolean>(false);
  const [roomTokenHistory, setRoomTokenHistory] = useState<(string | undefined)[]>([undefined]);
  const [roomCurrentPage, setRoomCurrentPage] = useState<number>(0);
  const [exploreRoom, setExploreRoom] = useState<{roomId: string, roomName: string} | null>(null);

  const [usersResponse, setUsersResponse] = useState<UsersResponse | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(true);
  const [isFetchingNextUsers, setIsFetchingNextUsers] = useState<boolean>(false);
  const [isFetchingPrevUsers, setIsFetchingPrevUsers] = useState<boolean>(false);
  const [userTokenHistory, setUserTokenHistory] = useState<(string | undefined)[]>([undefined]);
  const [userCurrentPage, setUserCurrentPage] = useState<number>(0);
  const [banningUser, setBanningUser] = useState<string | null>(null);

  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [isImageError, setIsImageError] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const USERS_PAGE_LIMIT = 10;

  const getRoomsPageLimit = (): number => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cols = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
    const CHROME_HEIGHT = 350;
    const CARD_HEIGHT = 165;
    const GAP = 16;
    const availableHeight = height - CHROME_HEIGHT;
    const rows = Math.max(1, Math.floor((availableHeight + GAP) / (CARD_HEIGHT + GAP)));
    return rows * cols;
  };
  const [roomsPageLimit] = useState(() => getRoomsPageLimit());

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
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (activeTab !== "users" || usersResponse) return;
    const fetchUsers = async () => {
      try {
        const response = await userApi.getUsers(USERS_PAGE_LIMIT);
        setUsersResponse(response.data);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsFetchingUsers(false);
      }
    };
    fetchUsers();
  }, [activeTab]);

  const handleNextRoomPage = async () => {
    setIsFetchingNextRooms(true);
    try {
      const response = await roomApi.getRooms(roomsPageLimit, roomResponse?.nextToken);
      const data = response.data as RoomResponse;
      if (data.rooms.length === 0) {
        setRoomResponse(prev => prev ? ({...prev, hasMore: false}) : null);
        return;
      }
      setRoomResponse(data);
      setRoomTokenHistory(prev => [...prev.slice(0, roomCurrentPage + 1), roomResponse?.nextToken]);
      setRoomCurrentPage(p => p + 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingNextRooms(false);
    }
  };

  const handlePrevRoomPage = async () => {
    setIsFetchingPrevRooms(true);
    try {
      const prevToken = roomTokenHistory[roomCurrentPage - 1];
      const response = await roomApi.getRooms(roomsPageLimit, prevToken);
      setRoomResponse(response.data);
      setRoomCurrentPage(p => p - 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingPrevRooms(false);
    }
  };

  const handleNextUserPage = async () => {
    setIsFetchingNextUsers(true);
    try {
      const response = await userApi.getUsers(USERS_PAGE_LIMIT, usersResponse?.nextToken);
      const data = response.data as UsersResponse;
      if (data.users.length === 0) {
        setUsersResponse(prev => prev ? ({...prev, hasMore: false}) : null);
        return;
      }
      setUsersResponse(data);
      setUserTokenHistory(prev => [...prev.slice(0, userCurrentPage + 1), usersResponse?.nextToken]);
      setUserCurrentPage(p => p + 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingNextUsers(false);
    }
  };

  const handlePrevUserPage = async () => {
    setIsFetchingPrevUsers(true);
    try {
      const prevToken = userTokenHistory[userCurrentPage - 1];
      const response = await userApi.getUsers(USERS_PAGE_LIMIT, prevToken);
      setUsersResponse(response.data);
      setUserCurrentPage(p => p - 1);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsFetchingPrevUsers(false);
    }
  };

  const handleBanUser = async (username: string) => {
    setBanningUser(username);
    try {
      await userApi.banUser({username});
      setUsersResponse(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map(u => u.username === username ? {...u, isBanned: true} : u)
        };
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setBanningUser(null);
    }
  };

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logOut();
    } finally {
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  const renderPagination = (
    currentPage: number,
    hasMore: boolean | undefined,
    isFetchingNext: boolean,
    isFetchingPrev: boolean,
    onNext: () => void,
    onPrev: () => void
  ) => {
    if (currentPage === 0 && !hasMore) return null;
    return (
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onPrev}
          disabled={currentPage === 0 || isFetchingPrev}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isFetchingPrev ? (
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
          onClick={onNext}
          disabled={!hasMore || isFetchingNext}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          {isFetchingNext ? (
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <header className="px-8 h-16 flex items-center justify-between border-b border-gray-200 bg-white">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-800">Story Point</span>
          <span className="text-xs font-medium text-white bg-gray-900 px-2 py-0.5 rounded-full ml-1">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogOut}
            disabled={isLoggingOut}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </button>
          <div
            onClick={() => navigate("/user-profile")}
            className="relative w-10 h-10 shrink-0 cursor-pointer"
          >
            {user?.profilePictureKey && !isImageError ? (
              <>
                {isImageLoading && (
                  <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" stroke="#e5e7eb" strokeWidth="3"/>
                    <path d="M 32 2 A 30 30 0 0 1 62 32" stroke="#374151" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                )}
                <img
                  src={`${import.meta.env.VITE_CDN_BASE_URL}/${user.profilePictureKey}`}
                  className={`w-full h-full rounded-full object-cover border border-gray-200 hover:opacity-80 transition-all duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => { setIsImageLoading(false); setIsImageError(true); }}
                />
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold hover:bg-gray-200 transition-colors">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-10 max-w-5xl mx-auto w-full">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "rooms" ? "All rooms" : "All users"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {activeTab === "rooms" ? "View and manage all planning rooms." : "View and manage all users."}
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === "rooms"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Rooms
            {activeTab === "rooms" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === "users"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Users
            {activeTab === "users" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {activeTab === "rooms" && (
          <>
            {isFetchingRooms ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-sm">Loading rooms...</span>
              </div>
            ) : (roomResponse?.rooms && roomResponse.rooms.length > 0) ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomResponse!.rooms.map(room => (
                    <div
                      key={room.roomId}
                      onClick={() => setExploreRoom({roomId: room.roomId, roomName: room.roomName})}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
                    >
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                          {room.roomName}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Owned by @{room.ownerUsername}
                        </p>
                      </div>
                      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-center">
                        <span className="text-xs font-mono text-gray-300 truncate mr-2">{room.roomId}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination(roomCurrentPage, roomResponse?.hasMore, isFetchingNextRooms, isFetchingPrevRooms, handleNextRoomPage, handlePrevRoomPage)}
              </>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center">
                <div className="text-2xl mb-3">◇</div>
                <p className="text-sm font-medium text-gray-500">No rooms yet</p>
                <p className="text-xs text-gray-400 mt-1">No planning rooms have been created.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "users" && (
          <>
            {isFetchingUsers ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span className="text-sm">Loading users...</span>
              </div>
            ) : (usersResponse?.users && usersResponse.users.length > 0) ? (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    <span>User</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span className="w-20"></span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {usersResponse.users.map((u: User) => (
                      <div key={u.username} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          {u.profilePictureKey ? (
                            <img
                              src={`${import.meta.env.VITE_CDN_BASE_URL}/${u.profilePictureKey}`}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-semibold shrink-0 ${u.profilePictureKey ? "hidden" : ""}`}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                            <p className="text-xs text-gray-400 truncate">@{u.username}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 truncate">{u.email}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                          u.role === "admin"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {u.role}
                        </span>
                        <div className="w-20 flex justify-end">
                          {u.username !== user?.username && u.role !== "admin" && (
                            u.isBanned ? (
                              <span className="text-xs font-medium text-gray-400">Banned</span>
                            ) : (
                              <button
                                onClick={() => handleBanUser(u.username)}
                                disabled={banningUser === u.username}
                                className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                              >
                                {banningUser === u.username ? (
                                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                  </svg>
                                ) : "Ban"}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {renderPagination(userCurrentPage, usersResponse?.hasMore, isFetchingNextUsers, isFetchingPrevUsers, handleNextUserPage, handlePrevUserPage)}
              </>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center">
                <div className="text-2xl mb-3">◇</div>
                <p className="text-sm font-medium text-gray-500">No users</p>
                <p className="text-xs text-gray-400 mt-1">No users have signed up yet.</p>
              </div>
            )}
          </>
        )}
      </main>

      {exploreRoom && (
        <ExploreRoomModal
          roomId={exploreRoom.roomId}
          roomName={exploreRoom.roomName}
          onClose={() => setExploreRoom(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
