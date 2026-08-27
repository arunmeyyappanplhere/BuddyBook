import { useState } from "react";
import defaultImage from "/default_avatar.png";
import { Heart, Phone, ChevronRight, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { toggleFavorite } from "../api/contacts";
import { handleImageError } from "../utils/imageFallback";
import { useAuth } from "../context/useAuth";

const RecentContactCard = ({
  contact_id,
  contactName = "User",
  role = "User role",
  contactNumber = 1234567890,
  contactImage,
  contactRelation,
  isFavorite,
  onFavoriteChange,
}) => {
  const navi = useNavigate();
  const { refreshUser } = useAuth();
  const [fav, setFav] = useState(isFavorite || false);
  const [favoriteUpdating, setFavoriteUpdating] = useState(false);

  const onToggleFavorite = async (e) => {
    e.stopPropagation();
    if (favoriteUpdating) return;

    const nextFav = !fav;
    setFav(nextFav); // optimistic update
    setFavoriteUpdating(true);

    try {
      await toggleFavorite(contact_id, nextFav);
      await refreshUser();
      if (onFavoriteChange) onFavoriteChange(contact_id, nextFav);
      toast.success(nextFav ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      console.warn("Failed to update favorite status", err);
      setFav(!nextFav); // rollback
      toast.error("Failed to update favorite status");
    } finally {
      setFavoriteUpdating(false);
    }
  };

  const displayRole = contactRelation || role || "No role specified";

  return (
    <div className="group bg-white w-full rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-3 md:gap-4 py-2.5 px-4 cursor-pointer hover:bg-blue-50/70 border border-transparent hover:border-blue-200">
      <div className="relative shrink-0">
        <img
          src={contactImage || defaultImage}
          onError={handleImageError}
          alt=""
          className="size-11 md:size-13 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-300"
        />
        {fav && (
          <span className="absolute -bottom-0.5 -right-0.5 bg-pink-500 rounded-full p-1 shadow-md">
            <Heart size={8} fill="white" color="white" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-md truncate text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {contactName}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm truncate">
          <UserRound size={11} className="shrink-0" />
          <span className="truncate">{displayRole || contactRelation || role}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
          <Phone size={10} className="shrink-0" />
          <span className="truncate">{contactNumber}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleFavorite}
          disabled={favoriteUpdating}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            fav
              ? "bg-pink-100 text-pink-600 scale-110"
              : "text-gray-400 hover:text-pink-500 hover:bg-pink-50"
          }`}
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={fav ? "currentColor" : "none"} />
        </button>
        <ChevronRight
          size={16}
          className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200"
          onClick={() => contact_id && navi(`/contact-profile/${contact_id}`)}
        />
      </div>
    </div>
  );
};

export default RecentContactCard;