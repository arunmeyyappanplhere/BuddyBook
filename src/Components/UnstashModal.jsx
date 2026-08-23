import { useState, useEffect } from "react";
import { X, CheckSquare, Square } from "lucide-react";
import { getStashedContacts, unstashContacts } from "../api/contacts";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const UnstashModal = ({ open, onClose, onUnstashSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [stashedContacts, setStashedContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unstashing, setUnstashing] = useState(false);

  useEffect(() => {
    if (!open || !isAuthenticated) return;

    const fetchStashed = async () => {
      setLoading(true);
      try {
        const data = await getStashedContacts();
        setStashedContacts(data);
        setSelectedIds(data.map((c) => c.contact_uid || c._id));
      } catch (err) {
        console.error("Failed to fetch stashed contacts:", err);
        toast.error("Failed to load stashed contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchStashed();
  }, [open, isAuthenticated]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === stashedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stashedContacts.map((c) => c.contact_uid || c._id));
    }
  };

  const handleUnstash = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one contact to unstash.");
      return;
    }

    setUnstashing(true);
    try {
      await unstashContacts(selectedIds);
      toast.success(`Unstashed ${selectedIds.length} contact(s) successfully!`);
      setStashedContacts((prev) =>
        prev.filter((c) => !selectedIds.includes(c.contact_uid || c._id)),
      );
      setSelectedIds([]);
      onUnstashSuccess?.();
    } catch (err) {
      console.error("Failed to unstash contacts:", err);
      toast.error("Failed to unstash contacts. Please try again.");
    } finally {
      setUnstashing(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-99 bg-[#000000b0] transition duration-300 p-4"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-3xl max-h-[85vh] rounded-xl shadow-2xl bg-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold">Unstash Contacts</h1>
            <p className="text-gray-600 text-sm">
              Select contacts to move back to your active list.
            </p>
          </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black transition duration-300 cursor-pointer disabled:cursor-not-allowed"
              disabled={unstashing}
            >
              <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">Loading stashed contacts...</div>
            </div>
          ) : stashedContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <p className="text-lg">No stashed contacts found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4 cursor-pointer select-none"
                onClick={toggleSelectAll}
              >
                {selectedIds.length === stashedContacts.length ? (
                  <CheckSquare className="text-blue-500" size={20} />
                ) : (
                  <Square className="text-gray-400" size={20} />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Select All ({selectedIds.length}/{stashedContacts.length})
                </span>
              </div>

              {stashedContacts.map((contact) => {
                const id = contact.contact_uid || contact._id;
                const isSelected = selectedIds.includes(id);
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleSelect(id)}
                  >
                    {isSelected ? (
                      <CheckSquare className="text-blue-500 shrink-0" size={20} />
                    ) : (
                      <Square className="text-gray-400 shrink-0" size={20} />
                    )}
                    <img
                      src={
                        contact.contact_profileImage
                          ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${contact.contact_profileImage}`
                          : "/default_avatar.png"
                      }
                      alt=""
                      className="size-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {contact.contact_name}
                      </h3>
                      <p className="text-gray-500 text-xs truncate">
                        {contact.contact_email}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {contact.contact_relation || "No relation"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {selectedIds.length} contact(s) selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={unstashing}
            >
              {unstashing ? (
                <>
                  <Spinner size={18} className="text-gray-700" />
                  Please wait...
                </>
              ) : (
                "Cancel"
              )}
            </button>
            <button
              onClick={handleUnstash}
              disabled={unstashing || selectedIds.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {unstashing ? (
                <>
                  <Spinner size={18} className="text-white" />
                  Unstashing...
                </>
              ) : (
                `Unstash (${selectedIds.length})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnstashModal;
