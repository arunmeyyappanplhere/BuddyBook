import Dashboard from "../Components/Dashboard";
import { Search } from "lucide-react";
import defaultImage from "/default_avatar.png";
import SearchContactCard from "../Components/SearchContactCard";
import StatsCard from "../Components/StatsCard";
import { UserRound, Heart, CirclePlus, Plus } from "lucide-react";
import RecentContactCard from "../Components/RecentContactCard";
import ContactCard from "../Components/ContactCard";
import axios from "axios";
import { useEffect, useState } from "react";

const Contacts = ({ openAddContactModal, setOpenAddContactModal }) => {
  const [searchContact, setSearchContact] = useState("");
  const [userProfile, setUserProfile] = useState();
  const [recentContacts, setRecentContacts] = useState([]);
  const [filteredSearchContacts, setFilteredSearchContacts] = useState([]);

  const handleSearchContact = (contacts, searchText) => {
    if (!searchText.trim()) {
      setFilteredSearchContacts([]);
      return;
    }
    const filtered = contacts.filter((contact) => {
      return (
        contact.contact_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        String(contact.contact_phone)?.includes(searchText)
      );
    });

    setFilteredSearchContacts(filtered);
  };

  const findRecentContacts = (contacts) => {
    if (!contacts) {
      setRecentContacts([]);
      return;
    }

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
      const getCookie = (str) => {
        return cookies
          .split("; ")
          .find((row) => row.startsWith(`${str}=`))
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
          console.log(response.data.contacts);
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
      <Dashboard
        tabOnView="Dashboard"
        openAddContactModal={openAddContactModal}
        setOpenAddContactModal={setOpenAddContactModal}
      />
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
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchContact(value);

                  handleSearchContact(userProfile?.contacts || [], value);
                }}
              />
            </div>
            {searchContact && (
              <>
                <hr className="border-gray-300 mt-3 mx-3" />
                <div className="px-3.5 mt-1 h-15/17 overflow-auto scrollbar-thumb-blue-200">
                  <div className="px-3.5 mt-1 h-15/17 overflow-auto scrollbar-thumb-blue-200">
                    {filteredSearchContacts.length > 0 ? (
                      filteredSearchContacts.map((contact) => (
                        <SearchContactCard
                          key={contact._id}
                          contactImage={contact.contact_profileImage}
                          contactName={contact.contact_name}
                          contactNumber={contact.contact_phone}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 py-4 text-center">
                        No contacts found
                      </p>
                    )}
                  </div>
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
            {console.log(
              `http://127.0.0.1:8000/public/profileImages/${userProfile?.profileImage}`,
            )}
            <img
              src={
                userProfile
                  ? `http://127.0.0.1:8000/public/profileImages/${userProfile?.profileImage}`
                  : defaultImage
              }
              className="size-15 rounded-full"
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-4xl text-black p-10 mt-14">
          <h1 className="text-4xl font-semibold">Contacts</h1>
          <h2 className="max-w-3/5">
            Manage your network of{" "}
            {userProfile?.contacts.length >= 2
              ? String(userProfile?.contacts.length) + " contacts"
              : String(userProfile?.contacts.length) + " contact"}{" "}
          </h2>
        </div>
        <div className="flex flex-wrap gap-5 rounded-4xl text-black px-10">
          {userProfile?.contacts.slice(1,).map((contact, i) => {
            return (
              <ContactCard
                key={contact?.contact_uid}
                contact_id={contact?.contact_uid}
                profileImage={contact?.contact_profileImage}
                contactName={contact?.contact_name}
                contactRelation={contact?.contact_relation}
                contactPhone={String(contact?.contact_phone)}
                contactEmail={contact?.contact_email}
                isFavorite={contact?.contact_favorite}
              />
            );
          })}
        </div>
      </div>
      <button className="p-2 aspect-square bg-blue-500 h-min rounded-xl z-50 fixed right-10 bottom-10 cursor-pointer trasition duration-200 hover:scale-[1.01] ">
        <Plus
          className="text-white"
          size={32}
          onClick={() => {
            console.log(1);
            setOpenAddContactModal(true);
          }}
        />
      </button>
    </div>
  );
};

export default Contacts;
