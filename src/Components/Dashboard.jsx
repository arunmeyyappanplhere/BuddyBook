import { useState } from "react";
import BuddyBookLogo from "/BuddyBookLogo.png";
import {
  BookUser,
  Heart,
  LayoutDashboard,
  LogOut,
  Plus,
  Menu,
  X,
  CircleHelp,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import NotificationBell from "./NotificationBell";
import defaultImage from "/default_avatar.png";
import Spinner from "./Spinner";

const Dashboard = ({ tabOnView, setOpenAddContactModal, contactsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user: userProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [quickAdding, setQuickAdding] = useState(false);

  // Sync active tab with the current route
  const activeTab = location.pathname.includes("/contacts")
    ? "Contacts"
    : location.pathname.includes("/favorites")
      ? "Favorites"
      : location.pathname.includes("/recent")
        ? "Recent"
        : location.pathname.includes("/settings")
          ? "Settings"
          : location.pathname.includes("/help")
            ? "Help"
            : "Dashboard";

  const changeTab = (tab) => {
    setSidebarOpen(false);
  };

  const logOut = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleNav = (path, tab) => {
    changeTab(tab);
    navigate(path);
  };

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2.5 bg-blue-500 text-white rounded-xl shadow-lg cursor-pointer lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating sidebar */}
      <div
        className={
          "h-screen w-80 rounded-r-3xl shadow-2xl bg-gradient-to-b from-white to-blue-50/50 backdrop-blur-xl border-r border-blue-100/50 transition-transform duration-300 fixed top-0 left-0 z-40 " +
          (sidebarOpen
            ? "translate-x-0 z-50"
            : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="flex gap-5 p-5">
              <img src={BuddyBookLogo} alt="" className="rounded-2xl size-18 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-blue-500 text-3xl font-bold">Buddy Book</h1>
                <h2 className="">Contact Management</h2>
              </div>
            </div>

            {/* Profile section */}
            <div className="mx-5 mb-2 flex items-center gap-3 p-3 bg-white/70 rounded-2xl border border-blue-100/50 shadow-sm">
              <NotificationBell />
              <img
                src={userProfile?.profileImage || defaultImage}
                alt=""
                className="size-11 rounded-full object-cover border-2 border-blue-100 cursor-pointer"
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/settings");
                }}
              />
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-sm truncate">{userProfile?.name}</h1>
                <h2 className="text-gray-500 text-xs truncate">
                  {userProfile?.phoneNumber}
                </h2>
              </div>
            </div>
            <h1 className="p-5 mt-4 text-ms text-gray-600">USER</h1>
            <div className="p-5 pt-0">
              <ul>
                <li
                  className={
                    (activeTab == "Dashboard"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                      " flex mb-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/dashboard", "Dashboard")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Dashboard" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <LayoutDashboard
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Dashboard" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Dashboard
                </li>
                <li
                  className={
                    (activeTab == "Contacts"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                    " flex my-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/contacts", "Contacts")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Contacts" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <BookUser
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Contacts" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Contacts
                </li>
                <li
                  className={
                    (activeTab == "Favorites"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                    " flex my-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/favorites", "Favorites")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Favorites" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <Heart
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Favorites" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Favorites
                </li>
                <li
                  className={
                    (activeTab == "Recent"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                    " flex my-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/recent", "Recent")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Recent" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <Clock
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Recent" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Recent
                </li>
              </ul>
            </div>
            <h1 className="p-5 text-md text-gray-600">SYSTEM</h1>
            <div className="p-5 pt-0">
              <ul>
                <li
                  className={
                    (activeTab == "Help"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                    " flex my-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/help", "Help")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Help" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <CircleHelp
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Help" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Help
                </li>
                <li
                  className={
                    (activeTab == "Settings"
                      ? "text-blue-500 bg-blue-100"
                      : "text-gray-600") +
                    " flex my-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
                  }
                  onClick={() => handleNav("/settings", "Settings")}
                >
                  <div
                    className={
                      "w-1 h-7 " +
                      (activeTab == "Settings" ? "bg-blue-500" : "bg-white")
                    }
                  ></div>
                  <SettingsIcon
                    className={
                      "group-hover:text-blue-500 " +
                      (activeTab == "Settings" ? "text-blue-500" : "text-gray-600")
                    }
                  />{" "}
                  Settings
                </li>
                <li
                className={
                  "flex mb-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-red-500 transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }
                onClick={logOut}
              >
                <div className={"w-1 h-7 "}></div>
                {loggingOut ? <Spinner size={20} className="text-red-500" /> : <LogOut className={""} />} Logout
                </li>
              </ul>
            </div>
          </div>
          <div className="p-5 pt-0 shrink-0">
            <ul>
              <li
                className={
                  "flex bg-blue-500 text-white mb-4 gap-3 text-xl items-center justify-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:scale-[1.01] transition duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }
                onClick={() => {
                  setQuickAdding(true);
                  setOpenAddContactModal(true);
                  setSidebarOpen(false);
                  setQuickAdding(false);
                }}
              >
                {quickAdding ? <Spinner size={20} className="text-white" /> : <Plus className={""} />} Quick Add
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;