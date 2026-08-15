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
import { Link, useNavigate, useLocation } from "react-router";

import axiosInstance from "../api/axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [profileImage, setProfileImage] = useState("");

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [dob, setDob] = useState("");

  const [registerError, setRegisterError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const uploadImage = async () => {
    if (!profileImage) {
      return "";
    }

    const imageFormData = new FormData();
    imageFormData.append("profileImage", profileImage);

    const response = await axiosInstance.post("/upload", imageFormData);

    return response.data.filename;
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

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

    const uploadedFileName = await uploadImage();
    setRegisterError("");

    const userData = {
      uuid: crypto.randomUUID(),
      profileImage: uploadedFileName,
      name: username,
      email,
      password,
      phoneNumber: parseInt(phone, 10),
      DOB: dob,
      address,
    };

    const result = await register(userData);

    if (result.success) {
      toast.success("Successfully signed up!");
      navigate(from, { replace: true });
    } else {
      if (result.status === 400) {
        toast.error("Account already exists.");
      } else {
        toast.error("Error is signing up.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex-1 bg-blue-50 flex flex-col gap-8 mx-auto justify-center px-6 py-10 lg:pl-15 w-full">
        <div className="flex items-center gap-3 font-semibold text-3xl">
          <img src={BuddyBookLogo} alt="" className="rounded-md size-15" />
          <h1 className="text-blue-500 text-3xl">Buddy Book</h1>
        </div>
        <div>
          <h1 className="font-semibold text-2xl md:text-3xl">Welcome Buddy!</h1>
          <h2 className="text-sm text-gray-500">
            Please enter you details to sign in.
          </h2>
        </div>
        <form onSubmit={handleRegisterSubmit} className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2.5">
            <label
              htmlFor="profileImage"
              className="text-gray-600 text-sm cursor-pointer flex justify-center w-full sm:w-max"
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
            <div className="flex-1 w-full">
              <label htmlFor="" className="text-gray-600 text-sm">
                Name
              </label>
              <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <UserRound className="text-gray-600 shrink-0" />
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
          <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
            <Mail className="text-gray-600 shrink-0" />
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
            <div className="text-gray-600 text-md flex items-center border w-full border-gray-300 bg-white px-2 p-1 rounded-md mb-4">
              <LockKeyhole className="text-gray-600 shrink-0" />
              <input
                type={passwordVisible ? "text" : "password"}
                className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                placeholder={"••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordVisible ? (
                <EyeOff
                  className="text-gray-600 ml-1 cursor-pointer hover:text-black transition ease-in-out duration-100 shrink-0"
                  onClick={() => setPasswordVisible((prevState) => !prevState)}
                />
              ) : (
                <Eye
                  className="text-gray-600 ml-1 cursor-pointer hover:text-black transition ease-in-out duration-100 shrink-0"
                  onClick={() => setPasswordVisible((prevState) => !prevState)}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
            <div className="flex-1">
              <label htmlFor="" className="text-gray-600 text-sm">
                Phone Number
              </label>
              <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Phone className="text-gray-600 shrink-0" />
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
            <div className="flex-1">
              <label htmlFor="" className="text-gray-600 text-sm">
                Date Of Birth
              </label>
              <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Calendar className="text-gray-600 shrink-0" />
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
            <div className="text-gray-600 text-md flex items-start border w-full border-gray-300 bg-white px-2 p-1 rounded-md mb-4">
              <MapPin className="text-gray-600 shrink-0" />
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
            className="w-full flex gap-2 items-center justify-center text-white text-md cursor-pointer bg-blue-500 rounded-md min-h-9 p-2.5 hover:bg-blue-400 transition ease-in-out duration-100"
          >
            Sign Up <ArrowRight size={18} />
          </button>
          {registerError && (
            <h3 className="mt-3 text-md text-red-600 text-center">
              {registerError}
            </h3>
          )}
        </form>
        <hr className="w-full max-w-md text-gray-300" />
        <div className="flex gap-4">
          <h3 className="text-md">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500">
              Sign in
            </Link>
          </h3>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 text-sm">
          <Link to={"/terms"} className="text-gray-500 hover:text-blue-500 transition duration-100">
            Terms
          </Link>
          <Link to={"/privacy"} className="text-gray-500 hover:text-blue-500 transition duration-100">
            Privacy
          </Link>
          <Link to={"/help"} className="text-gray-500 hover:text-blue-500 transition duration-100">
            Help
          </Link>
        </div>
      </div>
      <div className='hidden lg:flex flex-1 bg-[url("/networkTexture.png")] bg-gray-800 bg-blend-multiply flex-col items-center justify-center gap-4 px-5'>
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