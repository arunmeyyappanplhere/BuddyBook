import React, { useState } from "react";
import BuddyBookLogo from "/BuddyBookLogo.png";
import { BookUser, Heart, LayoutDashboard, LogOut, Users } from "lucide-react";
const Dashboard = ({tabOnView}) => {
  const [activeTab, setActiveTab] = useState(tabOnView);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const logOut = () => {
    console.log("Logout");
  };

  return (  
      <div className="h-screen min-w-1/6 rounded-r-xl shadow-2xl">
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
              onClick={() => changeTab("Dashboard")}
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
              onClick={() => changeTab("Contacts")}
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
              onClick={() => changeTab("Favorites")}
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
            >
              <div className={"w-1 h-7 "}></div>
              <LogOut className={""} onClick={logOut} /> Logout
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Dashboard;
