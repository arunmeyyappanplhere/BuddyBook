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

  // Pre-fill form when editing a contact
  useEffect(() => {
    if (editingContact) {
      setUserName(editingContact.contact_name || "");
      setEmail(editingContact.contact_email || "");
      setPhone(editingContact.contact_phone ? String(editingContact.contact_phone) : "");
      setAdress(editingContact.contact_address || "");
      setDob(editingContact.contact_dob
        ? String(editingContact.contact_dob).slice(0, 10)
        : "");
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
    if (!profileImage) {
      return "";
    }

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

    if (phone.length != 10) {
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
        // Update existing contact
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
        // Add new contact
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

      // Refresh user profile so Dashboard/Contacts reflect the change
      await refreshUser();

      setOpenAddContactModal(false);
      setEditingContact(null);
      resetForm();
    } catch (error) {
      console.error(error);
      if (error.response?.status == 400) {
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
        className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-99 bg-[#000000b0] transition duration-300 p-4"
        onClick={handleClose}
      >
        <div
          className="flex flex-col justify-center w-full max-w-lg max-h-[90vh] rounded-xl shadow-2xl bg-white px-4 md:px-6 py-6 md:py-10 overflow-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {isEditing ? "Edit Contact" : "Add New Contact"}
              </h1>
              <h2 className="text-lg md:text-xl text-gray-600">
                {isEditing
                  ? "Update the details of your connection."
                  : "Enter the details of your new connection."}
              </h2>
            </div>
            <X
              className="text-gray-600 cursor-pointer hover:text-black transition duration-300 shrink-0"
              onClick={handleClose}
            />
          </div>
          <div className="mt-6 md:mt-10 flex justify-center">
            <form onSubmit={handleAddContact} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2.5">
                <label
                  htmlFor="profileImage"
                  className="text-gray-600 text-sm cursor-pointer flex justify-center w-full sm:w-max"
                >
                  <div>
                    <h2 className="text-center">Profile</h2>
                    <img
                      src={
                        profileImage
                          ? URL.createObjectURL(profileImage)
                          : editingContact?.contact_profileImage || default_profile
                      }
                      alt=""
                      className="size-15 rounded-full mx-auto border border-dashed"
                    />
                  </div>
                </label>
                <div className="text-gray-600 text-md w-min flex items-center bg-white mb-4">
                  <input
                    type="file"
                    id="profileImage"
                    className="hidden"
                    onChange={(e) => {
                      setProfileImage(e.target.files[0]);
                    }}
                    accept="image/*"
                    disabled={submitting}
                  />
                </div>
                <div className="flex-1 w-full">
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Name
                  </label>
                  <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <UserRound className="text-gray-600 shrink-0" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                      placeholder={"Your name"}
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <label htmlFor="" className="text-gray-600 text-sm">
                Email Address
              </label>
              <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Mail className="text-gray-600 shrink-0" />
                <input
                  type="text"
                  className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                  placeholder={"name@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                <div className="flex-1">
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Role
                  </label>
                  <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <BriefcaseBusiness className="text-gray-600 shrink-0" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"Software Developer || Google"}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Relation
                  </label>
                  <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Handshake className="text-gray-600 shrink-0" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"Friend"}
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                <div className="flex-1">
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Phone Number
                  </label>
                  <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Phone className="text-gray-600 shrink-0" />
                    <input
                      type="number"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"12345 12345"}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Date Of Birth
                  </label>
                  <div className="text-gray-600 text-md border w-full border-gray-300 flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Calendar className="text-gray-600 shrink-0" />
                    <input
                      type="date"
                      className="block min-h-9 focus:outline-0 pl-4 mr-0 placeholder:text-gray-300 w-full [&::-webkit-calendar-picker-indicator]:hidden"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                      }}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-gray-600 text-sm">
                  Address
                </label>
                <div className="text-gray-600 text-md flex items-start border w-full border-gray-300 bg-white px-2 p-1 rounded-md mb-4">
                  <MapPin className="text-gray-600 shrink-0" />
                  <textarea
                    className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full resize-none"
                    placeholder={"Door no, Street, City, Pincode."}
                    rows={4}
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <button
                  type="button"
                  className="min-w-30 flex gap-2 items-center justify-center text-black text-md cursor-pointer bg-gray-300 rounded-md min-h-9 p-2.5 hover:bg-gray-400 hover:scale-[1.01] transition ease-in-out duration-100"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-w-30 flex gap-2 items-center justify-center text-white text-md cursor-pointer bg-blue-500 rounded-md min-h-9 p-2.5 hover:bg-blue-800 hover:scale-[1.01] transition ease-in-out duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    isEditing ? "Update Contact" : "Save Contact"
                  )}
                </button>
              </div>
              {registerError && (
                <h3 className="mt-3 text-md text-red-600 max-w-100 text-center">
                  {registerError}
                </h3>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default ContactModal;