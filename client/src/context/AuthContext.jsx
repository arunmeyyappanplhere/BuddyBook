/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

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

const API_BASE = "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    const token = getCookie("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_BASE}/home`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
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
    const token = getCookie("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_BASE}/home`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
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
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${API_BASE}/login`,
        { email, password },
        { withCredentials: true },
      );
      setIsAuthenticated(true);
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
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${API_BASE}/register`,
        userData,
        { withCredentials: true },
      );
      setIsAuthenticated(true);
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
      axios.defaults.withCredentials = true;
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
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
