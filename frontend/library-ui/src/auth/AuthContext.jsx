import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const value = useMemo(() => ({
    token,
    isAuthed: !!token,
    login: async (dto) => {
      const res = await apiLogin(dto);
      setToken(res.token);
    },
    register: async (dto) => { await apiRegister(dto); },
    logout: () => setToken(null)
  }), [token]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
