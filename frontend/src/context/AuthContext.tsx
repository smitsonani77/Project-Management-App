"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/utils/api";

interface User {
  id: number;
  username: string;
  email: string;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = window.localStorage.getItem("token");
    const u = window.localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch(err){
        console.log('Failed to parse user from localStorage', err);
      }
    }
  }, []);

  const persist = (tk: string, usr: User) => {
    setToken(tk);
    setUser(usr);
    window.localStorage.setItem("token", tk);
    window.localStorage.setItem("user", JSON.stringify(usr));
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const data =  res.data;
    const { token: tk, user: usr } = data;
    persist(tk, usr);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const res = await api.post("/auth/register", { username, email, password });
    const { token: tk, user: usr } = res;
    persist(tk, usr);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
