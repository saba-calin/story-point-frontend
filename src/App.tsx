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

  const handleConnectToWs = () => {
    const ws = new WebSocket("wss://ws.story-point.xyz");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
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
        <p>
          Edit <code>src/App.tsx</code> , and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
