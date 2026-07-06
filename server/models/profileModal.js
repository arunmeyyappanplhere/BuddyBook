import mongoose from "mongoose";

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
      type: Array,
      required: false,
      default: [],
    },
    favorites: {
      type: Array,
      required: false,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("profiles", profileModal);
