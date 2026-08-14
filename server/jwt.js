import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Use JWT_SECRET with a backwards-compatible fallback to JWT_LOGIN_SECRET.
const jwtSecret = process.env.JWT_SECRET || process.env.JWT_LOGIN_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};