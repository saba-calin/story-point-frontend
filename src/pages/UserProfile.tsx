import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";

const UserProfile = () => {

  const navigate = useNavigate();
  const {user} = useContext(AuthContext)!;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <header className="px-8 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-tight text-gray-800">Profile</span>
        </div>
        <div className="w-8 h-8" />
      </header>

      <main className="flex-1 px-8 py-10 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your account details.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-100 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-400 mt-0.5">@{user?.username}</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">First name</span>
              <span className="text-sm text-gray-900 font-medium">{user?.firstName}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last name</span>
              <span className="text-sm text-gray-900 font-medium">{user?.lastName}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</span>
              <span className="text-sm text-gray-900 font-medium">@{user?.username}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
              <span className="text-sm text-gray-900 font-medium">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-100">
        © {new Date().getFullYear()} Story Point
      </footer>
    </div>
  );
}

export default UserProfile;