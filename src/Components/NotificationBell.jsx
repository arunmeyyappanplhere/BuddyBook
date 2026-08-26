import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Cake, X, ChevronRight } from "lucide-react";
import axiosInstance from "../api/axios";
import defaultImage from "/default_avatar.png";
import { handleImageError } from "../utils/imageFallback";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";

const DAYS_AHEAD = 7;

const NotificationBell = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchContacts = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.get("/contacts");
      setContacts(response.data);
    } catch (err) {
      console.error("Failed to fetch contacts for notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingBirthdays = contacts
    .filter((c) => c.contact_dob)
    .map((c) => {
      const dob = new Date(c.contact_dob);
      const today = new Date();
      const thisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      const nextYear = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
      let nextBirthday = thisYear;
      if (nextBirthday < today) nextBirthday = nextYear;
      const diffMs = nextBirthday - today;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { contact: c, nextBirthday, diffDays };
    })
    .filter((item) => item.diffDays >= 0 && item.diffDays <= DAYS_AHEAD)
    .sort((a, b) => a.diffDays - b.diffDays);

  const todayCount = upcomingBirthdays.filter((b) => b.diffDays === 0).length;
  const totalCount = upcomingBirthdays.length;

  const formatBirthdayLabel = (diffDays) => {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const trayContent = (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-blue-50/70 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Cake size={18} className="text-pink-500" />
          <h3 className="font-semibold text-gray-800">Birthday Alerts</h3>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="size-10 rounded-full bg-gray-100" />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-gray-100 rounded mb-1.5" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingBirthdays.length > 0 ? (
          <div className="p-2">
            {todayCount > 0 && (
              <div className="px-3 pt-2 pb-1 text-xs font-semibold text-pink-600 uppercase tracking-wide">
                Today
              </div>
            )}
            {upcomingBirthdays.map(({ contact, diffDays, nextBirthday }) => (
              <button
                key={contact.contact_uid || contact._id}
                onClick={() => {
                  setOpen(false);
                  navigate(`/contact-profile/${contact.contact_uid || contact._id}`);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition cursor-pointer text-left"
              >
                <div className="relative shrink-0">
                  <img
                    src={contact.contact_profileImage || defaultImage}
                    onError={handleImageError}
                    alt=""
                    className="size-10 rounded-full object-cover border-2 border-pink-100"
                  />
                  {diffDays === 0 && (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-pink-500 rounded-full p-1 shadow-md">
                      <Cake size={8} fill="white" color="white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {contact.contact_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBirthdayLabel(diffDays)} · {formatDate(nextBirthday)}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 shrink-0"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Cake size={32} className="text-gray-200 mb-2" />
            <p className="text-sm">No birthdays in the next {DAYS_AHEAD} days.</p>
          </div>
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-400 text-center">
          Birthdays within the next {DAYS_AHEAD} days
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={20} />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full shadow-md">
            {totalCount > 9 ? "9+" : totalCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile: centered modal to avoid horizontal overflow */}
          <div
            className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {trayContent}
            </div>
          </div>

          {/* Desktop: dropdown tray (anchored to the right so it never overflows the viewport when the bell sits at the top-right corner) */}
          <div className="hidden md:block absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            {trayContent}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
