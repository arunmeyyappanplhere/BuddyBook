import { verifyToken } from "../jwt.js";
import users from "../models/userModal.js";
import { hashForAudit } from "../middleware/security.js";

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from the Authorization header, loads the
 * authenticated user (without password), and attaches it to req.user.
 * Sends 401 when the token is missing or invalid.
 */
export const protect = async (req, res, next) => {
  let token;
  let source = "";

  // 1. Try Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    source = "header";
  }

  // 2. Fallback to httpOnly cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
    source = "cookie";
  }

  if (!token) {
    return res.status(401).json({ message: "Session is not Authorized" });
  }

  try {
    const decoded = verifyToken(token);
    const user = await users.findById(decoded.id || decoded.sub).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Session is not Authorized" });
    }

    // Audit log for sensitive actions (hashed, no plaintext)
    console.log(
      `[AUTH] User ${hashForAudit(user.email)} accessed via ${source} at ${new Date().toISOString()}`,
    );

    req.user = user;
    req.authSource = source;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session is not Authorized" });
  }
};
