import userModal from "../models/userModal.js";
import profileModal from "../models/profileModal.js";
import { verifyToken } from "../jwt.js";

export const homeController = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log("Token not found / not Authorized");
    res.status(401).json({ message: "Session is not Authorized" });
    return;
  }
  const authToken = token.toString().split(" ")[1];
  const decodedEmail = await verifyToken(authToken).email;
  console.log("decoded : ", decodedEmail);
  try {
    const userProfileDetails = await profileModal.findOne({
      email: decodedEmail,
    });
    if (userProfileDetails) {
      res.status(200).json(userProfileDetails);
    } else {
      res.status(400).json({ message: "User profile not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
