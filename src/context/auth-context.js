"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user_data, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("auth_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        Cookies.remove("auth_token");
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

      Cookies.set("auth_token", token, {
        expires: 7,
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      setUserData(user);

      return response.data.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get("auth_token");

      if (token) {
        await api.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Cookies.remove("auth_token", { path: "/" });
      setUserData(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user_data, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
