/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext(null);

// Extract the token from common API response shapes:
// { token }, { accessToken }, { data: { token } }, { data: { data: { token } } }, etc.
const extractToken = (data) =>
  data?.token ??
  data?.accessToken ??
  data?.data?.token ??
  data?.data?.accessToken ??
  data?.data?.data?.token ??
  data?.data?.data?.accessToken ??
  null;

// Persist the JWT in a JS-readable "token" cookie so the axios
// interceptor can attach it as an Authorization: Bearer header.
const setTokenCookie = (token) => {
  if (!token) return;
  // 7 days; adjust to match the backend's token expiry if needed.
  // Secure flag keeps the token off plain-HTTP connections in production.
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax${secureFlag}`;
};

const clearTokenCookie = () => {
  document.cookie =
    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};

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
      // Support both { user: {...} } and raw user object responses.
      // A malformed/empty body must NOT flip the app into an
      // authenticated state with a null user.
      const data = response.data?.user ?? response.data;
      if (!data || typeof data !== "object") {
        throw new Error("Malformed authentication response");
      }
      setUser(data);
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
      if (!data || typeof data !== "object") {
        throw new Error("Malformed user response");
      }
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
      const response = await axiosInstance.post("/login", { email, password });
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
      const response = await axiosInstance.post("/register", userData);
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
      // Always purge the local token so no stale JWT is attached
      // to requests after logging out.
      clearTokenCookie();
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
