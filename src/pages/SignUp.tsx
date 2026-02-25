import {useContext, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import type {SignUpRequest, User} from "../util/types.ts";
import authApi from "../api/authApi.ts";
import {AuthContext} from "../context/AuthContext.tsx";

const SignUp = () => {

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const {user, setUser, isAuthLoading} = useContext(AuthContext)!;
  if (isAuthLoading) {
    return (
      <div>
        Loading auth...
      </div>
    );
  }
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (password !== confirmedPassword) {
      setErrorMessage("Passwords must match");
      setIsLoading(false);
      return;
    }

    try {
      const signUpRequest: SignUpRequest = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password
      }
      const response = await authApi.signUp(signUpRequest);
      const user: User = response.data.user;

      setUser(user);
      navigate("/dashboard");

    } catch (error: any) {
      setErrorMessage(error.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
      </div>

      <div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white/70 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-md shadow-indigo-100 px-8 py-10">
        <form className="space-y-6" onSubmit={handleSignUp}>
          {errorMessage && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="First Name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Last Name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center">
              <label htmlFor="confirmedPassword" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirmedPassword"
                name="confirmedPassword"
                type="password"
                required
                placeholder="Confirm Password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{' '}
          <a
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => navigate("/log-in")}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
