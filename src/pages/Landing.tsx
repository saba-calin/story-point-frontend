import {useNavigate} from "react-router-dom";

const Landing = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>

      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">Story Point</span>
        </div>
        <button
          onClick={() => navigate("/log-in")}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          Log in →
        </button>
      </nav>

      <main className="flex flex-col items-center justify-center flex-1 px-6 text-center py-20">
        <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          Real-time planning for agile teams
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 leading-tight max-w-2xl mb-5">
          Estimate together,<br />
          <span className="text-gray-300">ship faster.</span>
        </h1>

        <p className="text-sm text-gray-400 max-w-xs mb-10 leading-relaxed">
          Create a room, invite your team, and vote on story points — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate("/sign-up")}
            className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-medium text-sm rounded-xl px-6 py-3 transition-colors cursor-pointer"
          >
            Get started free
          </button>
          <button
            onClick={() => navigate("/log-in")}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl px-6 py-3 border border-gray-200 transition-colors cursor-pointer"
          >
            Log in
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-100">
        © {new Date().getFullYear()} Story Point
      </footer>

    </div>
  );
};

export default Landing;
