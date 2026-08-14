import contactModal from "../models/contactModal.js";
import profileModal from "../models/profileModal.js";

export const addContactController = async (req, res) => {
  // req.user is set by the protect middleware.
  const decodedEmail = req.user.email;
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
