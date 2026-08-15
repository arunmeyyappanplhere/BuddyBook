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
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const loginHandler = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setRegisterError("Password must be atleast 8 characters.");
      return;
    }

    setRegisterError("");

    const result = await login(email, password);

    if (result.success) {
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } else {
      if (result.status === 404) {
        toast.error("User doesn't exists.");
      } else if (result.status === 400) {
        toast.error("Password doesn't match.");
      } else {
        toast.error("Trouble in log in.");
      }
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
          <label htmlFor="" className="text-gray-600 text-sm">
            Password
          </label>
          <div className="text-gray-600 text-md flex items-center border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
            <LockKeyhole className="text-gray-600" />
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
        <div className="flex gap-4">
          <h3 className="text-md ml-15">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-blue-500">
              Sign up for free
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
    </div>
  );
};

export default Login;
