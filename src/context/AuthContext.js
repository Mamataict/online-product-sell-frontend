"use client";

import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const SESSION_MINUTES = 30;
const IDLE_MS = SESSION_MINUTES * 60 * 1000;
const COOKIE_DAYS = SESSION_MINUTES / (24 * 60);
const THROTTLE_MS = 15 * 1000;

const setAuthCookie = (token) => {
  Cookies.set("auth_token", token, {
    expires: COOKIE_DAYS,
    path: "/",
    secure: true,
    sameSite: "strict",
  });
};

export function AuthProvider({ children }) {
  const [user_data, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const idleTimer = useRef(null);
  const lastExtend = useRef(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("auth_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data);
        setAuthCookie(token);
      } catch (error) {
        console.error("Auth check failed:", error);
        Cookies.remove("auth_token", { path: "/" });
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/api/login", credentials);
      const { token, user } = response.data.data;

      setAuthCookie(token);
      lastExtend.current = Date.now();
      setUserData(user);

      return response.data.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  };

  const logout = useCallback(
    async (reason) => {
      clearTimeout(idleTimer.current);
      const token = Cookies.get("auth_token");

      try {
        if (token) {
          await api.post(
            "/api/logout",
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        Cookies.remove("auth_token", { path: "/" });
        setUserData(null);
        router.push(reason === "timeout" ? "/?reason=timeout" : "/");
      }
    },
    [router],
  );

  useEffect(() => {
    if (!user_data) return;

    const onActivity = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => logout("timeout"), IDLE_MS);

      const now = Date.now();
      if (now - lastExtend.current > THROTTLE_MS) {
        lastExtend.current = now;
        const token = Cookies.get("auth_token");
        if (token) setAuthCookie(token);
      }
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    onActivity();

    return () => {
      clearTimeout(idleTimer.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [user_data, logout]);

  const hasPermission = (permission) => {
    return user_data?.permissions?.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some((permission) =>
      user_data?.permissions?.includes(permission),
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user_data,
        loading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}