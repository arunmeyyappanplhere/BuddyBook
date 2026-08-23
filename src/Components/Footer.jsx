import { Link } from "react-router";
import BuddyBookLogo from "/BuddyBookLogo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={BuddyBookLogo}
                alt="BuddyBook"
                className="rounded-lg size-9"
              />
              <h3 className="text-white text-lg font-bold">Buddy Book</h3>
            </div>
            <p className="text-sm">
              The high-performance contact management system for modern
              professionals.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/#features"
                  className="hover:text-blue-400 transition duration-100"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/#overview"
                  className="hover:text-blue-400 transition duration-100"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="hover:text-blue-400 transition duration-100"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition duration-100"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-blue-400 transition duration-100"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-blue-400 transition duration-100"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4">Get product updates and tips.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-0 focus:border-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-100 cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 Buddy Book. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-blue-400">
              Log In
            </Link>
            <Link to="/register" className="hover:text-blue-400">
              Sign Up
            </Link>
            <Link to="/terms" className="hover:text-blue-400">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-blue-400">
              Privacy
            </Link>
            <Link to="/help" className="hover:text-blue-400">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
