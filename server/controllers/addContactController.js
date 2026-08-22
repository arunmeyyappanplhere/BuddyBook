import contactModal from "../models/contactModal.js";
import profileModal from "../models/profileModal.js";
import { isValidPhone } from "../middleware/security.js";
import crypto from "crypto";

export const addContactController = async (req, res) => {
  const decodedEmail = req.user.email;

  const {
    contact_uid,
    contact_name,
    contact_role,
    contact_relation,
    contact_email,
    contact_phone,
    contact_dob,
    contact_address,
    profileImage,
  } = req.body;

  try {
    // Server-side validation
    if (!contact_name || contact_name.trim().length < 2) {
      return res.status(400).json({ message: "Contact name must be at least 2 characters." });
    }

    if (!contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!contact_phone || !isValidPhone(String(contact_phone))) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." });
    }

    if (!contact_dob || new Date(contact_dob) > new Date()) {
      return res.status(400).json({ message: "Date of birth cannot be in the future." });
    }

    if (!contact_address || contact_address.trim().length < 5) {
      return res.status(400).json({ message: "Address must be at least 5 characters." });
    }

    const ContactDetails = await contactModal.findOne({
      savedUser: decodedEmail,
      contact_email,
    });

    if (ContactDetails) {
      return res.status(400).json({ message: "Contact profile already exists." });
    }

    const userProfile = await profileModal.findOne({
      email: decodedEmail,
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const newContact = new contactModal({
      contact_uid: contact_uid || crypto.randomUUID(),
      savedUser: decodedEmail,
      contact_profileImage: profileImage || "",
      contact_name: contact_name.trim(),
      contact_role: contact_role?.trim() || "",
      contact_email: contact_email.trim().toLowerCase(),
      contact_phone: parseInt(contact_phone, 10),
      contact_dob,
      contact_relation: contact_relation?.trim() || "",
      contact_address: contact_address.trim(),
    });

    await newContact.save();

    await profileModal.updateOne(
      { email: decodedEmail },
      {
        $addToSet: {
          contacts: newContact,
        },
      },
    );

    res.status(201).json({ message: `${contact_email}, added to contacts` });
  } catch (err) {
    console.error("Add contact error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
