const AuthLoader = () => {
  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center gap-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight text-gray-900">Story Point</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-900 text-xl leading-none select-none animate-bounce" style={{ animationDelay: "0ms" }}>◆</span>
        <span className="text-gray-900 text-xl leading-none select-none animate-bounce" style={{ animationDelay: "150ms" }}>◆</span>
        <span className="text-gray-900 text-xl leading-none select-none animate-bounce" style={{ animationDelay: "300ms" }}>◆</span>
      </div>

      {/* Label */}
      <p className="text-xs text-gray-400 tracking-wide">Loading…</p>
    </div>
  );
}

export default AuthLoader;
