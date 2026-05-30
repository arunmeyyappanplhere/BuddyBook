import React from "react";
import { Plus, Minus } from "lucide-react";
import { CountUp } from 'use-count-up';
const StatsCard = ({ icon, heading, count, percentage }) => {
  return (
    <div className="flex flex-col gap-3 h-45 w-1/5 rounded-2xl bg-white shadow-md p-5 group">
      <div className="flex justify-between">
        {icon}
        {
          <h2
            className={
              (percentage > 0
                ? "text-green-600 bg-green-200"
                : percentage < 0
                  ? "text-red-600 bg-red-200"
                  : "text-blue-600 bg-blue-200") +
              " rounded-md text-sm font-semibold p-2 h-min transition duration-100 ease-in-out group-hover:scale-[1.06]"
            }
          >
            {percentage.toFixed(1)}%
          </h2>
        }
      </div>
      <h1 className="text-gray-600 text-md font-semibold">{heading}</h1>
      <h2 className="font-bold text-3xl">
        <CountUp isCounting end={count} duration={1}/>
      </h2>
    </div>
  );
};

export default StatsCard;
