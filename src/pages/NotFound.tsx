import {useNavigate} from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">Story Point</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
            <span className="text-2xl text-gray-400">◇</span>
          </div>

          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Page not found
          </h1>

          <p className="text-sm text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
          >
            Go back home
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-100">
        © {new Date().getFullYear()} Story Point
      </footer>
    </div>
  );
}

export default NotFound;