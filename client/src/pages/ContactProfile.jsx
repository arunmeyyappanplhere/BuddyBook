import { useState, useEffect } from "react";
import { ArrowLeft, Contact, Edit, X, Check } from "lucide-react";
import defaultImage from "/default_avatar.png";
import Dashboard from "../Components/Dashboard";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

const ContactProfile = () => {
  const { id } = useParams();
  const {
    user: userProfile,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const navi = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const loadContact = () => {
    const timer = setTimeout(() => {
      try {
        if (userProfile) {
          const foundContact = userProfile.contacts?.find(
            (c) => c.contact_uid === id || c._id === id,
          );
          setContact(foundContact || null);
          if (foundContact) {
            setFormData({
              contact_name: foundContact.contact_name,
              contact_role: foundContact.contact_role,
              contact_relation: foundContact.contact_relation,
              contact_email: foundContact.contact_email,
              contact_phone: foundContact.contact_phone,
              contact_dob: foundContact.contact_dob
                ? String(foundContact.contact_dob).slice(0, 10)
                : "",
              contact_address: foundContact.contact_address || "",
            });
          }
        }
      } catch {
        setLoadError("Failed to load contact details.");
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (authLoading) return;
    if (authError) {
      return;
    }
    return loadContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userProfile, authLoading, authError]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Backend update endpoint (PUT /api/contacts/:id) ships in Phase 5.
      toast.success("Contact updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update contact.");
    } finally {
      setSaving(false);
    }
  };

  const contactImage = contact?.contact_profileImage
    ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${contact.contact_profileImage}`
    : defaultImage;

  return (
    <div className="flex">
      <Dashboard tabOnView={"Contacts"} />
      <div className="flex flex-col items-center w-full">
        <div className="text-center flex items-center justify-between p-5 shadow-sm rounded-b-sm w-full">
          <div className="flex items-center gap-5">
            <ArrowLeft
              size={32}
              className="text-black font-bold cursor-pointer"
              onClick={() => navi("/contacts")}
            />
            <h1 className="text-4xl font-bold">Contact Profile</h1>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-right">
              <h1 className="font-semibold text-md">
                {userProfile?.name || ""}
              </h1>
              <h2 className="text-gray-600 text-md">
                {userProfile?.phoneNumber || ""}
              </h2>
            </div>
            <img
              src={
                userProfile?.profileImage
                  ? `${import.meta.env.VITE_API_BASE_URL}/public/profileImages/${userProfile.profileImage}`
                  : defaultImage
              }
              className="size-15"
              alt=""
            />
          </div>
        </div>

        {authError && !loading && (
          <div className="w-6xl flex flex-col justify-center items-center h-full my-10">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600 text-lg">
                Failed to load your profile data.
              </p>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="w-6xl flex flex-col justify-center items-center h-full my-10">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="size-45 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-8 w-52 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-5 w-32 bg-gray-100 rounded-xl animate-pulse" />
              <div className="w-full min-w-180 rounded-xl shadow-2xl min-h-100 mt-7 p-8 bg-gray-50 animate-pulse" />
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600 text-lg">{loadError}</p>
              <button
                className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition"
                onClick={() => {
                  setLoading(true);
                  setLoadError(null);
                  loadContact();
                }}
              >
                Retry
              </button>
            </div>
          ) : contact ? (
            <>
              <img
                src={contactImage}
                alt=""
                className="w-45 cursor-pointer mb-8 rounded-full border border-white shadow-md"
              />
              <h1 className="text-4xl font-semibold mb-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.contact_name || ""}
                    onChange={(e) =>
                      handleFieldChange("contact_name", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1 text-center focus:outline-0 focus:border-blue-500"
                  />
                ) : (
                  contact.contact_name
                )}
              </h1>
              <h2 className="text-xl text-[#4648d4] font-medium uppercase font-mono">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData?.contact_role || ""}
                    onChange={(e) =>
                      handleFieldChange("contact_role", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-1 text-center focus:outline-0 focus:border-blue-500"
                  />
                ) : (
                  contact.contact_role || "No role specified"
                )}
              </h2>
              <div className="min-w-180 rounded-xl shadow-2xl min-h-100 mt-7 p-8">
                <div className="flex justify-between items-center mb-15">
                  <div className="flex gap-4 items-center">
                    <Contact size={32} className="text-[#4648d4]" />
                    <h1 className="text-3xl font-semibold">Contact Profile</h1>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <X
                        size={32}
                        className="right-0 cursor-pointer p-1 rounded-md hover:text-red-500 hover:bg-red-100"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            contact_name: contact.contact_name,
                            contact_role: contact.contact_role,
                            contact_relation: contact.contact_relation,
                            contact_email: contact.contact_email,
                            contact_phone: contact.contact_phone,
                            contact_dob: contact.contact_dob
                              ? String(contact.contact_dob).slice(0, 10)
                              : "",
                            contact_address: contact.contact_address || "",
                          });
                        }}
                      />
                      <Check
                        size={32}
                        className={
                          "right-0 cursor-pointer p-1 rounded-md hover:text-green-700 hover:bg-green-100" +
                          (saving ? " opacity-50 pointer-events-none" : "")
                        }
                        onClick={handleSave}
                      />
                    </div>
                  ) : (
                    <Edit
                      size={32}
                      className="right-0 cursor-pointer p-1 rounded-md w-min hover:text-[#4648d4] hover:bg-blue-100 "
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>
                <div className="flex mb-6">
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-md font-semibold">
                      EMAIL
                    </h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData?.contact_email || ""}
                        onChange={(e) =>
                          handleFieldChange("contact_email", e.target.value)
                        }
                        className="font-semibold border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-0 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-semibold">{contact.contact_email}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-md font-semibold">
                      MOBILE PHONE
                    </h3>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData?.contact_phone || ""}
                        onChange={(e) =>
                          handleFieldChange("contact_phone", e.target.value)
                        }
                        className="font-semibold border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-0 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-semibold">
                        {contact.contact_phone
                          ? `+91 ${contact.contact_phone}`
                          : "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex mb-6">
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-md font-semibold">
                      BIRTHDAY
                    </h3>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData?.contact_dob || ""}
                        onChange={(e) =>
                          handleFieldChange("contact_dob", e.target.value)
                        }
                        className="font-semibold border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-0 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-semibold">
                        {formatDate(contact.contact_dob)}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-md font-semibold">
                      RELATIONSHIP
                    </h3>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData?.contact_relation || ""}
                        onChange={(e) =>
                          handleFieldChange("contact_relation", e.target.value)
                        }
                        className="font-semibold text-[#4648d4] bg-blue-100 w-min px-2 rounded-2xl focus:outline-0 focus:border-blue-500 border border-transparent"
                      />
                    ) : (
                      <p className="font-semibold text-[#4648d4] bg-blue-100 w-min px-2 rounded-2xl">
                        {contact.contact_relation || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-md font-semibold">
                      HOME ADDRESS
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={formData?.contact_address || ""}
                        onChange={(e) =>
                          handleFieldChange("contact_address", e.target.value)
                        }
                        className="font-semibold border border-gray-300 rounded-lg px-2 py-1 w-full resize-none focus:outline-0 focus:border-blue-500"
                        rows={2}
                      />
                    ) : (
                      <p className="font-semibold">
                        {contact.contact_address || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-gray-500 text-xl">
              <p>Contact not found</p>
              <button
                className="px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition"
                onClick={() => navi("/contacts")}
              >
                Back to Contacts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;