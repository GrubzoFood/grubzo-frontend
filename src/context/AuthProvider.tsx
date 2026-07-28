import React, { useEffect, useState } from "react";
import AuthService from "../services/auth/auth.service";
import { AuthContext } from "./authContext";
import type { User } from "../types/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const u = await AuthService.fetchUser();
      if (u?.Email) {
        setUser(u);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
