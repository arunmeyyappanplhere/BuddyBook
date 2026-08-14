import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const getCookie = (str) => {
  const cookies = document.cookie;
  return cookies
    .split("; ")
    .find((row) => row.startsWith(`${str}=`))
    ?.split("=")[1];
};

// Request interceptor: attach the JWT from cookies to every request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: on 401, clear the token cookie and redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized — clear session cookie and send user to login.
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;