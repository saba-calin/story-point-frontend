import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LogIn from "./pages/LogIn.tsx";
import SignUp from "./pages/SignUp.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<App />*/}
    {/*<LogIn />*/}
    <SignUp />
  </StrictMode>,
)
