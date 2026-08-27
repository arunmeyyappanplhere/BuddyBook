import { Link, useNavigate } from "react-router";
import { BookUser, Compass, Home, ArrowLeft, SearchX } from "lucide-react";
import { useAuth } from "../context/useAuth";

/**
 * BuddyBook 404 page.
 * Rendered as the catch-all route in App.jsx so any unknown URL
 * shows a themed page instead of a blank screen / Vercel 404.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-blue-50 via-white to-blue-100 px-4 py-10 text-center">
      <div className="flex flex-col items-center gap-6 max-w-xl">
        {/* Logo mark */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="BuddyBook home">
          <span className="p-3 bg-blue-500 rounded-2xl shadow-lg transition duration-300 group-hover:scale-[1.05] group-hover:rotate-[-4deg]">
            <BookUser size={32} className="text-white" />
          </span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Buddy<span className="text-blue-500">Book</span>
          </span>
        </Link>

        {/* Big 404 */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter leading-none select-none">
          <span className="text-blue-500">4</span>
          <span className="text-transparent bg-clip-text bg-linear-to-b from-gray-400 to-gray-600">0</span>
          <span className="text-blue-500">4</span>
        </h1>

        {/* Message card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-md border border-blue-100 p-6 sm:p-8 flex flex-col items-center gap-3">
          <span className="p-2.5 bg-blue-100 rounded-full">
            <SearchX size={26} className="text-blue-500" />
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            This contact doesn't exist either!
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-sm">
            Looks like you've wandered off your network. The page you're looking
            for was never saved, moved, or got stashed away.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          {isAuthenticated && (
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2.5 min-h-[44px] rounded-xl bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-md"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 min-h-[44px] rounded-xl bg-white text-blue-600 font-semibold cursor-pointer hover:bg-blue-50 transition flex items-center justify-center gap-2 border border-blue-200"
          >
            <Compass size={18} />
            Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 min-h-[44px] rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
