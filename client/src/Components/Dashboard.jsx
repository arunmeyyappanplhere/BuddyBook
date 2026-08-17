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

const Dashboard = ({ tabOnView, setOpenAddContactModal, contactsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

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

  const navigate = useNavigate();

  const logOut = async () => {
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
                    "flex mb-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-red-500 transition duration-100 "
                  }
                  onClick={logOut}
                >
                  <div className={"w-1 h-7 "}></div>
                  <LogOut className={""} /> Logout
                </li>
              </ul>
            </div>
          </div>
          <div className="p-5 pt-0 shrink-0">
            <ul>
              <li
                className={
                  "flex bg-blue-500 text-white mb-4 gap-3 text-xl items-center justify-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:scale-[1.01] transition duration-100 "
                }
                onClick={() => {
                  setOpenAddContactModal(true);
                  setSidebarOpen(false);
                }}
              >
                <Plus className={""} /> Quick Add
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;