import { Link } from "react-router";
import { useState } from "react";
import BuddyBookLogo from "/BuddyBookLogo.png";
import { Star, Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={BuddyBookLogo} alt="BuddyBook" className="rounded-lg size-11" />
          <h1 className="text-blue-500 text-2xl font-bold">Buddy Book</h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link to="/" className="hover:text-blue-500 transition duration-100">Home</Link>
          <Link to="/#features" className="hover:text-blue-500 transition duration-100">Features</Link>
          <Link to="/#overview" className="hover:text-blue-500 transition duration-100">Overview</Link>
          <Link to="/help" className="hover:text-blue-500 transition duration-100">Help</Link>
          <Link to="/contact" className="hover:text-blue-500 transition duration-100">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-block px-5 py-2 text-blue-500 font-semibold border border-blue-500 rounded-lg hover:bg-blue-50 transition duration-100"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-400 transition duration-100"
          >
            Sign Up Free
          </Link>
          <button
            type="button"
            role="switch"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={toggleTheme}
            className="rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-1 h-4 w-4" />
                Light
              </>
            ) : (
              <>
                <Moon className="mr-1 h-4 w-4" />
                Dark
              </>
            )}
          </button>
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-500 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              to="/"
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-100 py-1"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-100 py-1"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#overview"
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-100 py-1"
              onClick={() => setMobileOpen(false)}
            >
              Overview
            </Link>
            <Link
              to="/help"
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-100 py-1"
              onClick={() => setMobileOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 font-medium hover:text-blue-500 transition duration-100 py-1"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-blue-500 font-semibold border border-blue-500 rounded-lg px-4 py-2 text-center hover:bg-blue-50 transition duration-100"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;