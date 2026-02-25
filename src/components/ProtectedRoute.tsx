import {type ReactNode, useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";

const ProtectedRoute = ({children}: {children: ReactNode}) => {
  const {user, isLoading} = useContext(AuthContext)!;

  if (isLoading) {
    return (
      <div>
        Loading Auth Me
      </div>
    );
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
