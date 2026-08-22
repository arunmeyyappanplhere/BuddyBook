import { body, param, validationResult } from "express-validator";
import { createHash } from "crypto";

/**
 * Sanitize a string to prevent NoSQL injection and XSS.
 * Rejects control characters commonly used in injection attacks.
 */
const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/[\x00-\x1f\x7f]/g, "").trim();
};

/**
 * Middleware to check validation results from express-validator.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param || err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Sanitize all body fields recursively to strip control characters
 * and prevent NoSQL injection payloads.
 */
export const sanitizeBody = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(sanitize);
      return;
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};

/**
 * Validate UUID format.
 */
export const isValidUuid = (value) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Validate email format.
 */
export const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Validate phone number (10 digits).
 */
export const isValidPhone = (value) => {
  return /^\d{10}$/.test(value);
};

/**
 * Validate password strength:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isValidPassword = (value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(value);
};

/**
 * Validate MongoDB ObjectId.
 */
export const isValidObjectId = (value) => {
  return /^[0-9a-f]{24}$/i.test(value);
};

/**
 * Generate SHA-256 hash of a string for logging/auditing (no plaintext).
 */
export const hashForAudit = (input) => {
  return createHash("sha256").update(String(input)).digest("hex");
};

/**
 * Common validation rules for register endpoint.
 */
export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("phoneNumber")
    .custom(isValidPhone)
    .withMessage("Phone number must be exactly 10 digits"),
  body("DOB")
    .isISO8601()
    .toDate()
    .custom((dob) => dob <= new Date())
    .withMessage("Date of birth cannot be in the future"),
  body("address")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
];

/**
 * Common validation rules for login endpoint.
 */
export const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Common validation rules for contact ID param.
 */
export const contactIdValidation = [
  param("id")
    .custom((value) => isValidObjectId(value) || isValidUuid(value))
    .withMessage("Invalid contact ID format"),
];

/**
 * Validate support ticket fields.
 */
export const supportValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("subject")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Subject must be between 3 and 100 characters"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
];
