import { CountUp } from "use-count-up";
import StatsCard from "./StatsCard";
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
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Dashboard = ({ tabOnView, setOpenAddContactModal, contactsCount }) => {
  const [activeTab, setActiveTab] = useState(tabOnView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const changeTab = (tab) => {
    setActiveTab(tab);
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

      <div
        className={
          "h-screen min-w-1/6 rounded-r-xl shadow-2xl sticky top-0 left-0 bg-white transition-transform duration-300 " +
          (sidebarOpen
            ? "translate-x-0 fixed z-50 w-72"
            : "-translate-x-full lg:translate-x-0 lg:static lg:w-auto")
        }
      >
        <div className="flex gap-5 p-5">
          <img src={BuddyBookLogo} alt="" className="rounded-2xl size-18" />
          <div className="">
            <h1 className="text-blue-500 text-3xl font-bold">Buddy Book</h1>
            <h2 className="">Contact Management</h2>
          </div>
        </div>
        <h1 className="p-5 mt-4 text-md text-gray-600">USER</h1>
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
          </ul>
        </div>
        
        <h1 className="p-5 text-md text-gray-600">SYSTEM</h1>
        <div className="p-5 pt-0">
          <ul>
            <li
              className={
                "flex mb-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-red-500 transition duration-100 "
              }
              onClick={logOut}
            >
              <div className={"w-1 h-7 "}></div>
              <LogOut className={""} /> Logout
            </li>
            <li
              className={
                "flex mb-4 gap-3 text-xl items-center font-semibold rounded-xl p-3 pl-0 cursor-pointer group hover:text-blue-500 transition duration-100 "
              }
            >
              <div className="w-1 h-7"></div>
              <Link to="/help" className="flex items-center gap-3">
                Help
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-5 pt-0 absolute w-full bottom-0">
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
    </>
  );
};

export default Dashboard;