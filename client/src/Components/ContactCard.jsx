import { useState } from "react";
import defaultImage from "/default_avatar.png";
import { Phone, Mail, Trash2, Heart, ChevronRight, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { toggleFavorite, deleteContact } from "../api/contacts";
import { useAuth } from "../context/useAuth";

const ContactCard = ({
  contact_id,
  profileImage,
  contactName,
  contactRelation,
  contactPhone,
  contactEmail,
  isFavorite,
  onEdit,
}) => {
  const [fav, setFav] = useState(isFavorite || false);
  const [favoriteUpdating, setFavoriteUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { refreshUser } = useAuth();
  const navi = useNavigate();

  const onToggleFavorite = async (e) => {
    e.stopPropagation();
    if (favoriteUpdating) return;

    const nextFav = !fav;
    setFav(nextFav); // optimistic update
    setFavoriteUpdating(true);

    try {
      await toggleFavorite(contact_id, nextFav);
      await refreshUser();
      toast.success(nextFav ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      console.warn(
        "Favorite toggle API not yet available. Local state updated only.",
        err,
      );
    } finally {
      setFavoriteUpdating(false);
    }
  };

  const onDelete = async (e) => {
    e.stopPropagation();
    if (deleting) return;

    if (!window.confirm(`Delete ${contactName} from your contacts?`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteContact(contact_id);
      await refreshUser();
      toast.success(`${contactName} deleted successfully`);
    } catch (err) {
      console.warn("Delete API not yet available.", err);
      toast.error("Failed to delete contact. Backend endpoint not available yet.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit({
        contact_uid: contact_id,
        contact_name: contactName,
        contact_relation: contactRelation,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        contact_profileImage: profileImage,
        contact_favorite: isFavorite,
      });
    }
  };

  // profileImage already contains the full Cloudinary secure_url from the upload
  const contactImageUrl = profileImage || defaultImage;

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full max-w-sm">
      {/* Gradient header with avatar */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 pb-14">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={contactImageUrl}
                alt={contactName}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
              {fav && (
                <span className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1.5 shadow-md">
                  <Heart size={12} fill="white" color="white" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {contactName}
              </h3>
              <p className="text-sm text-blue-100 truncate">
                {contactRelation || "No relation"}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleEdit}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-blue-400 transition-all duration-200 cursor-pointer"
              title="Edit contact"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
                fav
                  ? "bg-pink-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/40"
              }`}
              title={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={fav ? "white" : "none"} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-red-500 transition-all duration-200 cursor-pointer"
              title="Delete contact"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 pt-4 bg-white">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 shrink-0">
              <Phone size={15} />
            </span>
            <span className="truncate">{contactPhone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-500 shrink-0">
              <Mail size={15} />
            </span>
            <span className="truncate">{contactEmail || "No email"}</span>
          </div>
        </div>

        <button
          onClick={() => {
            navi(`/contact-profile/${contact_id}`);
          }}
          className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all duration-200 cursor-pointer group-hover:shadow-lg group-hover:shadow-blue-200"
        >
          View Profile
          <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ContactCard;