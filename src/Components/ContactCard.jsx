import { useState } from "react";
import defaultImage from "/default_avatar.png";
import { Phone, Mail, Trash2, Heart, ChevronRight, Pencil, Archive } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { toggleFavorite, deleteContact, toggleStash } from "../api/contacts";
import { useAuth } from "../context/useAuth";
import Spinner from "./Spinner";

const ContactCard = ({
  contact_id,
  profileImage,
  contactName,
  contactRelation,
  contactPhone,
  contactEmail,
  isFavorite,
  isStashed,
  onEdit,
  onFavoriteChange,
  onStashChange,
  onDeleted,
}) => {
  const [fav, setFav] = useState(isFavorite || false);
  const [favoriteUpdating, setFavoriteUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stashed, setStashed] = useState(isStashed || false);
  const [stashUpdating, setStashUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [viewing, setViewing] = useState(false);
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

  const onToggleStash = async (e) => {
    e.stopPropagation();
    if (stashUpdating) return;

    const nextStash = !stashed;
    setStashed(nextStash); // optimistic update
    setStashUpdating(true);

    try {
      await toggleStash(contact_id, nextStash);
      await refreshUser();
      if (onStashChange) onStashChange(contact_id, nextStash);
      toast.success(nextStash ? "Contact stashed" : "Contact un-stashed");
    } catch (err) {
      console.warn("Failed to update stash status", err);
      setStashed(!nextStash); // rollback
      toast.error("Failed to update stash status");
    } finally {
      setStashUpdating(false);
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
      // Remove the card from the parent list immediately
      if (onDeleted) onDeleted(contact_id);
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
    if (editing) return;
    setEditing(true);
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
    setEditing(false);
  };

  // profileImage already contains the full Cloudinary secure_url from the upload
  const contactImageUrl = profileImage || defaultImage;

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col w-full max-w-sm">
      {/* Gradient header with avatar */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 pb-14">
        <div className="flex flex-col gap-4">
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
          <div className="flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={editing}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-blue-400 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Edit contact"
              >
                {editing ? <Spinner size={16} className="text-white" /> : <Pencil size={16} />}
              </button>
              <button
                onClick={onToggleFavorite}
                disabled={favoriteUpdating}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  fav
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/40"
                }`}
                title={fav ? "Remove from favorites" : "Add to favorites"}
              >
                {favoriteUpdating ? (
                  <Spinner size={16} className="text-white" />
                ) : (
                  <Heart size={16} fill={fav ? "white" : "none"} />
                )}
              </button>
              <button
                onClick={onToggleStash}
                disabled={stashUpdating}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  stashed
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/40"
                }`}
                title={stashed ? "Un-stash contact" : "Stash contact"}
              >
                {stashUpdating ? <Spinner size={16} className="text-white" /> : <Archive size={16} />}
              </button>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-red-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Delete contact"
              >
                {deleting ? <Spinner size={16} className="text-white" /> : <Trash2 size={16} />}
              </button>
            </div>
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
              setViewing(true);
              navi(`/contact-profile/${contact_id}`);
            }}
            disabled={viewing}
            className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all duration-200 cursor-pointer group-hover:shadow-lg group-hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {viewing ? (
              <>
                <Spinner size={16} className="text-white" />
                Opening...
              </>
            ) : (
              <>
                View Profile
                <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
      </div>
    </div>
  );
};

export default ContactCard;