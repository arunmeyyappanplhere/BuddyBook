import dotenv from "dotenv";
import { verifyToken } from "../jwt.js";
import contactModal from "../models/contactModal.js";
import profileModal from "../models/profileModal.js";

export const addContactController = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log("Token not found / not Authorized");
    res.status(401).json({ message: "Session is not Authorized" });
    return;
  }

  const authToken = token.toString().split(" ")[1];
  const decodedEmail = await verifyToken(authToken).email;
  console.log("decoded : ", decodedEmail);

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
    const ContactDetails = await contactModal.findOne({
      savedUser: decodedEmail,
      contact_email: contact_email,
    });

    const userProfile = await profileModal.findOne({
      email: decodedEmail,
    });

    console.log(userProfile);

    if (!ContactDetails) {
      const newContact = new contactModal({
        contact_uid,
        savedUser: decodedEmail,
        contact_profileImage: profileImage,
        contact_name,
        contact_role,
        contact_email,
        contact_phone,
        contact_dob,
        contact_relation,
        contact_address,
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
    } else {
      res.status(400).json({ message: "Contact profile already exists." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
