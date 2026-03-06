import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");

    // token chaina bhane /me call nagarne
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data?.user || res.data || null);
    } catch (err) {
      // token invalid/expired bhaye clear garne
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data?.token;
    const u = res.data?.user;

    if (token) localStorage.setItem("token", token);

    if (u) setUser(u);
    else await fetchMe();

    return res.data;
  };

  const register = async ({ fullname, email, password }) => {
    const res = await api.post("/auth/register", { fullname, email, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh: fetchMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);