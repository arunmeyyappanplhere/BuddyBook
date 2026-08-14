import mongoose from "mongoose";
import contactModal from "./contactModal.js";

const profileModal = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    contacts: {
      type: [contactModal.schema],
      required: false,
      default: [],
    },
    favorites: {
      type: [contactModal.schema],
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("profiles", profileModal);
