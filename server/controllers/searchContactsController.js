import contactModal from "../models/contactModal.js";

/**
 * GET /api/contacts/search?query=...&relation=...&favorite=true
 *
 * Searches contacts server-side using query parameters so large address
 * books are filtered in the database rather than loaded into the frontend.
 *
 * Auth: Bearer JWT (protect middleware)
 * Response: 200 → filtered contact array
 */
export const searchContactsController = async (req, res) => {
  // req.user is set by the protect middleware.
  const decodedEmail = req.user.email;
  console.log("decoded : ", decodedEmail);

  const { query = "", relation = "", favorite = "" } = req.query;

  try {
    const filter = { savedUser: decodedEmail };

    // Text search across name, phone, email, role, relation.
    if (query.trim()) {
      const pattern = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(pattern, "i");
      filter.$or = [
        { contact_name: regex },
        { contact_phone: regex },
        { contact_email: regex },
        { contact_role: regex },
        { contact_relation: regex },
      ];
    }

    // Relation filter.
    if (relation) {
      filter.contact_relation = relation;
    }

    // Favorite filter.
    if (favorite === "true") {
      filter.contact_favorite = true;
    }

    const contacts = await contactModal.find(filter).sort({ createdAt: -1 });

    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};