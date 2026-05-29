import React from "react";
import { ArrowLeft, Contact, Edit } from "lucide-react";
import defaultImage from "/default_avatar.png";
import Dashboard from "../Components/Dashboard";
const ContactProfile = () => {
  return (
    <div className="flex">
      <Dashboard tabOnView={"Contacts"} />
      <div className="flex flex-col items-center w-full">
        <div className="text-center flex items-center justify-between p-5 shadow-sm rounded-b-sm w-full">
          <div className="flex items-center gap-5">
            <ArrowLeft
              size={32}
              className="text-black font-bold cursor-pointer"
            />
            <h1 className="text-4xl font-bold">Contact Profile</h1>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-right">
              <h1 className="font-semibold text-md">Arun Meyyappan P L</h1>
              <h2 className="text-gray-600 text-md">90426 49000</h2>
            </div>
            <img src={defaultImage} className="size-15" alt="" />
          </div>
        </div>
        <div className="w-6xl flex flex-col justify-center items-center h-full my-10">
          <img
            src={defaultImage}
            alt=""
            className="w-45 cursor-pointer mb-8 rounded-full border border-white shadow-md"
          />
          <h1 className="text-4xl font-semibold mb-3">Alexander Grahambell</h1>
          <h2 className="text-xl text-[#4648d4] font-medium uppercase font-mono">
            Senior Developer | MERN Stack
          </h2>
          <div className="min-w-180 rounded-xl shadow-2xl min-h-100 mt-7 p-8">
            <div className="flex justify-between items-center mb-15">
              <div className="flex gap-4 items-center">
                <Contact size={32} className="text-[#4648d4]" />
                <h1 className="text-3xl font-semibold">Contact Profile</h1>
              </div>
              <Edit
                size={32}
                className="right-0 cursor-pointer p-1 rounded-md w-min hover:text-[#4648d4] hover:bg-blue-100 "
              />
            </div>
            <div className="flex mb-6">
              <div className="flex-1">
                <h3 className="text-gray-400 text-md font-semibold">EMAIL</h3>
                <p className="font-semibold">sample@gmail.com</p>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-400 text-md font-semibold">
                  MOBILE PHONE
                </h3>
                <p className="font-semibold">+91 78856 48457</p>
              </div>
            </div>
            <div className="flex mb-6">
              <div className="flex-1">
                <h3 className="text-gray-400 text-md font-semibold">
                  BIRTHDAY
                </h3>
                <p className="font-semibold">October 14, 1992 (31 years)</p>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-400 text-md font-semibold">
                  RELATIONSHIP
                </h3>
                <p className="font-semibold text-[#4648d4] bg-blue-100 w-min px-2 rounded-2xl">
                  Profession
                </p>
              </div>
            </div>
            <div className="flex">
              <div>
                <h3 className="text-gray-400 text-md font-semibold">
                  HOME ADDRESS
                </h3>
                <p className="font-semibold">
                  742 Evergreen Aparments, Star Colony, Mars
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
