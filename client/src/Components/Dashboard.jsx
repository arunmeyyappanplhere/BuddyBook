import { useState } from "react";
import BuddyBookLogo from "/BuddyBookLogo.png";
import {
  BookUser,
  Heart,
  LayoutDashboard,
  LogOut,
  Plus,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Dashboard = ({ tabOnView, setOpenAddContactModal }) => {
  const [activeTab, setActiveTab] = useState(tabOnView);
  const { logout } = useAuth();

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  const logOut = async () => {
    await logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="h-screen min-w-1/6 rounded-r-xl shadow-2xl sticky top-0 left-0 ">
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
            onClick={() => {
              changeTab("Dashboard");
              navigate("/dashboard");
            }}
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
            onClick={() => {
              changeTab("Contacts");
              navigate("/contacts");
            }}
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
            onClick={() => {
              changeTab("Favorites");
              navigate("/favorites");
            }}
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
            }}
          >
            <Plus className={""} /> Quick Add
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;