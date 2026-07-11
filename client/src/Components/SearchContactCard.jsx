import React from "react";
import defaultImage from "/default_avatar.png";
const SearchContactCard = ({
  contactImage,
  contactName,
  contactNumber,
}) => {
  return (
    <div className="bg-[#f9f9f934] w-full shadow-xs rounded-sm flex gap-10 items-center py-1 px-4 cursor-pointer">
      <img
        src={
          contactImage
            ? `http://127.0.0.1:8000/public/profileImages/${contactImage}`
            : defaultImage
        }
        alt=""
        className="size-15 rounded-full"
      />
      <div>
        <h1 className="font-medium text-md">{contactName}</h1>
        <h2 className="text-gray-500 text-sm">{contactNumber}</h2>
      </div>
    </div>
  );
};

export default SearchContactCard;
