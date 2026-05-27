import React from "react";
import BuddyBookLogo from "/BuddyBookLogo.png";
import {
  CircleCheck,
  Users,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
const Register = () => {
  return (
    <div className="flex min-h-200 min-w-80 max-w-280 mt-25 mx-auto rounded-2xl shadow-2xl">
      <div className="flex-1 bg-blue-50 rounded-l-2xl flex flex-col gap-8 mx-auto justify-center pl-15">
        <div className="flex items-center gap-3 font-semibold text-3xl ">
          <img src={BuddyBookLogo} alt="" className="rounded-md size-15" />
          <h1 className="text-blue-500 text-3xl">Buddy Book</h1>
        </div>
        <div>
          <h1 className="font-semibold text-3xl">Welcome Buddy!</h1>
          <h2 className="text-sm text-gray-500">
            Please enter you details to sign in.
          </h2>
        </div>
        <form action="" className="">
          <label for="" className="text-gray-600 text-sm">
            Email Address
          </label>
          <div className="text-gray-600 text-md border min-w-100 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
            <Mail className="text-gray-600" />
            <input
              type="text"
              className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
              placeholder={"name@company.com"}
            />
          </div>
          <div>
            <label for="" className="text-gray-600 text-sm">
              Password
            </label>
            <div className="text-gray-600 text-md flex items-center border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
              <LockKeyhole className="text-gray-600" />
              <input
                type="password"
                className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                placeholder={"••••••"}
              />
              <Eye className="text-gray-600 ml-1 cursor-pointer hover:text-black transition ease-in-out duration-100" />
            </div>
          </div>
          <div className="flex gap-10">
            <div>
              <label for="" className="text-gray-600 text-sm">
                Phone Number
              </label>
              <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Phone className="text-gray-600" />
                <input
                  type="number"
                  className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder={"12345 12345"}
                />
              </div>
            </div>
            <div>
              <label for="" className="text-gray-600 text-sm">
                Date Of Birth
              </label>
              <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Calendar className="text-gray-600" />
                <input
                  type="date"
                  className="block min-h-9 focus:outline-0 pl-4 mr-0 placeholder:text-gray-300 w-full [&::-webkit-calendar-picker-indicator]:hidden"
                  placeholder={"12345 12345"}
                />
              </div>
            </div>
          </div>

          <div>
            <label for="" className="text-gray-600 text-sm">
              Address
            </label>
            <div className="text-gray-600 text-md flex items-start border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
              <MapPin className="text-gray-600" />
              <textarea
                className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full resize-none"
                placeholder={"Door no, Street, City, Pincode."}
                rows={4}
              />
            </div>
          </div>
          <button className="min-w-100 flex gap-2 items-center justify-center text-white text-md cursor-pointer bg-blue-500  rounded-md min-h-9 p-2.5 hover:bg-blue-400 transition ease-in-out duration-100">
            Sign Up <ArrowRight size={18} />
          </button>
        </form>
        <hr className="min-w-100 w-min text-gray-300" />
        <h3 className="text-md ml-15">
          Already have an account?{" "}
          <a href="" className="text-blue-500 ">
            Sign in
          </a>
        </h3>
      </div>
      <div className='flex-1 bg-[url("/networkTexture.png")] bg-gray-800 bg-blend-multiply rounded-2xl flex flex-col items-center justify-center gap-4 px-5'>
        <img src={BuddyBookLogo} alt="" className="rounded-2xl size-20" />
        <h1 className="text-white text-center text-3xl px-10">
          Organize your world with precision.
        </h1>
        <h2 className="text-white text-center px-10">
          The high-performance contact management system for modern
          professionals. Stay connected, stay organized, stay ahead.
        </h2>
        <div className="flex gap-4 mt-10">
          <div className="border-[#4aeaff] bg-[#3838383a] flex gap-2 text-sm text-white w-sx p-2.5 items-center rounded-md animate-pulse shadow-md">
            <CircleCheck className="" /> 1.2K Contacts Synced
          </div>
          <div className="border-[#4aeaff] bg-[#3838383a] flex gap-2 text-sm text-white w-sx p-2.5 items-center rounded-md animate-pulse shadow-md">
            <Users className="" /> Team Shared Groups
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
