import {createContext, type ReactNode, useEffect, useState} from "react";
import type {AuthContextType, User} from "../util/types.ts";
import authApi from "../api/authApi.ts";

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({children} : {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.authMe();
        const user: User = response.data;
        setUser(user);

      } catch (error: any) {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, isAuthLoading}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
