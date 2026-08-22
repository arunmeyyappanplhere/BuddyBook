import express from "express";
import { registerController } from "../controllers/registerController.js";
import { loginController } from "../controllers/loginController.js";
import { upload, handleMulterError } from "../upload.js";
import { uploadController } from "../controllers/uploadController.js";
import { homeController } from "../controllers/homeController.js";
import { addContactController } from "../controllers/addContactController.js";
import { searchContactsController } from "../controllers/searchContactsController.js";
import {
  getContactsController,
  getFavoriteContactsController,
  getStashedContactsController,
  getRecentContactsController,
  getContactController,
  toggleFavoriteController,
  toggleStashController,
  stashAllContactsController,
  unstashContactsController,
  deleteContactController,
  updateContactController,
} from "../controllers/contactController.js";
import {
  updateProfileController,
  deleteAccountController,
} from "../controllers/settingsController.js";
import { getCurrentUserController } from "../controllers/currentUserController.js";
import { createContactSupport, getContactSupportTickets, updateContactSupportStatus } from "../controllers/contactSupportController.js";
import logoutController from "../controllers/logoutController.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerValidation, loginValidation, contactIdValidation, supportValidation } from "../middleware/security.js";

const routes = express.Router();

// Public auth routes with validation
routes.post("/register", ...registerValidation, registerController);
routes.post("/login", ...loginValidation, loginController);
routes.post("/logout", logoutController);

// Protected auth route — current user
routes.get("/auth/me", protect, getCurrentUserController);

// Protected settings routes
routes.put("/settings/profile", protect, updateProfileController);
routes.delete("/auth/delete-account", protect, deleteAccountController);

// Protected upload route with multer error handling
routes.post("/upload", protect, handleMulterError, upload.single("profileImage"), uploadController);

// Protected home route (returns profile with embedded contacts)
routes.get("/home", protect, homeController);

// Protected contact routes — order matters: static paths before /:id
routes.post("/add-contact", protect, addContactController);
routes.get("/contacts", protect, getContactsController);
routes.get("/contacts/search", protect, searchContactsController);
routes.get("/contacts/favorites", protect, getFavoriteContactsController);
routes.get("/contacts/stashed", protect, getStashedContactsController);
routes.get("/contacts/recent", protect, getRecentContactsController);
routes.get("/contacts/:id", protect, ...contactIdValidation, getContactController);
routes.patch("/contacts/:id/favorite", protect, ...contactIdValidation, toggleFavoriteController);
routes.patch("/contacts/:id/stash", protect, ...contactIdValidation, toggleStashController);
routes.patch("/contacts/stash-all", protect, stashAllContactsController);
routes.patch("/contacts/unstash", protect, unstashContactsController);
routes.delete("/contacts/:id", protect, ...contactIdValidation, deleteContactController);
routes.put("/contacts/:id", protect, ...contactIdValidation, updateContactController);

// Contact support routes
routes.post("/support", ...supportValidation, createContactSupport);
routes.get("/support/tickets", protect, getContactSupportTickets);
routes.patch("/support/tickets/:id/status", protect, updateContactSupportStatus);

export default routes;
