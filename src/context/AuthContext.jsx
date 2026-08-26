/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext(null);

const getCookie = (str) => {
  const cookies = document.cookie;
  return cookies
    .split("; ")
    .find((row) => row.startsWith(`${str}=`))
    ?.split("=")[1];
};

// Persist the JWT in a JS-readable "token" cookie so the axios
// interceptor can attach it as an Authorization: Bearer header.
const setTokenCookie = (token) => {
  if (!token) return;
  // 7 days; adjust to match the backend's token expiry if needed
  document.cookie = `token=${token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax`;
};

// Extract the token from common API response shapes:
// { token }, { accessToken }, { data: { token } }, { data: { accessToken } }
const extractToken = (data) =>
  data?.token ??
  data?.accessToken ??
  data?.data?.token ??
  data?.data?.accessToken ??
  null;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      // Support both { user: {...} } and raw user object responses
      setUser(response.data?.user ?? response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      // Support both { user: {...} } and raw user object responses
      const data = response.data?.user ?? response.data;
      setUser(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Refresh user failed:", err);
      setError(err.response?.data?.message || "Failed to refresh user data");
      return null;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const token = extractToken(response.data);
      if (token) {
        setTokenCookie(token);
      } else {
        console.warn(
          "Login response did not contain a token. Ensure the API returns { token } or { data: { token } }, or that it sets a non-httpOnly 'token' cookie."
        );
      }
      await checkAuth();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const token = extractToken(response.data);
      if (token) {
        setTokenCookie(token);
      } else {
        console.warn(
          "Register response did not contain a token. Ensure the API returns { token } or { data: { token } }, or that it sets a non-httpOnly 'token' cookie."
        );
      }
      await checkAuth();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout", {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
