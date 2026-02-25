import {type ReactNode, useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";
import AuthLoader from "./AuthLoader.tsx";

const ProtectedRoute = ({children}: {children: ReactNode}) => {
  const {user, isAuthLoading} = useContext(AuthContext)!;

  if (isAuthLoading) {
    return <AuthLoader />;
  }

  if (!user) {
    return <Navigate to="/log-in" replace />;
  }

  return (
    <>
      {children}
    </>
  );
}

export default ProtectedRoute;
