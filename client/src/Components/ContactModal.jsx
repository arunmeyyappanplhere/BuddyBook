import React from "react";
import { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Eye,
  EyeOff,
  Mail,
  UserRound,
  LockKeyhole,
  BriefcaseBusiness,
  Handshake,
} from "lucide-react";
import default_profile from "/default_avatar.png";
import axios from "axios";
import { toast } from "react-toastify";

const ContactModal = ({ openAddContactModal, setOpenAddContactModal }) => {
  const [profileImage, setProfileImage] = useState("");

  const [fileName, setFileName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("");
  const [relation, setRelation] = useState("");

  const [registerError, setRegisterError] = useState("");

  const uploadImage = async () => {
    if (!profileImage) {
      return "";
    }

    const imageFormData = new FormData();
    imageFormData.append("profileImage", profileImage);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/upload",
      imageFormData,
    );

    return response.data.filename;
  };
  const handleAddContact = async (e) => {
    event.preventDefault();
    console.log("Contact Added!");

    if (!profileImage) {
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

    setFileName(await uploadImage());
    setRegisterError("");

    console.log("filename : ", fileName);
    console.log("username : ", username);
    console.log("email : ", email);
    console.log("phone : ", phone);
    console.log("dob : ", dob);
    console.log("address : ", address);

    try {
      const cookies = document.cookie;
      const getCookie = (str) => {
        return cookies
          .split("; ")
          .find((row) => row.startsWith(`${str}=`))
          ?.split("=")[1];
      };
      const token = getCookie("token");
      const response = await axios
        .post(
          "http://127.0.0.1:8000/api/add-contact",
          {
            contact_uid: crypto.randomUUID(),
            profileImage: fileName,
            contact_name: username,
            contact_email: email,
            contact_phone: parseInt(phone, 10),
            contact_dob: dob,
            contact_address: address,
            contact_role: role,
            contact_relation: relation,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Contact added successfully!");
          setOpenAddContactModal(false);
        });
    } catch (error) {
      console.error(error);
      error.status == 400
        ? toast.error("Contact already added.")
        : toast.error("Error is signing up.");
    }
  };
  return (
    openAddContactModal && (
      <div
        className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-99 bg-[#000000b0] transition duration-300"
        onClick={() => setOpenAddContactModal(false)}
      >
        <div
          className="flex flex-col justify-center max-w-2/8 max-h-3/4 rounded-xl shadow-2xl bg-white px-6 py-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Add New Contact</h1>
              <h2 className="text-xl text-gray-600">
                Enter the details of your new connection.
              </h2>
            </div>
            <X
              className=" text-gray-600 cursor-pointer hover:text-black transition duration-300"
              onClick={() => {
                setOpenAddContactModal(false);
              }}
            />
          </div>
          <div className="mt-10 flex justify-center">
            <form onSubmit={handleAddContact} className="">
              <div className="flex gap-2.5">
                <label
                  htmlFor="profileImage"
                  className="text-gray-600 text-sm cursor-pointer flex justify-center w-max"
                >
                  <div>
                    <h2 className="text-center">Profile</h2>
                    <img
                      src={
                        profileImage
                          ? URL.createObjectURL(profileImage)
                          : default_profile
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
                    required
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-gray-600 text-sm ">
                    Name
                  </label>
                  <div className="text-gray-600 text-md border min-w-80 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <UserRound className="text-gray-600" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                      placeholder={"Your name"}
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <label htmlFor="" className="text-gray-600 text-sm">
                Email Address
              </label>
              <div className="text-gray-600 text-md border min-w-100 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                <Mail className="text-gray-600" />
                <input
                  type="text"
                  className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full"
                  placeholder={"name@company.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-10">
                <div>
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Role
                  </label>
                  <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <BriefcaseBusiness className="text-gray-600" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"Software Developer || Google"}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Relation
                  </label>
                  <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Handshake className="text-gray-600" />
                    <input
                      type="text"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"Friend"}
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Phone Number
                  </label>
                  <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Phone className="text-gray-600" />
                    <input
                      type="number"
                      className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={"12345 12345"}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="text-gray-600 text-sm">
                    Date Of Birth
                  </label>
                  <div className="text-gray-600 text-md border min-w-45 border-gray-300 w-min flex items-center bg-white px-2 p-1 rounded-md mb-4">
                    <Calendar className="text-gray-600" />
                    <input
                      type="date"
                      className="block min-h-9 focus:outline-0 pl-4 mr-0 placeholder:text-gray-300 w-full [&::-webkit-calendar-picker-indicator]:hidden"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="" className="text-gray-600 text-sm">
                  Address
                </label>
                <div className="text-gray-600 text-md flex items-start border min-w-100 border-gray-300 w-min bg-white px-2 p-1 rounded-md mb-4">
                  <MapPin className="text-gray-600" />
                  <textarea
                    className="block min-h-9 focus:outline-0 pl-4 placeholder:text-gray-300 w-full resize-none"
                    placeholder={"Door no, Street, City, Pincode."}
                    rows={4}
                    value={address}
                    onChange={(e) => setAdress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <button
                  type="submit"
                  className="min-w-30 flex gap-2 items-center justify-center text-black text-md cursor-pointer bg-gray-300 rounded-md min-h-9 p-2.5 hover:bg-gray-400 hover:scale-[1.01]  transition ease-in-out duration-100"
                  onClick={() => {
                    setOpenAddContactModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-w-30 flex gap-2 items-center justify-center text-white text-md cursor-pointer bg-blue-500  rounded-md min-h-9 p-2.5 hover:bg-blue-800 hover:scale-[1.01]  transition ease-in-out duration-100"
                  onClick={handleAddContact}
                >
                  Save Contact
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
