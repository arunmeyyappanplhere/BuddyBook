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
      const response = await axiosInstance.get("/home");
      setUser(response.data);
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
      const response = await axiosInstance.get("/home");
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Refresh user failed:", err);
      setError(err.response?.data?.message || "Failed to refresh user data");
      return null;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
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
