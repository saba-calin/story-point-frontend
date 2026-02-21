import {BrowserRouter, Routes, Route} from "react-router-dom";
import Welcome from "./pages/Welcome.tsx";
import SignUp from "./pages/SignUp.tsx";
import LogIn from "./pages/LogIn.tsx";
import Dashboard from "./pages/Dashboard.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
