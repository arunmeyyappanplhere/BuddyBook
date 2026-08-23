import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Contact, Edit, X, Check } from "lucide-react";
import defaultImage from "/default_avatar.png";
import Dashboard from "../Components/Dashboard";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import Spinner from "../Components/Spinner";

const ContactProfile = ({ contactId, openAddContactModal, setOpenAddContactModal }) => {
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
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [backing, setBacking] = useState(false);

  // Fetch contact data from API when component mounts
  const loadContact = useCallback(async () => {
    if (authLoading) return;
    if (authError) {
      setLoadError("Authentication error. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(`/contacts/${id}`);
      setContact(response.data);
      setFormData({
        contact_name: response.data.contact_name,
        contact_role: response.data.contact_role,
        contact_relation: response.data.contact_relation,
        contact_email: response.data.contact_email,
        contact_phone: response.data.contact_phone,
        contact_dob: response.data.contact_dob
          ? String(response.data.contact_dob).slice(0, 10)
          : "",
        contact_address: response.data.contact_address || "",
      });
      setLoadError(null);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch contact:", err);
      setLoadError("Failed to load contact details.");
      setLoading(false);
    }
  }, [id, authLoading, authError]);

  useEffect(() => {
    setLoading(true);
    loadContact();
  }, [loadContact]);

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

  const uploadImage = async () => {
    if (!profileImage) return "";
    const imageFormData = new FormData();
    imageFormData.append("profileImage", profileImage);
    const response = await axiosInstance.post("/upload", imageFormData);
    return response.data.filename;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let uploadedFileName = "";
      if (profileImage) {
        uploadedFileName = await uploadImage();
      }
      const payload = { ...formData };
      if (uploadedFileName) payload.profileImage = uploadedFileName;
      const response = await axiosInstance.put(`/contacts/${id}`, payload);
      setContact(response.data);
      setProfileImage(null);
      toast.success("Contact updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update contact:", err);
      toast.error("Failed to update contact.");
    } finally {
      setSaving(false);
    }
  };

  // contact_profileImage already contains the full Cloudinary secure_url
  const contactImage = contact?.contact_profileImage || defaultImage;

   return (
     <div className="min-h-screen">
       <Dashboard
         tabOnView={"Contacts"}
         openAddContactModal={openAddContactModal}
         setOpenAddContactModal={setOpenAddContactModal}
       />
        <div className="flex flex-col items-center lg:ml-80 min-w-0">
        <div className="text-center flex items-center justify-between p-5 shadow-sm rounded-b-sm w-full">
          <div className="flex items-center gap-5">
            <ArrowLeft
              size={32}
              className="text-black font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setBacking(true);
                navi("/contacts");
              }}
            />
            <h1 className="text-2xl md:text-4xl font-bold">Contact Profile</h1>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-right hidden sm:block">
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
                  ? userProfile.profileImage
                  : defaultImage
              }
              className="size-12 md:size-15 rounded-full"
              alt=""
            />
          </div>
        </div>

        {authError && !loading && (
          <div className="w-full max-w-4xl flex flex-col justify-center items-center h-full my-10 px-4">
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

        <div className="w-full max-w-4xl flex flex-col justify-center items-center h-full my-10 px-4">
          {loading ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="size-45 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-8 w-52 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-5 w-32 bg-gray-100 rounded-xl animate-pulse" />
              <div className="w-full rounded-xl shadow-2xl min-h-100 mt-7 p-8 bg-gray-50 animate-pulse" />
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
              {isEditing ? (
                <label htmlFor="contactProfileImage" className="w-45 cursor-pointer mb-8 relative inline-block">
                  <img
                    src={profileImage ? URL.createObjectURL(profileImage) : contactImage}
                    alt=""
                    className="w-45 rounded-full border border-white shadow-md object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full text-white text-sm font-medium">
                    Change Photo
                  </span>
                  <input
                    type="file"
                    id="contactProfileImage"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                  />
                </label>
              ) : (
                <img
                  src={contactImage}
                  alt=""
                  className="w-45 cursor-pointer mb-8 rounded-full border border-white shadow-md"
                />
              )}
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-center">
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
              <h2 className="text-lg md:text-xl text-[#4648d4] font-medium uppercase font-mono text-center">
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
              <div className="w-full rounded-xl shadow-2xl min-h-100 mt-7 p-4 md:p-8">
                <div className="flex justify-between items-center mb-8 md:mb-15">
                  <div className="flex gap-4 items-center">
                    <Contact size={32} className="text-[#4648d4]" />
                    <h1 className="text-xl md:text-3xl font-semibold">
                      Contact Profile
                    </h1>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                       <X
                         size={32}
                         className={
                           "right-0 cursor-pointer p-1 rounded-md hover:text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed" +
                           (saving ? " opacity-50 pointer-events-none" : "")
                         }
                         onClick={() => {
                           setIsEditing(false);
                           setProfileImage(null);
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
                       {saving ? (
                         <Spinner size={28} className="text-green-700" />
                       ) : (
                         <Check
                           size={32}
                           className={
                             "right-0 cursor-pointer p-1 rounded-md hover:text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed" +
                             (saving ? " opacity-50 pointer-events-none" : "")
                           }
                           onClick={handleSave}
                         />
                       )}
                    </div>
                  ) : (
                     <Edit
                       size={32}
                       className="right-0 cursor-pointer p-1 rounded-md w-min hover:text-[#4648d4] hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                       onClick={() => setIsEditing(true)}
                     />
                  )}
                </div>
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:mb-6">
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
                      <p className="font-semibold break-all">
                        {contact.contact_email}
                      </p>
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
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 md:mb-6">
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
                        className="font-semibold text-[#4648d4] bg-blue-100 w-full md:w-min px-2 rounded-2xl focus:outline-0 focus:border-blue-500 border border-transparent"
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
                 className="px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 onClick={() => {
                   setBacking(true);
                   navi("/contacts");
                 }}
                 disabled={backing}
               >
                 {backing ? (
                   <>
                     <Spinner size={18} className="text-white" />
                     Loading...
                   </>
                 ) : (
                   "Back to Contacts"
                 )}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;