import React from "react";
import defaultImage from "/default_avatar.png";
import { Phone, Mail, Edit, Trash2 } from "lucide-react";
const ContactCard = () => {
  return (
    <div className="shadow-2xs p-5 min-h-36 flex flex-col gap-16 max-w-60 rounded-xl group">
      <div className="flex">
        <img src={defaultImage} alt="" className="aspect-square size-20" />
        <div className="flex flex-col gap-2 my-auto pl-2">
          <h1 className="font-semibold text-2xl">Kavya</h1>
          <h2 className="font-medium text-[#23ff] bg-[#23ffff23] px-2 rounded-2xl w-min">
            Work
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Phone className="text-gray-500" size={22} />
          {"+91 98765 92833"}
        </div>
        <div className="flex gap-3">
          <Mail className="text-gray-500" size={22} />
          {"sample@gmail.com"}
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
          <button className="cursor-pointer rounded p-1 hover:text-blue-700 hover:bg-blue-100">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
