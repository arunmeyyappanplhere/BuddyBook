import React from "react";
import defaultImage from "/default_avatar.png";
const RecentContactCard = () => {
  return (
    <div className="bg-[#f9f9f934] w-full shadow-xs rounded-sm flex gap-10 items-center py-1 px-4 cursor-pointer">
      <img src={defaultImage} alt="" className="size-15 rounded-full" />
      <div>
        <h1 className="font-medium text-md">Arun Meyyappan P L</h1>

        <h2 className="text-gray-500 text-sm text-wrap">
          Full Stack Website Development at Zoho 
        </h2>
      </div>
      <h2 className="font-medium text-sm ml-auto text-nowrap">90426 49000</h2>
    </div>
  );
};

export default RecentContactCard;
