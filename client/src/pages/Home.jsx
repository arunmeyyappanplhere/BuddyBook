import React, { useState } from "react";
import Dashboard from "../Components/Dashboard";
import { Search } from "lucide-react";
import defaultImage from "/default_avatar.png";
import SearchContactCard from "../Components/SearchContactCard";
import StatsCard from "../Components/StatsCard";
import { UserRound, Heart, CirclePlus, Plus } from "lucide-react";
import RecentContactCard from "../Components/RecentContactCard";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const [searchContact, setSearchContact] = useState("");
  const [userProfile, setUserProfile] = useState();
  const [recentContacts, setRecentContacts] = useState([]);

  const handleSearchContact = (e) => {
    setSearchContact(event.target.value);
  };

  const findRecentContacts = (contacts) => {
    if (!contacts) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recent = contacts.filter((contact) => {
      return new Date(contact.createdAt) >= sevenDaysAgo;
    });

    setRecentContacts(recent);
  };

  const getDashboardDetails = async () => {
    try {
      const cookies = document.cookie;
      const getCookie = (name) => {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${name}=`))
          ?.split("=")[1];
      };

      const token = getCookie("token");

      console.log("Token : ", token);
      axios.defaults.withCredentials = true;
      await axios
        .get("http://localhost:8000/api/home", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((response) => {
          setUserProfile(response.data);
          findRecentContacts(response.data.contacts);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, []);

  return (
    <div className="flex">
      <Dashboard tabOnView="Dashboard" />
      <div className="p-7 w-full flex flex-col gap-5">
        <div className="flex justify-between items-start relative">
          <div
            className={
              "w-100 gap-4 p-3 bg-blue-50 rounded-3xl text-md items-start z-50 absolute" +
              (searchContact.trim().length >= 1 ? " h-75 shadow-2xs" : "")
            }
          >
            <div className="flex gap-4">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full focus:outline-0"
                value={searchContact}
                onChange={() => handleSearchContact()}
              />
            </div>
            {searchContact && (
              <>
                <hr className="border-gray-300 mt-3 mx-3" />
                <div className="px-3.5 mt-1 h-15/17 overflow-auto scrollbar-thumb-blue-200">
                  <SearchContactCard />
                  <SearchContactCard />
                  <SearchContactCard />
                  <SearchContactCard />
                  <SearchContactCard />
                  <SearchContactCard />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 items-center absolute right-0">
            <div className="text-right">
              <h1 className="font-semibold text-md">{userProfile?.name}</h1>
              <h2 className="text-gray-600 text-md">
                {userProfile?.phoneNumber}
              </h2>
            </div>
            <img
              src={
                userProfile?.profileImage
                  ? `http://127.0.0.1:8000/public/profileImages/${userProfile?.profileImage}`
                  : defaultImage
              }
              className="size-15"
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 bg-linear-to-r from-blue-500 from-10% via-blue-500 to-blue-400 to-90% rounded-4xl text-white p-10 mt-14">
          <h1 className="text-4xl font-semibold">
            Welcome back, {userProfile?.name}
          </h1>
          <h2 className="max-w-3/5">
            Your network is growing. You have{" "}
            {userProfile?.contacts.length >= 2
              ? String(userProfile?.contacts.length) + " contacts"
              : String(userProfile?.contacts.length) + " contact"}{" "}
            synced since your sign up. Start your day with smile.
          </h2>
          <div className="flex gap-5 font-semibold">
            <button className="w-40 p-2.5 text-blue-500 bg-white rounded-xl cursor-pointer">
              View All
            </button>
            <button className="w-40 p-2.5 text-white bg-[#a9d1ff4d] rounded-xl cursor-pointer hover:bg-[#a9d1ff88] transition duration-300">
              View Favorites
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <StatsCard
            icon={
              <UserRound
                size={28}
                className="text-purple-500 bg-purple-200 w-15 h-15 p-1 rounded-xl transition duration-100 ease-in-out group-hover:scale-[1.06]"
              />
            }
            heading={"Total Contacts"}
            count={userProfile?.contacts.length}
            percentage={
              userProfile?.contacts.length == 0
                ? 0
                : Math.round(
                    recentContacts.length / userProfile?.contacts.length,
                    2,
                  )
            }
          />
          <StatsCard
            icon={
              <Heart
                size={28}
                className="text-pink-600 bg-pink-200 w-15 h-15 p-1 rounded-xl transition duration-100 ease-in-out group-hover:scale-[1.06]"
              />
            }
            heading={"Favourites"}
            count={userProfile?.favorites.length}
            percentage={"High Priority"}
          />
          <StatsCard
            icon={
              <CirclePlus
                size={28}
                className="text-blue-600 bg-blue-200 w-15 h-15 p-1 rounded-xl transition duration-100 ease-in-out group-hover:scale-[1.06]"
              />
            }
            heading={"Recently Added"}
            count={recentContacts.length}
            percentage={"This Week"}
          />
        </div>
        <div className="w-3/7 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold mb-4">Recent Contacts</h1>
            <a href="" className="text-blue-500">
              View All
            </a>
          </div>
          <div className="shadow-md w-full rounded-2xl h-full p-0.5">
            {recentContacts.length > 0 ? (
              recentContacts.map((contact, index) => (
                <div key={contact._id || index} className="w-full p-3">
                  <RecentContactCard
                    contactName={contact.name}
                    role={contact.role || "No role specified"}
                    contactNumber={contact.phoneNumber}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                No contacts added in the last 7 days.
              </div>
            )}
          </div>
        </div>
      </div>
      <button className="p-2 aspect-square bg-blue-500 h-min rounded-xl z-50 fixed right-10 bottom-10 cursor-pointer trasition duration-200 hover:scale-[1.01] ">
        <Plus className="text-white" size={32} />
      </button>
    </div>
  );
};

export default Home;
