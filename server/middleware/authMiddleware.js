import { verifyToken } from "../jwt.js";
import users from "../models/userModal.js";

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from the Authorization header, loads the
 * authenticated user (without password), and attaches it to req.user.
 * Sends 401 when the token is missing or invalid.
 */
export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Session is not Authorized" });
    return;
  }

  const authToken = token.toString().split(" ")[1];

  try {
    const decoded = await verifyToken(authToken);
    const user = await users.findById(decoded.id || decoded.sub).select("-password");

    if (!user) {
      res.status(401).json({ message: "Session is not Authorized" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Session is not Authorized" });
  }
};