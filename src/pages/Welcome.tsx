import {useNavigate} from "react-router-dom";

const Welcome = () => {

  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
          <svg
            className="h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Story Point
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Plan smarter. Estimate better. Ship faster.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-md shadow-indigo-100 px-8 py-10">
        <div className="space-y-4">
          <button
            onClick={() => navigate("/log-in")}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-colors"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm/6 font-semibold text-indigo-600 border border-indigo-200 shadow-xs hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-colors"
          >
            Create an Account
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
