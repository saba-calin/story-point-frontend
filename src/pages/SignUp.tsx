import {useContext, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {type SignUpRequest, type User, UserRole} from "../util/types.ts";
import authApi from "../api/authApi.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import AuthLoader from "../components/AuthLoader.tsx";
import {setAccessTokenExpiry} from "../api/axiosInstance.ts";

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
    return <AuthLoader />;
  }
  if (user) {
    return <Navigate to={user.role === UserRole.USER ? "/dashboard" : "/admin-dashboard"} replace />
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
      const user: User = response.data.userContext;

      setUser(user);
      setAccessTokenExpiry(user.accessTokenDuration);
      // no need to route based on role because all users have the 'USER' role as default
      navigate("/dashboard");

    } catch (error: any) {
      setErrorMessage(error.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{fontFamily: "'DM Sans', sans-serif"}}>
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">Story Point</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an account</h1>
            <p className="text-sm text-gray-400">Get started with Story Point</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form className="space-y-4" onSubmit={handleSignUp}>
              {errorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-500 mb-1.5">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-gray-500 mb-1.5">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="confirmedPassword" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirmedPassword"
                  name="confirmedPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-center gap-2 disabled:cursor-not-allowed cursor-pointer mt-6"
              >
                {isLoading && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate("/log-in")}
                className="font-semibold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-300 py-5 border-t border-gray-100">
        © {new Date().getFullYear()} Story Point
      </footer>
    </div>
  );
}

export default SignUp;
