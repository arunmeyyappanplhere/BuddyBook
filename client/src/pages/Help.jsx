import { useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const faqs = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I create an account?",
    answer:
      "Click the 'Sign Up Free' button on the landing page or login page. Fill in your name, email, phone number, date of birth, address, and upload a profile image. Then click 'Sign Up' to create your account instantly.",
  },
  {
    id: 2,
    category: "Getting Started",
    question: "Do I need to provide a profile image?",
    answer:
      "Yes, a profile image is required to create an account. This helps you and your contacts easily identify you in the system. You can upload any image file (JPG, PNG, etc.).",
  },
  {
    id: 3,
    category: "Contacts",
    question: "How do I add a new contact?",
    answer:
      "You can add a contact in two ways: Click the 'Quick Add' button in the dashboard sidebar, or click the '+' (Plus) button at the bottom-right of the screen. Fill in the contact details and click 'Save Contact'.",
  },
  {
    id: 4,
    category: "Contacts",
    question: "Can I edit or delete a contact?",
    answer:
      "Yes, you can view a contact's full profile by clicking on any contact card. From the profile page, you can use the Edit button to modify details. Contact deletion is coming soon.",
  },
  {
    id: 5,
    category: "Contacts",
    question: "How do I mark a contact as a favorite?",
    answer:
      "Click on any contact card to open their profile. The favorite (heart) icon on the contact card toggles the favorite status. Favorited contacts appear in the Favorites section of the dashboard.",
  },
  {
    id: 6,
    category: "Search",
    question: "How does the search work?",
    answer:
      "Use the search bar at the top of the Dashboard or Contacts page. It searches across contact names and phone numbers in real-time. Results appear instantly as you type.",
  },
  {
    id: 7,
    category: "Search",
    question: "Can I search by phone number?",
    answer:
      "Yes, the search function matches both contact names and phone numbers. Simply type any part of the name or the phone number to find matching contacts.",
  },
  {
    id: 8,
    category: "Account",
    question: "How do I log out?",
    answer:
      "Click the 'Logout' button in the SYSTEM section of the dashboard sidebar. You will be redirected to the login page.",
  },
  {
    id: 9,
    category: "Account",
    question: "What happens if I forget my password?",
    answer:
      "Currently, password reset is not available. If you forget your password, please contact support at support@buddybook.app and we will assist you.",
  },
  {
    id: 10,
    category: "Account",
    question: "Is my data secure?",
    answer:
      "Yes, your data is protected with JWT-based authentication, bcrypt password hashing, and secure HTTP-only cookies. We never share your data with third parties. See our Privacy Policy for details.",
  },
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />
      <div className="w-3/4 mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h1 className="text-4xl font-semibold mb-2">Help Center</h1>
          <p className="text-gray-600 mb-8">
            Find answers to common questions about using Buddy Book.
          </p>

          {/* Search */}
          <div className="relative mb-8">
            <div className="flex items-center gap-3 bg-blue-50 border border-gray-300 rounded-xl px-4 py-3">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full focus:outline-0 bg-transparent text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredFaqs.length} result
                {filteredFaqs.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-5 text-left hover:bg-blue-50 transition duration-100"
                    onClick={() =>
                      setOpenFaq(openFaq === faq.id ? null : faq.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-blue-500 bg-blue-100 px-2.5 py-1 rounded-full">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                    </div>
                    {openFaq === faq.id ? (
                      <ChevronUp className="text-gray-500" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-500" size={20} />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">
                  Try searching for keywords like "account", "contact", "search", or "password"
                </p>
              </div>
            )}
          </div>

          {/* Categories */}
          {!searchQuery && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Browse by Category
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-4">
              Contact our support team and we'll get back to you within 24 hours.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition duration-100"
            >
              <Mail size={18} /> Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Help;