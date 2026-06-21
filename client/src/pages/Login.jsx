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
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [passowrdVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    event.preventDefault();

    // Form Validation

    if (password.length < 8) {
      setRegisterError("Password must be atleast 8 characters.");
      return;
    }

    setRegisterError("");

    try {
      const response = await axios
        .post("http://127.0.0.1:8000/api/login", { email, password })
        .then((response) => {
          console.log(response.data);
          toast.success("Logged in successfully!");
          navigate("/home");
        });
    } catch (error) {
      console.error(error);
      error.status == 404
        ? toast.error("User doesn't exists.")
        : error.status == 400
          ? toast.error("Password doesn't match.")
          : toast.error("Trouble in log in.");
    }
  };

  return (
    <div className="flex min-h-200 min-w-80 max-w-280 mt-25 mx-auto rounded-2xl shadow-2xl">
      <div className='flex-1 bg-[url("/networkTexture.png")] bg-gray-800 bg-blend-multiply rounded-l-2xl flex flex-col items-center justify-center gap-4 px-5'>
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
      <div className="flex-1 bg-blue-50 rounded-2xl flex flex-col gap-8 mx-auto justify-center pl-15">
        <div className="flex items-center gap-3 font-semibold text-3xl ">
          <img src={BuddyBookLogo} alt="" className="rounded-md size-15" />
          <h1 className="text-blue-500 text-3xl">Buddy Book</h1>
        </div>
        <div>
          <h1 className="font-semibold text-3xl">Welcome Back Buddy!</h1>
          <h2 className="text-sm text-gray-500">
            Please enter you details to sign in.
          </h2>
        </div>
        <form onSubmit={loginHandler} className="">
          <label for="" className="text-gray-600 text-sm">
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
          <label for="" className="text-gray-600 text-sm">
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
            )}{" "}
          </div>
          <button className="min-w-100 flex gap-2 items-center justify-center text-white text-sm cursor-pointer bg-blue-500  rounded-md min-h-9 p-2 hover:bg-blue-400 transition ease-in-out duration-100">
            Sign in <ArrowRight size={18} />
          </button>
          {registerError && (
            <h3 className="mt-3 text-md text-red-600 max-w-100 text-center">
              {registerError}
            </h3>
          )}
        </form>
        <hr className="min-w-100 w-min text-gray-300" />
        <h3 className="text-md ml-15">
          Don't have an account?{" "}
          <a href="" className="text-blue-500 ">
            <Link to={"/register"}>Sign up for free</Link>
          </a>
        </h3>
      </div>
    </div>
  );
};

export default Login;
