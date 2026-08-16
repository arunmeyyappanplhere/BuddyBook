import mongoose from "mongoose";
import contactModal from "../models/contactModal.js";
import profileModal from "../models/profileModal.js";

const findContactById = async (email, id) => {
  let contact = await contactModal.findOne({ savedUser: email, contact_uid: id });
  if (!contact && mongoose.isValidObjectId(id)) {
    contact = await contactModal.findOne({ savedUser: email, _id: id });
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContactController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
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
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    contact.contact_favorite = Boolean(contact_favorite);
    await contact.save();
    await profileModal.updateOne(
      { email, "contacts.contact_uid": contact.contact_uid },
      { $set: { "contacts.$.contact_favorite": contact.contact_favorite } },
    );
    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
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
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    contact.contact_stashed = Boolean(contact_stashed);
    await contact.save();
    await profileModal.updateOne(
      { email, "contacts.contact_uid": contact.contact_uid },
      { $set: { "contacts.$.contact_stashed": contact.contact_stashed } },
    );
    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const stashAllContactsController = async (req, res) => {
  const email = req.user.email;
  const { contact_stashed } = req.body;
  try {
    const result = await contactModal.updateMany(
      { savedUser: email },
      { $set: { contact_stashed: Boolean(contact_stashed) } },
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
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const unstashContactsController = async (req, res) => {
  const email = req.user.email;
  const { contact_ids } = req.body;
  try {
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
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteContactController = async (req, res) => {
  const email = req.user.email;
  const { id } = req.params;
  try {
    const contact = await findContactById(email, id);
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    await contactModal.deleteOne({ _id: contact._id });
    await profileModal.updateOne(
      { email },
      { $pull: { contacts: { contact_uid: contact.contact_uid } } },
    );
    res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err);
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
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    if (contact_email && contact_email !== contact.contact_email) {
      const existing = await contactModal.findOne({
        savedUser: email,
        contact_email,
        _id: { $ne: contact._id },
      });
      if (existing) {
        res.status(400).json({ message: "Contact profile already exists." });
        return;
      }
    }
    if (contact_name !== undefined) contact.contact_name = contact_name;
    if (contact_role !== undefined) contact.contact_role = contact_role;
    if (contact_relation !== undefined)
      contact.contact_relation = contact_relation;
    if (contact_email !== undefined) contact.contact_email = contact_email;
    if (contact_phone !== undefined) contact.contact_phone = contact_phone;
    if (contact_dob !== undefined) contact.contact_dob = contact_dob;
    if (contact_address !== undefined) contact.contact_address = contact_address;
    if (profileImage !== undefined)
      contact.contact_profileImage = profileImage;
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
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};