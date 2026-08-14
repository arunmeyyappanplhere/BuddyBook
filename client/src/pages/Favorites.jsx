import { useCallback } from "react";
import Dashboard from "../Components/Dashboard";
import { Plus, Heart, SlidersHorizontal } from "lucide-react";
import defaultImage from "/default_avatar.png";
import ContactCard from "../Components/ContactCard";
import ContactSearchBar from "../Components/ContactSearchBar";
import { useAuth } from "../context/useAuth";
import useContactSearch from "../hooks/useContactSearch";

const Favorites = ({ openAddContactModal, setOpenAddContactModal }) => {
  const { user: userProfile, loading: authLoading } = useAuth();

  const favoriteContacts = useCallback(() => {
    if (!userProfile?.contacts) return [];
    return userProfile.contacts.filter(
      (contact) => contact.contact_favorite === true,
    );
  }, [userProfile]);

  const favorites = favoriteContacts();

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
  } = useContactSearch(favorites, { favoriteOnly: true });

  return (
    <div className="flex min-h-screen">
      <Dashboard
        tabOnView="Favorites"
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
              placeholder="Search favorites..."
              showFavoriteFilter={false}
              showResultsDropdown={false}
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
                  ? `http://localhost:8000/public/profileImages/${userProfile?.profileImage}`
                  : defaultImage
              }
              className="size-15 rounded-full"
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-4xl text-black p-10 mt-14">
          <h1 className="text-4xl font-semibold flex items-center gap-3">
            <Heart className="text-pink-600" size={36} /> Favorites
          </h1>
          <h2 className="max-w-3/5">
            {authLoading
              ? "Loading your favorite contacts..."
              : favorites.length >= 2
                ? `You have ${favorites.length} favorite contacts`
                : favorites.length === 1
                  ? "You have 1 favorite contact"
                  : "You have no favorite contacts yet. Tap the heart on any contact to add it here."}
          </h2>
        </div>
        <div className="flex flex-wrap gap-5 rounded-4xl text-black px-10">
          {authLoading ? (
            <div className="w-full flex justify-center py-10">
              <div className="text-gray-500 text-xl">Loading favorites...</div>
            </div>
          ) : filteredContacts.length > 0 ? (
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
                />
              );
            })
          ) : hasActiveFilters ? (
            <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
              <SlidersHorizontal size={48} className="text-pink-200 mb-4" />
              <p className="text-xl">No favorites match your search.</p>
              <p className="text-md mt-2">
                Try adjusting your search text or filters.
              </p>
              <button
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition"
                onClick={resetFilters}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Heart size={48} className="text-pink-200 mb-4" />
              <p className="text-xl">No favorite contacts yet</p>
              <p className="text-md mt-2">
                Mark contacts as favorite to see them here.
              </p>
            </div>
          )}
        </div>
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

export default Favorites;