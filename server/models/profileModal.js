import mongoose, { mongo } from "mongoose";

const profileModal = new mongoose.Schema({
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
  },
  favorites: {
    type: Array,
    required: false,
  },
}, {timestamps:true});

export default mongoose.modal("profiles", profileModal)