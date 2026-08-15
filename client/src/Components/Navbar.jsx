import { Link } from "react-router";
import BuddyBookLogo from "/BuddyBookLogo.png";
import { Star } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={BuddyBookLogo} alt="BuddyBook" className="rounded-lg size-11" />
          <h1 className="text-blue-500 text-2xl font-bold">Buddy Book</h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link to="/#features" className="hover:text-blue-500 transition duration-100">Features</Link>
          <Link to="/#overview" className="hover:text-blue-500 transition duration-100">Overview</Link>
          <Link to="/help" className="hover:text-blue-500 transition duration-100">Help</Link>
          <Link to="/contact" className="hover:text-blue-500 transition duration-100">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-blue-500 font-semibold border border-blue-500 rounded-lg hover:bg-blue-50 transition duration-100"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-400 transition duration-100"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;