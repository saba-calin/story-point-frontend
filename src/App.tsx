import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import Landing from "./pages/Landing.tsx";
import SignUp from "./pages/SignUp.tsx";
import LogIn from "./pages/LogIn.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import Room from "./pages/Room.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AuthProvider from "./context/AuthContext.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<AuthProvider><Outlet /></AuthProvider>}>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<LogIn />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/room/:roomId" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
