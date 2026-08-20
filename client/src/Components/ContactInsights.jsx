import { useNavigate } from "react-router";
import {
  Plus,
  Heart,
  Clock,
  Users,
  BookUser,
  ChevronRight,
} from "lucide-react";

const RELATION_COLORS = [
  { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-100" },
  { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-100" },
  { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-100" },
  { bg: "bg-green-500", text: "text-green-600", light: "bg-green-100" },
  { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-100" },
  { bg: "bg-teal-500", text: "text-teal-600", light: "bg-teal-100" },
];

/**
 * Dashboard panel that fills the empty right-side space beside
 * the Recent Contacts list. Shows a network relation breakdown
 * and quick-action shortcuts.
 *
 * @param {Array} contacts - all user contacts
 * @param {number} favoriteCount - number of favorite contacts
 * @param {number} recentCount - number of recently added contacts
 * @param {Function} onAddContact - callback to open the add-contact modal
 */
const ContactInsights = ({ contacts = [], favoriteCount = 0, recentCount = 0, onAddContact }) => {
  const navigate = useNavigate();

  const total = contacts.length;
  const relationMap = {};
  contacts.forEach((c) => {
    const rel = c.contact_relation || "Other";
    relationMap[rel] = (relationMap[rel] || 0) + 1;
  });
  const relationEntries = Object.entries(relationMap).sort((a, b) => b[1] - a[1]);

  const quickActions = [
    {
      label: "Add Contact",
      icon: <Plus size={18} className="text-white" />,
      onClick: onAddContact,
      className: "bg-blue-500 text-white hover:bg-blue-600",
    },
    {
      label: "Favorites",
      icon: <Heart size={18} className="text-pink-600" />,
      onClick: () => navigate("/favorites"),
      className: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    },
    {
      label: "Recent",
      icon: <Clock size={18} className="text-purple-600" />,
      onClick: () => navigate("/recent"),
      className: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      label: "All Contacts",
      icon: <BookUser size={18} className="text-teal-600" />,
      onClick: () => navigate("/contacts"),
      className: "bg-teal-50 text-teal-600 hover:bg-teal-100",
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Network breakdown */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 rounded-xl">
              <Users size={18} className="text-blue-600" />
            </span>
            <h2 className="text-lg font-semibold text-gray-800">
              Network Breakdown
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">
            {total} {total === 1 ? "contact" : "contacts"}
          </span>
        </div>

        {relationEntries.length > 0 ? (
          <div className="flex flex-col gap-4">
            {relationEntries.map(([rel, count], i) => {
              const color = RELATION_COLORS[i % RELATION_COLORS.length];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={rel}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium truncate">
                      {rel}
                    </span>
                    <span className="text-gray-400 shrink-0">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center text-gray-400">
            <Users size={32} className="text-gray-200 mb-2" />
            <p className="text-sm">Add contacts to see your network breakdown.</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition duration-200 hover:scale-[1.02] ${action.className}`}
            >
              {action.icon}
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Summary row */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center justify-between w-full text-sm group cursor-pointer"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <Heart size={15} className="text-pink-500" />
              Favorite contacts
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">{favoriteCount}</span>
              <ChevronRight
                size={14}
                className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200"
              />
            </span>
          </button>
          <button
            onClick={() => navigate("/recent")}
            className="flex items-center justify-between w-full text-sm group cursor-pointer"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <Clock size={15} className="text-purple-500" />
              Added this week
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">{recentCount}</span>
              <ChevronRight
                size={14}
                className="text-gray-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-200"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInsights;