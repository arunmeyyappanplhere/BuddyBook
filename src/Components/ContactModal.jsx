import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Mail,
  UserRound,
  BriefcaseBusiness,
  Handshake,
  Loader2,
} from "lucide-react";
import default_profile from "/default_avatar.png";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const ContactModal = ({
  openAddContactModal,
  setOpenAddContactModal,
  editingContact,
  setEditingContact,
}) => {
  const { refreshUser } = useAuth();
  const [profileImage, setProfileImage] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("");
  const [relation, setRelation] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(editingContact);

  useEffect(() => {
    if (editingContact) {
      setUserName(editingContact.contact_name || "");
      setEmail(editingContact.contact_email || "");
      setPhone(editingContact.contact_phone ? String(editingContact.contact_phone) : "");
      setAdress(editingContact.contact_address || "");
      setDob(editingContact.contact_dob ? String(editingContact.contact_dob).slice(0, 10) : "");
      setRole(editingContact.contact_role || "");
      setRelation(editingContact.contact_relation || "");
      setProfileImage("");
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingContact]);

  const generateContactUid = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return "";
    const imageFormData = new FormData();
    imageFormData.append("profileImage", profileImage);
    const response = await axiosInstance.post("/upload", imageFormData);
    return response.data.filename;
  };

  const resetForm = () => {
    setProfileImage("");
    setUserName("");
    setEmail("");
    setPhone("");
    setAdress("");
    setDob("");
    setRole("");
    setRelation("");
    setRegisterError("");
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (!profileImage && !isEditing) {
      setRegisterError("Please upload profile image.");
      return;
    }

    if (username.length < 2) {
      setRegisterError("Username must be atleast 2 characters.");
      return;
    }

    if (phone.length !== 10) {
      setRegisterError("Phone Number must be 10 digits.");
      return;
    }

    if (new Date(dob) > new Date()) {
      setRegisterError("Date of Birth cannot be in future.");
      return;
    }

    setSubmitting(true);

    try {
      let uploadedFileName = "";
      if (profileImage) {
        uploadedFileName = await uploadImage();
      }

      if (isEditing) {
        const contactId = editingContact.contact_uid || editingContact._id;
        await axiosInstance.put(`/contacts/${contactId}`, {
          contact_name: username,
          contact_email: email,
          contact_phone: parseInt(phone, 10),
          contact_dob: dob,
          contact_address: address,
          contact_role: role,
          contact_relation: relation,
          ...(uploadedFileName ? { profileImage: uploadedFileName } : {}),
        });
        toast.success("Contact updated successfully!");
      } else {
        await axiosInstance.post("/add-contact", {
          contact_uid: generateContactUid(),
          profileImage: uploadedFileName,
          contact_name: username,
          contact_email: email,
          contact_phone: parseInt(phone, 10),
          contact_dob: dob,
          contact_address: address,
          contact_role: role,
          contact_relation: relation,
        });
        toast.success("Contact added successfully!");
      }

      await refreshUser();
      setOpenAddContactModal(false);
      setEditingContact(null);
      resetForm();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        setRegisterError("Contact already added.");
        toast.error("Contact already added.");
      } else {
        setRegisterError("Error saving contact. Please try again.");
        toast.error("Error saving contact.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setOpenAddContactModal(false);
    setEditingContact(null);
    resetForm();
  };

  return (
    openAddContactModal && (
      <div
        className="flex fixed inset-0 w-full h-full items-end sm:items-center justify-center z-[100] bg-black/60 transition duration-300 p-0 sm:p-4"
        onClick={handleClose}
      >
        <div
          className="w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-xl shadow-2xl bg-white flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-100 shrink-0">
            <div className="min-w-0 pr-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 truncate">
                {isEditing ? "Edit Contact" : "Add New Contact"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                {isEditing
                  ? "Update the details of your connection."
                  : "Enter the details of your new connection."}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="shrink-0 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
              aria-label="Close"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <form onSubmit={handleAddContact} className="space-y-3 sm:space-y-4">
              {/* Profile image + Name */}
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 items-start">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer flex flex-col items-center gap-1 shrink-0 mx-auto xs:mx-0"
                >
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : editingContact?.contact_profileImage || default_profile
                    }
                    alt="Profile"
                    className="size-16 sm:size-20 rounded-full object-cover border-2 border-dashed border-gray-300"
                  />
                  <span className="text-[10px] sm:text-xs text-blue-500 font-medium">
                    {isEditing ? "Change" : "Upload"}
                  </span>
                </label>
                <div className="flex-1 w-full">
                  <label htmlFor="name" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                    Name
                  </label>
                  <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                    <UserRound className="text-gray-400 shrink-0 size-4 sm:size-5" />
                    <input
                      id="name"
                      type="text"
                      className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base"
                      placeholder="Your name"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <input
                type="file"
                id="profileImage"
                className="hidden"
                onChange={(e) => setProfileImage(e.target.files[0])}
                accept="image/*"
                disabled={submitting}
              />

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                  <Mail className="text-gray-400 shrink-0 size-4 sm:size-5" />
                  <input
                    id="email"
                    type="text"
                    className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Role + Relation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="role" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                    Role
                  </label>
                  <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                    <BriefcaseBusiness className="text-gray-400 shrink-0 size-4 sm:size-5" />
                    <input
                      id="role"
                      type="text"
                      className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base"
                      placeholder="Software Developer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="relation" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                    Relation
                  </label>
                  <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                    <Handshake className="text-gray-400 shrink-0 size-4 sm:size-5" />
                    <input
                      id="relation"
                      type="text"
                      className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base"
                      placeholder="Friend"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Phone + DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="phone" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                    <Phone className="text-gray-400 shrink-0 size-4 sm:size-5" />
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="dob" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                    Date of Birth
                  </label>
                  <div className="flex items-center border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                    <Calendar className="text-gray-400 shrink-0 size-4 sm:size-5" />
                    <input
                      id="dob"
                      type="date"
                      className="w-full min-h-0 focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base [&::-webkit-calendar-picker-indicator]:hidden"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="text-xs sm:text-sm text-gray-600 mb-1 block">
                  Address
                </label>
                <div className="flex items-start border border-gray-300 bg-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg">
                  <MapPin className="text-gray-400 shrink-0 size-4 sm:size-5 mt-0.5" />
                  <textarea
                    id="address"
                    className="w-full min-h-[60px] sm:min-h-[80px] focus:outline-0 pl-2 sm:pl-3 placeholder:text-gray-300 text-sm sm:text-base resize-none"
                    placeholder="Door no, Street, City, Pincode."
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 text-sm sm:text-base font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    "Update Contact"
                  ) : (
                    "Save Contact"
                  )}
                </button>
              </div>

              {registerError && (
                <p className="text-xs sm:text-sm text-red-600 text-center font-medium">
                  {registerError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default ContactModal;
