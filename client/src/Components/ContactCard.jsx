import { useState } from "react";
import defaultImage from "/default_avatar.png";
import { Phone, Mail, Edit, Trash2, Heart } from "lucide-react";
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
      // Backend endpoint not yet available (Phase 5). Keep the optimistic
      // local change; it will persist once the PATCH endpoint ships.
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

  return (
    <div className="shadow-md p-5 min-h-36 flex flex-col gap-16 max-w-60 rounded-xl group w-full justify-center">
      <div>
        <div className="flex gap-1">
          <img
            src={
              profileImage
                ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${profileImage}`
                : defaultImage
            }
            alt=""
            className="aspect-square size-20 rounded-full"
          />
          <div className="flex flex-col gap-2 my-auto pl-2">
            <h1 className="font-semibold text-2xl">{contactName}</h1>
            <h2 className="font-medium text-[#23ff] bg-[#23ffff23] px-2 rounded-2xl text-center">
              {contactRelation}
            </h2>
          </div>
          <Heart
            size={22}
            fill={fav ? "#e60076" : "#ffffff"}
            color="#e60076"
            className={
              "ml-auto hover:cursor-pointer transition duration-100" +
              (favoriteUpdating ? " opacity-50 pointer-events-none" : "")
            }
            onClick={onToggleFavorite}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Phone className="text-gray-500" size={22} />
          {contactPhone}
        </div>
        <div className="flex gap-3">
          <Mail className="text-gray-500" size={22} />
          {contactEmail}
        </div>
      </div>
      <div className="transition duration-300 ease-in-out opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0">
        <hr className="border-0.5 mb-2" />
        <div className="flex justify-between items-center">
          <Edit
            size={28}
            title="Edit contact"
            className="cursor-pointer rounded p-1 hover:text-blue-700 hover:bg-blue-100"
            onClick={() => {
              navi(`/contact-profile/${contact_id}`);
            }}
          />
          <Trash2
            size={28}
            title="Delete contact"
            className={
              "cursor-pointer rounded p-1 hover:text-red-700 hover:bg-red-100" +
              (deleting ? " opacity-50 pointer-events-none" : "")
            }
            onClick={onDelete}
          />
          <button
            className="cursor-pointer rounded p-1 hover:text-blue-700 hover:bg-blue-100"
            onClick={() => {
              navi(`/contact-profile/${contact_id}`);
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;