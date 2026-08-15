import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";
import Dashboard from "../Components/Dashboard";
import { UserRound, Heart, CirclePlus, Plus } from "lucide-react";
import defaultImage from "/default_avatar.png";
import ContactSearchBar from "../Components/ContactSearchBar";
import StatsCard from "../Components/StatsCard";
import RecentContactCard from "../Components/RecentContactCard";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import useContactSearch from "../hooks/useContactSearch";

const Home = ({ openAddContactModal, setOpenAddContactModal }) => {
  const { user: userProfile, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  const [recentContacts, setRecentContacts] = useState([]);
  const [favoriteContacts, setFavoriteContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!isAuthenticated) {
        setContactsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/contacts");
        setContacts(response.data);
        setContactsError(null);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setContactsError(err.response?.data?.message || "Failed to fetch contacts");
      } finally {
        setContactsLoading(false);
      }
    };

    fetchContacts();
  }, [isAuthenticated]);

  const {
    searchText,
    setSearchText,
    relationFilter,
    setRelationFilter,
    favoriteFilter,
    setFavoriteFilter,
    availableRelations,
    filteredContacts,
    hasActiveFilters,
    activeFilterCount,
    resetFilters,
  } = useContactSearch(contacts);

  const findRecentContacts = useCallback((contacts) => {
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
  }, []);

  const favorites = useCallback((contacts) => {
    if (!contacts) {
      setFavoriteContacts([]);
      return;
    }

    const favorite = contacts.filter((contact) => {
      return contact.contact_favorite === true;
    });

    setFavoriteContacts(favorite);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      findRecentContacts(contacts);
      favorites(contacts);
    }, 0);
    return () => clearTimeout(timer);
  }, [contacts, findRecentContacts, favorites]);

  const totalContacts = contacts.length;
  const recentCount = recentContacts.length;
  const recentPercentage =
    totalContacts === 0 ? 0 : (recentCount / totalContacts) * 100;

  return (
    <div className="flex min-h-screen">
      <Dashboard
        tabOnView="Dashboard"
        openAddContactModal={openAddContactModal}
        setOpenAddContactModal={setOpenAddContactModal}
      />
      <div className="p-7 w-full flex flex-col gap-5 min-w-0">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="w-full lg:w-auto">
            <ContactSearchBar
              searchText={searchText}
              onSearchTextChange={setSearchText}
              relationFilter={relationFilter}
              onRelationFilterChange={setRelationFilter}
              favoriteFilter={favoriteFilter}
              onFavoriteFilterChange={setFavoriteFilter}
              availableRelations={availableRelations}
              filteredContacts={filteredContacts}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              onReset={resetFilters}
              placeholder="Search contacts..."
            />
          </div>
          <div className="flex gap-3 items-center lg:self-start shrink-0">
            <div className="text-right">
              <h1 className="font-semibold text-md">{userProfile?.name}</h1>
              <h2 className="text-gray-600 text-md">
                {userProfile?.phoneNumber}
              </h2>
            </div>
            <img
              src={
                userProfile
                  ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${userProfile?.profileImage}`
                  : defaultImage
              }
              className="size-15 rounded-full"
              alt=""
            />
          </div>
        </div>

        {authError && (
          <div className="mt-14 flex flex-col items-center gap-4 rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 text-lg">Failed to load dashboard data.</p>
            <button
              className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {contactsError && (
          <div className="mt-14 flex flex-col items-center gap-4 rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 text-lg">Failed to load your contacts.</p>
            <button
              className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!authLoading && !contactsLoading && !authError && !contactsError ? (
          <>
            <div className="flex flex-col gap-5 bg-linear-to-r from-blue-500 from-10% via-blue-500 to-blue-400 to-90% rounded-4xl text-white p-10 mt-14">
              <h1 className="text-4xl font-semibold">
                Welcome back, {userProfile?.name}
              </h1>
              <h2 className="max-w-3/5">
                {totalContacts === 0
                  ? "Your network is empty. Start adding contacts to grow your circle."
                  : `Your network is growing. You have ${totalContacts} ${
                      totalContacts >= 2 ? "contacts" : "contact"
                    } synced since your sign up. Start your day with smile.`}
              </h2>
              <div className="flex gap-5 font-semibold flex-wrap">
                <button
                  className="w-40 p-2.5 text-blue-500 bg-white rounded-xl cursor-pointer"
                  onClick={() => navigate("/contacts")}
                >
                  View All
                </button>
                <button
                  className="w-40 p-2.5 text-white bg-[#a9d1ff4d] rounded-xl cursor-pointer hover:bg-[#a9d1ff88] transition duration-300"
                  onClick={() => navigate("/favorites")}
                >
                  View Favorites
                </button>
              </div>
            </div>
            <div className="flex gap-5 flex-wrap">
              <StatsCard
                icon={
                  <UserRound
                    size={28}
                    className="text-purple-500 bg-purple-200 w-15 h-15 p-1 rounded-xl transition duration-100 ease-in-out group-hover:scale-[1.06]"
                  />
                }
                heading={"Total Contacts"}
                count={totalContacts}
                percentage={recentPercentage}
              />
              <StatsCard
                icon={
                  <Heart
                    size={28}
                    className="text-pink-600 bg-pink-200 w-15 h-15 p-1 rounded-xl transition duration-100 ease-in-out group-hover:scale-[1.06]"
                  />
                }
                heading={"Favourites"}
                count={favoriteContacts.length}
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
                count={recentCount}
                percentage={"This Week"}
              />
            </div>
            <div className="w-full lg:w-3/7 flex flex-col h-full">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold mb-4">Recent Contacts</h1>
                <a
                  href="/contacts"
                  className="text-blue-500 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contacts");
                  }}
                >
                  View All
                </a>
              </div>
              <div className="shadow-md w-full rounded-2xl h-full p-0.5">
                {recentContacts.length > 0 ? (
                  recentContacts.map((contact, index) => (
                    <div key={contact._id || index} className="w-full p-3">
                      <RecentContactCard
                        contactImage={contact.contact_profileImage}
                        contactName={contact.contact_name}
                        role={contact.contact_role || "No role specified"}
                        contactNumber={contact.contact_phone}
                      />
                    </div>
                  ))
                ) : totalContacts > 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No contacts added in the last 7 days.
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full text-gray-500 gap-2 py-10">
                    <UserRound size={40} className="text-gray-300" />
                    <p>No contacts yet. Use Quick Add to create your first contact.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Skeleton states while auth is loading */}
            <div className="flex flex-col gap-5 bg-linear-to-r from-blue-500 from-10% via-blue-500 to-blue-400 to-90% rounded-4xl text-white p-10 mt-14 animate-pulse">
              <div className="h-9 w-72 bg-white/30 rounded-xl" />
              <div className="h-5 w-3/5 bg-white/20 rounded-xl" />
              <div className="flex gap-5">
                <div className="w-40 h-11 bg-white/30 rounded-xl" />
                <div className="w-40 h-11 bg-white/20 rounded-xl" />
              </div>
            </div>
            <div className="flex gap-5 flex-wrap">
              <div className="h-45 w-full rounded-2xl bg-gray-100 shadow-md animate-pulse" />
              <div className="h-45 w-full rounded-2xl bg-gray-100 shadow-md animate-pulse" />
              <div className="h-45 w-full rounded-2xl bg-gray-100 shadow-md animate-pulse" />
            </div>
            <div className="w-full lg:w-3/7 flex flex-col h-full">
              <div className="h-8 w-52 bg-gray-100 rounded-xl mb-4 animate-pulse" />
              <div className="shadow-md w-full rounded-2xl h-40 p-0.5 animate-pulse bg-gray-100" />
            </div>
          </>
        )}
      </div>
      <button
        className="p-2 aspect-square bg-blue-500 h-min rounded-xl z-50 fixed right-10 bottom-10 cursor-pointer trasition duration-200 hover:scale-[1.01] "
        onClick={() => {
          setOpenAddContactModal(true);
        }}
      >
        <Plus className="text-white" size={32} />
      </button>
    </div>
  );
};

export default Home;
