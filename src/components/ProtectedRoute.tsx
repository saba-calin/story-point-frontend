import {type ReactNode, useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";
import AuthLoader from "./AuthLoader.tsx";
import type {UserRole} from "../util/types.ts";
import NotFound from "../pages/NotFound.tsx";

const ProtectedRoute = ({children, allowedRoles}: {children: ReactNode, allowedRoles?: UserRole[]}) => {
  const {user, isAuthLoading} = useContext(AuthContext)!;

  if (isAuthLoading) {
    return <AuthLoader />;
  }

  if (!user) {
    return <Navigate to="/log-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  return (
    <>
      {children}
    </>
  );
}

export default ProtectedRoute;
