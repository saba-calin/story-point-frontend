import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";

function App() {
  const [count, setCount] = useState(0)

  const handleLogIn = async () => {
    const response = await axios.post(
      "https://api.story-point.xyz/log-in",
      {
        "firstName": "Calin",
        "lastName": "Sabaila",
        "username": "saba",
        "email": "saba@gmail.com",
        "password": "Roll.123"
      },
      {
        withCredentials: true
      }
    );
    console.log(response.data);
  };

  const handleCreateRoom = async () => {
    const response = await axios.post(
      "https://api.story-point.xyz/create-room",
      {
        "name": "roommm"
      },
      {
        withCredentials: true
      }
    );
    console.log(response.data);
  }

  let ws: WebSocket;
  const handleConnectToWs = () => {
    ws = new WebSocket("wss://ws.story-point.xyz");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.onclose = (event) => {
      console.log("Connection closed");
      console.log("code:", event.code);
      console.log("reason:", event.reason);
      console.log("wasClean:", event.wasClean);
    }
    ws.onmessage = (event) => {
      console.log("Message received: ", event);
    }
    ws.onerror = (error) => {
      console.log(error);
    }
  }

  const handleSendMessage = () => {
    ws.send(JSON.stringify({
      "action": "test",
      "message": "hello"
    }));
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + Vite</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <br />
        <button onClick={handleLogIn}>Log In</button>
        <br />
        <button onClick={handleCreateRoom}>Create Room</button>
        <br />
        <button onClick={handleConnectToWs}>Connect to WebSocket</button>
        <br />
        <button onClick={handleSendMessage}>Send WebSocket Message</button>
        <p>
          Edit <code>src/App.tsx</code> , and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default App
