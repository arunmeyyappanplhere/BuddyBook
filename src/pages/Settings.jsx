import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  Trash2,
  LogOut,
  Archive,
  Upload,
  AlertTriangle,
} from "lucide-react";
import Dashboard from "../Components/Dashboard";
import { useAuth } from "../context/useAuth";
import { updateProfile, deleteAccount, stashAllContacts } from "../api/contacts";
import { toast } from "react-toastify";
import defaultImage from "/default_avatar.png";
import axiosInstance from "../api/axios";
import UnstashModal from "../Components/UnstashModal";
import Spinner from "../Components/Spinner";

const Settings = ({ openAddContactModal, setOpenAddContactModal }) => {
  const { user: userProfile, loading: authLoading, error: authError, isAuthenticated, refreshUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phoneNumber: userProfile?.phoneNumber || "",
    DOB: userProfile?.DOB ? String(userProfile.DOB).slice(0, 10) : "",
    address: userProfile?.address || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stashing, setStashing] = useState(false);
  const [openUnstashModal, setOpenUnstashModal] = useState(false);
  const [unstashing, setUnstashing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
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
      await updateProfile(payload);
      await refreshUser();
      setProfileImage(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      await deleteAccount();
      await logout();
      toast.success("Your account has been deleted.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStashAll = async () => {
    if (!window.confirm("Stash all contacts? They will be hidden from your main contact list.")) {
      return;
    }
    setStashing(true);
    try {
      await stashAllContacts(true);
      await refreshUser();
      toast.success("All contacts stashed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to stash contacts.");
    } finally {
      setStashing(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    window.location.href = "/login";
    toast.success("Logged out successfully!");
  };

   return (
     <>
       <div className="min-h-screen">
         <Dashboard
           tabOnView="Settings"
           openAddContactModal={openAddContactModal}
           setOpenAddContactModal={setOpenAddContactModal}
         />
           <div className="p-4 md:p-7 lg:ml-80 pt-16 lg:pt-8 flex flex-col gap-5 min-w-0">
          <div className="w-full lg:w-auto">
            <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences.</p>
          </div>

          {authError && (
            <div className="mt-14 flex flex-col items-center gap-4 rounded-4xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600 text-lg">Failed to load dashboard data.</p>
              <button className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold cursor-pointer hover:bg-red-600 transition" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {!authLoading && !authError && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Profile Details Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <UserRound size={20} className="text-blue-500" />
                  Profile Details
                </h2>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <div className="relative">
                        <img
                          src={profileImage ? URL.createObjectURL(profileImage) : (userProfile?.profileImage || defaultImage)}
                          alt=""
                          className="size-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="absolute -bottom-1 -right-2 bg-blue-500 rounded-full p-1.5 shadow-md">
                          <Upload size={12} color="white" />
                        </span>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="text-sm text-gray-500">
                      Click to upload a new profile image
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Full Name</label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500 bg-gray-100"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="phoneNumber"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        name="DOB"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500"
                        value={formData.DOB}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <textarea
                        name="address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500 resize-none"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex gap-2 items-center justify-center w-full px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 hover:scale-[1.01] transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Spinner size={18} className="text-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes <Save size={18} />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Account Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Archive size={20} className="text-purple-500" />
                    Contact Management
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Stash all your contacts to hide them from your main list. They can be restored later.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleStashAll}
                      disabled={stashing}
                      className="flex-1 flex gap-2 items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-purple-500 rounded-xl hover:bg-purple-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {stashing ? (
                        <>
                          <Spinner size={18} className="text-white" />
                          Stashing...
                        </>
                      ) : (
                        "Stash All Contacts"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setUnstashing(true);
                        setOpenUnstashModal(true);
                      }}
                      disabled={unstashing}
                      className="flex-1 flex gap-2 items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {unstashing ? (
                        <>
                          <Spinner size={18} className="text-white" />
                          Unstashing...
                        </>
                      ) : (
                        "Unstash Contacts"
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <LogOut size={20} className="text-blue-500" />
                    Session
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Sign out of your account on this device.
                  </p>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex gap-2 items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loggingOut ? (
                      <>
                        <Spinner size={18} className="text-white" />
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-red-200">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                    <AlertTriangle size={20} />
                    Danger Zone
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="w-full flex gap-2 items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <Spinner size={18} className="text-white" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <UnstashModal
          open={openUnstashModal}
          onClose={() => setOpenUnstashModal(false)}
          onUnstashSuccess={refreshUser}
        />
      </div>
    </>
  );
};

export default Settings;
