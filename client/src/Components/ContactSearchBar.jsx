import { Search, X, SlidersHorizontal, Heart } from "lucide-react";
import SearchContactCard from "./SearchContactCard";

/**
 * Reusable search + filter bar for the Dashboard pages.
 * Preserves the existing blue search-box design while adding:
 *  - relation filter dropdown
 *  - favorite-only toggle
 *  - active-filter indicator badge
 *  - reset button
 *  - no-result state inside the dropdown
 *
 * @param {Object} props
 * @param {string} props.searchText
 * @param {Function} props.onSearchTextChange
 * @param {string} props.relationFilter
 * @param {Function} props.onRelationFilterChange
 * @param {boolean} props.favoriteFilter
 * @param {Function} props.onFavoriteFilterChange
 * @param {Array} props.availableRelations
 * @param {Array} props.filteredContacts
 * @param {boolean} props.hasActiveFilters
 * @param {number} props.activeFilterCount
 * @param {Function} props.onReset
 * @param {string} props.placeholder
 * @param {boolean} props.showFavoriteFilter
 * @param {boolean} props.showResultsDropdown
 *   When false, hides the results dropdown. Use on pages where the filtered
 *   contacts are rendered in the main content area instead (Contacts/Favorites).
 * @param {string} props.className
 *   Extra classes applied to the container (e.g. absolute positioning).
 */
const ContactSearchBar = ({
  searchText,
  onSearchTextChange,
  relationFilter,
  onRelationFilterChange,
  favoriteFilter,
  onFavoriteFilterChange,
  availableRelations = [],
  filteredContacts = [],
  hasActiveFilters = false,
  activeFilterCount = 0,
  onReset,
  placeholder = "Search contacts...",
  showFavoriteFilter = true,
  showResultsDropdown = true,
  className = "",
}) => {
  const showDropdown = Boolean(
    showResultsDropdown && (searchText.trim() || hasActiveFilters),
  );

  return (
    <div
      className={
        "relative w-full sm:w-100 flex flex-col gap-3 p-3 bg-blue-50 rounded-3xl text-md z-50" +
        (className ? " " + className : "")
      }
    >
      {/* Search input row */}
      <div className="flex gap-4 items-center">
        <Search className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full focus:outline-0 bg-transparent min-w-0"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
        />
        {searchText && (
          <button
            className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
            onClick={() => onSearchTextChange("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filter controls row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Relation filter */}
        {availableRelations.length > 0 && (
          <select
            value={relationFilter}
            onChange={(e) => onRelationFilterChange(e.target.value)}
            className="text-sm bg-white border border-gray-200 rounded-xl px-2 py-1 focus:outline-0 focus:border-blue-400 cursor-pointer max-w-32 min-w-0"
            aria-label="Filter by relation"
          >
            <option value="">All relations</option>
            {availableRelations.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        )}

        {/* Favorite filter */}
        {showFavoriteFilter && (
          <button
            className={
              "flex items-center gap-1 text-sm rounded-xl px-2 py-1 border transition cursor-pointer" +
              (favoriteFilter
                ? " bg-pink-100 border-pink-300 text-pink-700"
                : " bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600")
            }
            onClick={() => onFavoriteFilterChange(!favoriteFilter)}
            aria-pressed={favoriteFilter}
          >
            <Heart size={14} fill={favoriteFilter ? "#e60076" : "none"} />
            Favorites
          </button>
        )}

        {/* Active filter indicator + reset */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">
              <SlidersHorizontal size={12} />
              {activeFilterCount}
            </span>
            <button
              className="text-xs font-semibold text-gray-500 hover:text-red-600 cursor-pointer"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-blue-50 rounded-2xl shadow-2xs p-3">
          <hr className="border-gray-300 mx-3" />
          <div className="px-3.5 -mt-1 max-h-60 overflow-auto scrollbar-thumb-blue-200">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div key={contact._id || contact.contact_uid} className="py-1">
                  <SearchContactCard
                    contact_id={contact.contact_uid || contact._id}
                    contactImage={contact.contact_profileImage}
                    contactName={contact.contact_name}
                    contactNumber={contact.contact_phone}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-4 text-gray-500">
                <p className="text-center">No contacts match your search.</p>
                {hasActiveFilters && (
                  <button
                    className="mt-2 text-sm text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={onReset}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSearchBar;