import React, { useState } from "react";
import defaultImage from "/default_avatar.png";
import { Phone, Mail, Edit, Trash2, Heart } from "lucide-react";
import { useNavigate } from "react-router";
const ContactCard = ({
  contact_id,
  profileImage,
  contactName,
  contactRelation,
  contactPhone,
  contactEmail,
  isFavorite,
}) => {
  const [fav, setFav] = useState(false);
  const toggleFavorite = () => {
    setFav((prev) => !prev);
  };
  const navi = useNavigate();
  return (
    <div className="shadow-md p-5 min-h-36 flex flex-col gap-16 max-w-60 rounded-xl group w-full justify-center">
      <div>
        <div className="flex gap-1">
          <img
            src={
              profileImage
                ? `http://127.0.0.1:8000/public/profileImages/${profileImage}`
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
            className="ml-auto hover:cursor-pointer"
            onClick={toggleFavorite}
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
            className="cursor-pointer rounded p-1 hover:text-blue-700 hover:bg-blue-100"
          />
          <Trash2
            size={28}
            className="cursor-pointer rounded p-1 hover:text-red-700 hover:bg-red-100"
          />
          <button
            className="cursor-pointer rounded p-1 hover:text-blue-700 hover:bg-blue-100"
            onClick={() => {
              console.log(1)
              alert(contact_id);
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
