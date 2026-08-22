import mongoose from "mongoose";
import contactModal from "../models/contactModal.js";
import profileModal from "../models/profileModal.js";
import { isValidObjectId, isValidUuid } from "../middleware/security.js";

const findContactById = async (email, id) => {
  let contact = null;

  // Prevent NoSQL injection by validating ID format first
  if (!id || typeof id !== "string") {
    return null;
  }

  // Only query if id matches valid ObjectId or UUID format
  if (mongoose.isValidObjectId(id)) {
    contact = await contactModal.findOne({ savedUser: email, _id: id });
  }

  if (!contact && isValidUuid(id)) {
    contact = await contactModal.findOne({ savedUser: email, contact_uid: id });
  }

  return contact;
};

export const getContactsController = async (req, res) => {
  const email = req.user.email;
  try {
    const contacts = await contactModal
      .find({ savedUser: email, contact_stashed: { $ne: true } })
      .sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFavoriteContactsController = async (req, res) => {
  const email = req.user.email;
  try {
    const contacts = await contactModal
      .find({ savedUser: email, contact_favorite: true, contact_stashed: { $ne: true } })
      .sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStashedContactsController = async (req, res) => {
  const email = req.user.email;
  try {
    const contacts = await contactModal
      .find({ savedUser: email, contact_stashed: true })
      .sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get stashed error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecentContactsController = async (req, res) => {
  const email = req.user.email;
  try {
    const contacts = await contactModal
      .find({ savedUser: email, contact_stashed: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get recent error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContactController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error("Get contact error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleFavoriteController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  const { contact_favorite } = req.body;

  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const newFavorite = Boolean(contact_favorite);
    contact.contact_favorite = newFavorite;
    await contact.save();

    await profileModal.updateOne(
      { email, "contacts.contact_uid": contact.contact_uid },
      { $set: { "contacts.$.contact_favorite": newFavorite } },
    );

    res.status(200).json(contact);
  } catch (err) {
    console.error("Toggle favorite error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleStashController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  const { contact_stashed } = req.body;

  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const newStashed = Boolean(contact_stashed);
    contact.contact_stashed = newStashed;
    await contact.save();

    await profileModal.updateOne(
      { email, "contacts.contact_uid": contact.contact_uid },
      { $set: { "contacts.$.contact_stashed": newStashed } },
    );

    res.status(200).json(contact);
  } catch (err) {
    console.error("Toggle stash error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const stashAllContactsController = async (req, res) => {
  const email = req.user.email;
  const { contact_stashed } = req.body;

  try {
    if (typeof contact_stashed !== "boolean") {
      return res.status(400).json({ message: "contact_stashed must be a boolean." });
    }

    const result = await contactModal.updateMany(
      { savedUser: email },
      { $set: { contact_stashed } },
    );

    const contacts = await contactModal.find({ savedUser: email });
    await profileModal.updateOne(
      { email },
      { $set: { contacts: contacts.map((c) => c.toObject()) } },
    );

    res.status(200).json({
      message: `Updated ${result.modifiedCount} contacts`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Stash all error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unstashContactsController = async (req, res) => {
  const email = req.user.email;
  const { contact_ids } = req.body;

  try {
    if (!Array.isArray(contact_ids) || contact_ids.length === 0) {
      return res.status(400).json({ message: "contact_ids must be a non-empty array." });
    }

    // Validate each ID format to prevent injection
    for (const id of contact_ids) {
      if (!isValidObjectId(id) && !isValidUuid(id)) {
        return res.status(400).json({ message: `Invalid contact ID: ${id}` });
      }
    }

    const result = await contactModal.updateMany(
      { savedUser: email, contact_uid: { $in: contact_ids } },
      { $set: { contact_stashed: false } },
    );

    const contacts = await contactModal.find({ savedUser: email });
    await profileModal.updateOne(
      { email },
      { $set: { contacts: contacts.map((c) => c.toObject()) } },
    );

    res.status(200).json({
      message: `Unstashed ${result.modifiedCount} contacts`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Unstash error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteContactController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;

  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contactModal.deleteOne({ _id: contact._id });
    await profileModal.updateOne(
      { email },
      { $pull: { contacts: { contact_uid: contact.contact_uid } } },
    );

    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateContactController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  const {
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
    const contact = await findContactById(email, id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Validate email uniqueness if changed
    if (contact_email && contact_email !== contact.contact_email) {
      const existing = await contactModal.findOne({
        savedUser: email,
        contact_email,
        _id: { $ne: contact._id },
      });
      if (existing) {
        return res.status(400).json({ message: "Contact profile already exists." });
      }
    }

    if (contact_name !== undefined) contact.contact_name = contact_name.trim();
    if (contact_role !== undefined) contact.contact_role = contact_role.trim();
    if (contact_relation !== undefined) contact.contact_relation = contact_relation.trim();
    if (contact_email !== undefined) contact.contact_email = contact_email.trim().toLowerCase();
    if (contact_phone !== undefined) contact.contact_phone = contact_phone;
    if (contact_dob !== undefined) contact.contact_dob = contact_dob;
    if (contact_address !== undefined) contact.contact_address = contact_address.trim();
    if (profileImage !== undefined) contact.contact_profileImage = profileImage;

    await contact.save();

    await profileModal.updateOne(
      { email, "contacts.contact_uid": contact.contact_uid },
      {
        $set: {
          "contacts.$.contact_name": contact.contact_name,
          "contacts.$.contact_role": contact.contact_role,
          "contacts.$.contact_relation": contact.contact_relation,
          "contacts.$.contact_email": contact.contact_email,
          "contacts.$.contact_phone": contact.contact_phone,
          "contacts.$.contact_dob": contact.contact_dob,
          "contacts.$.contact_address": contact.contact_address,
          "contacts.$.contact_profileImage": contact.contact_profileImage,
        },
      },
    );

    res.status(200).json(contact);
  } catch (err) {
    console.error("Update contact error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
