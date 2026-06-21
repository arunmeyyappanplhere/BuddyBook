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
  UserRound,
} from "lucide-react";
import { useState } from "react";
import default_profile from "/default_avatar.png";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [passowrdVisible, setPasswordVisible] = useState(false);

  const [profileImage, setProfileImage] = useState("");

  const [fileName, setFileName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [dob, setDob] = useState("");

  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate();

  const uploadImage = async () => {
    if (!profileImage) {
      return "";
    }

    const imageFormData = new FormData();
    imageFormData.append("profileImage", profileImage);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/upload",
      imageFormData,
    );

    return response.data.filename;
  };
  const handleRegisterSubmit = async (e) => {
    event.preventDefault();

    // Form validation
    if (!profileImage) {
      setRegisterError("Please upload profile image.");
      return;
    }

    if (username.length < 2) {
      setRegisterError("Username must be atleast 2 characters.");
      return;
    }

    if (password.length < 8) {
      setRegisterError("Password must be atleast 8 characters.");
      return;
    }

    if (phone.length != 10) {
      setRegisterError("Phone Number must be 10 digits.");
      return;
    }

    if (new Date(dob) > new Date()) {
      setRegisterError("Date of Birth cannot be in future.");
      return;
    }

    setFileName(await uploadImage());
    setRegisterError("");

    console.log("filename : ", fileName);
    console.log("username : ", username);
    console.log("email : ", email);
    console.log("password : ", password);
    console.log("phone : ", typeof phone);
    console.log("dob : ", dob);
    console.log("address : ", address);

    try {
      const response = await axios
        .post("http://127.0.0.1:8000/api/register", {
          uuid: crypto.randomUUID(),
          profileImage: fileName,
          name: username,
          email,
          password,
          phoneNumber: parseInt(phone, 10),
          DOB: dob,
          address,
        })
        .then((response) => {
          console.log(response.data);
          toast.success("Successfully signed up!");
          navigate("/home");
        });
    } catch (error) {
      console.error(error);
      error.status == 400
        ? toast.error("Account already exists.")
        : toast.error("Error is signing up.");
    }
  };

  return (
    <div className="flex min-h-200 min-w-80 max-w-280 mt-15 mx-auto rounded-2xl shadow-2xl">
      <div className="flex-1 bg-blue-50 rounded-l-2xl flex flex-col gap-8 mx-auto justify-center pl-15 py-5">
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
        <form onSubmit={handleRegisterSubmit} className="">
          <div className="flex gap-2.5">
            <label
              htmlFor="profileImage"
              className="text-gray-600 text-sm cursor-pointer flex justify-center w-max"
            >
              <div>
                <h2 className="text-center">Profile</h2>
                <img
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : default_profile
                  }
                  alt=""
                  className="size-15 rounded-full mx-auto border border-dashed"
                />
              </div>
            </label>
            <div className="text-gray-600 text-md w-min flex items-center bg-white mb-4">
              <input
                type="file"
                id="profileImage"
                className="hidden"
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                }}
                accept="image/*"
                required
              />
            </div>
            <div>
              <label htmlFor="" className="text-gray-600 text-sm ">
                Name
              </label>
              <div className="text-gray-600 text-md border min-w-80 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <UserRound className="text-gray-600" />
                <input
                  type="text"
                  className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                  placeholder={"Your name"}
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <label htmlFor="" className="text-gray-600 text-sm">
            Email Address
          </label>
          <div className="text-gray-600 text-md border min-w-100 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
            <Mail className="text-gray-600" />
            <input
              type="text"
              className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
              placeholder={"name@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="" className="text-gray-600 text-sm">
              Password
            </label>
            <div className="text-gray-600 text-md flex items-center border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
              <LockKeyhole className="text-gray-600" />
              <input
                type={passowrdVisible ? "text" : "password"}
                className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                placeholder={"••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passowrdVisible ? (
                <EyeOff
                  className="text-gray-600 ml-1 cursor-pointer hover:text-black transition ease-in-out duration-100"
                  onClick={() => setPasswordVisible((prevState) => !prevState)}
                />
              ) : (
                <Eye
                  className="text-gray-600 ml-1 cursor-pointer hover:text-black transition ease-in-out duration-100"
                  onClick={() => setPasswordVisible((prevState) => !prevState)}
                />
              )}
            </div>
          </div>
          <div className="flex gap-10">
            <div>
              <label htmlFor="" className="text-gray-600 text-sm">
                Phone Number
              </label>
              <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Phone className="text-gray-600" />
                <input
                  type="number"
                  className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder={"12345 12345"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="" className="text-gray-600 text-sm">
                Date Of Birth
              </label>
              <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Calendar className="text-gray-600" />
                <input
                  type="date"
                  className="block min-h-9 focus:outline-0 pl-4 mr-0 placeholder:text-gray-300 w-full [&::-webkit-calendar-picker-indicator]:hidden"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="" className="text-gray-600 text-sm">
              Address
            </label>
            <div className="text-gray-600 text-md flex items-start border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
              <MapPin className="text-gray-600" />
              <textarea
                className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full resize-none"
                placeholder={"Door no, Street, City, Pincode."}
                rows={4}
                value={address}
                onChange={(e) => setAdress(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="min-w-100 flex gap-2 items-center justify-center text-white text-md cursor-pointer bg-blue-500  rounded-md min-h-9 p-2.5 hover:bg-blue-400 transition ease-in-out duration-100"
          >
            Sign Up <ArrowRight size={18} />
          </button>
          {registerError && (
            <h3 className="mt-3 text-md text-red-600 max-w-100 text-center">
              {registerError}
            </h3>
          )}
        </form>
        <hr className="min-w-100 w-min text-gray-300" />
        <h3 className="text-md ml-15">
          Already have an account?{" "}
          <a href="" className="text-blue-500 ">
            <Link to={"/login"}>Sign in</Link>
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
