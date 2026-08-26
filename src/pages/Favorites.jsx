import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import Dashboard from "../Components/Dashboard";
import { Plus, Heart, SlidersHorizontal } from "lucide-react";
import ContactCard from "../Components/ContactCard";
import ContactSearchBar from "../Components/ContactSearchBar";
import { useAuth } from "../context/useAuth";
import useContactSearch from "../hooks/useContactSearch";
import { useNavigate } from "react-router";
import NotificationBell from "../Components/NotificationBell";
import defaultImage from "/default_avatar.png";
import Spinner from "../Components/Spinner";

const Favorites = ({ openAddContactModal, setOpenAddContactModal, onEditContact }) => {
  const { user: userProfile, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState(null);
  const [addingContact, setAddingContact] = useState(false);
  const [clearingFilters, setClearingFilters] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();
  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setContactsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/contacts/favorites");
      setContacts(response.data);
      setContactsError(null);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setContactsError(err.response?.data?.message || "Failed to fetch favorites");
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    setContactsLoading(true);
    fetchFavorites();
  }, [isAuthenticated]);

  const handleFavoriteChange = (contactId, isFav) => {
    if (!isFav) {
      // Remove from favorites list when un-favorited
      setContacts((prev) => prev.filter((c) => (c.contact_uid || c._id) !== contactId));
    } else {
      // Re-fetch to pick up any contacts that were just favorited
      setTimeout(() => fetchFavorites(), 0);
    }
  };

  const handleStashChange = (contactId, isStashed) => {
    if (isStashed) {
      setContacts((prev) => prev.filter((c) => (c.contact_uid || c._id) !== contactId));
    }
  };

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
  } = useContactSearch(contacts, { favoriteOnly: true });

   return (
     <div className="min-h-screen">
       <Dashboard
         tabOnView="Favorites"
         openAddContactModal={openAddContactModal}
         setOpenAddContactModal={setOpenAddContactModal}
         contactsCount={contacts.length}
       />
        <div className="p-4 md:p-7 lg:ml-80 flex flex-col gap-5 min-w-0">
        <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl rounded-3xl p-3 pl-16 lg:pl-3 -mx-3 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
            placeholder="Search favorites..."
            showFavoriteFilter={false}
            showResultsDropdown={false}
            onContactFavoriteChange={handleFavoriteChange}
          />
          {/* Notifications & Profile — right side in laptop/tablet view */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <NotificationBell />
            <img
              src={userProfile?.profileImage || defaultImage}
              alt=""
              className="size-11 rounded-full object-cover border-2 border-blue-100 cursor-pointer"
              onClick={() => navigate("/settings")}
            />
          </div>
        </div>

        {authError && (
          <div className="mt-14 flex flex-col items-center gap-4 rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 text-lg">Failed to load dashboard data.</p>
            <button
              className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setRetrying(true);
                window.location.reload();
              }}
              disabled={retrying}
            >
              {retrying ? (
                <>
                  <Spinner size={18} className="text-white" />
                  Retrying...
                </>
              ) : (
                "Retry"
              )}
            </button>
          </div>
        )}

        {contactsError && (
          <div className="mt-14 flex flex-col items-center gap-4 rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 text-lg">Failed to load your favorites.</p>
            <button
              className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setRetrying(true);
                window.location.reload();
              }}
              disabled={retrying}
            >
              {retrying ? (
                <>
                  <Spinner size={18} className="text-white" />
                  Retrying...
                </>
              ) : (
                "Retry"
              )}
            </button>
          </div>
        )}

        {!authLoading && !contactsLoading && !authError && !contactsError ? (
          <>
             <div className="flex flex-col gap-2 rounded-4xl text-black p-6 md:p-10 mt-14">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-semibold flex items-center gap-3">
                      <Heart className="text-pink-600" size={36} /> Favorites
                    </h1>
                    <h2 className="max-w-3/5 text-nowrap">
                      {contacts.length >= 2
                        ? `You have ${contacts.length} favorite contacts`
                        : contacts.length === 1
                          ? "You have 1 favorite contact"
                          : "You have no favorite contacts yet. Tap the heart on any contact to add it here."}
                    </h2>
                  </div>
                </div>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 rounded-4xl text-black p-6 md:p-10">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => {
                  return (
                    <ContactCard
                      key={contact?.contact_uid || contact?._id}
                      contact_id={contact?.contact_uid || contact?._id}
                      profileImage={contact?.contact_profileImage}
                      contactName={contact?.contact_name}
                      contactRelation={contact?.contact_relation}
                      contactPhone={String(contact?.contact_phone)}
                      contactEmail={contact?.contact_email}
                      isFavorite={contact?.contact_favorite}
                      isStashed={contact?.contact_stashed}
                      onEdit={onEditContact}
                      onFavoriteChange={handleFavoriteChange}
                      onStashChange={handleStashChange}
                      onDeleted={(deletedId) =>
                        setContacts((prev) =>
                          prev.filter(
                            (c) => (c.contact_uid || c._id) !== deletedId,
                          ),
                        )
                      }
                    />
                  );
                })
              ) : hasActiveFilters ? (
                <div className="w-full col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <SlidersHorizontal size={48} className="text-pink-200 mb-4" />
                  <p className="text-xl">No favorites match your search.</p>
                  <p className="text-md mt-2">
                    Try adjusting your search text or filters.
                  </p>
                   <button
                     className="mt-6 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     onClick={() => {
                       setClearingFilters(true);
                       resetFilters();
                     }}
                     disabled={clearingFilters}
                   >
                     {clearingFilters ? (
                       <>
                         <Spinner size={18} className="text-white" />
                         Clearing...
                       </>
                     ) : (
                       "Clear all filters"
                     )}
                   </button>
                </div>
              ) : (
                <div className="w-full col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <Heart size={48} className="text-pink-200 mb-4" />
                  <p className="text-xl">No favorite contacts yet</p>
                  <p className="text-md mt-2">
                    Mark contacts as favorite to see them here.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 rounded-4xl text-black p-6 md:p-10 mt-14">
              <div className="h-9 w-40 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-5 w-72 bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 rounded-4xl text-black p-6 md:p-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shadow-md p-5 min-h-36 flex flex-col gap-16 rounded-xl w-full bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          </>
        )}
      </div>
      <button
        className="p-2 aspect-square bg-blue-500 h-min rounded-xl z-50 fixed right-6 md:right-10 bottom-6 md:bottom-10 cursor-pointer trasition duration-200 hover:scale-[1.01] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          setAddingContact(true);
          setOpenAddContactModal(true);
        }}
        disabled={addingContact}
        aria-label="Add contact"
      >
        {addingContact ? <Spinner size={28} className="text-white" /> : <Plus className="text-white" size={32} />}
      </button>
    </div>
  );
};

export default Favorites;