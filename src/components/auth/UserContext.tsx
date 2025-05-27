import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface UserJWT {
  id: number;
  rol: string;
  tenantId: number;
  exp: number;
  iat: number;
  sub: string;
}
interface User {
  id: number;
  rol: string;
  tenantId: number;
  exp: number;
  iat: number;
  email: string;
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: UserJWT = jwtDecode<UserJWT>(token);
        const currentTime = Date.now() / 1000; // en segundos
        if (decoded.exp && decoded.exp > currentTime) {
          setUser({
            id: decoded.id || 0,
            email: decoded.sub,
            rol: decoded.rol,
            tenantId: decoded.tenantId,
            exp: decoded.exp,
            iat: decoded.iat,
          });
        } else {
          console.warn("Token expirado");
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Fallo al decodificar el token", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user && user.exp > Date.now() / 1000,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
