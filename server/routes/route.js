import express from "express";
import { registerController } from "../controllers/registerController.js";
import { loginController } from "../controllers/loginController.js";
import { upload } from "../upload.js";
import { uploadController } from "../controllers/uploadController.js";
import { homeController } from "../controllers/homeController.js";
import { addContactController } from "../controllers/addContactController.js";
import { searchContactsController } from "../controllers/searchContactsController.js";
import {
  getContactsController,
  getFavoriteContactsController,
  getContactController,
  toggleFavoriteController,
  deleteContactController,
  updateContactController,
} from "../controllers/contactController.js";
import { getCurrentUserController } from "../controllers/currentUserController.js";
import { createContactSupport, getContactSupportTickets, updateContactSupportStatus } from "../controllers/contactSupportController.js";
import logoutController from "../controllers/logoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const routes = express.Router();

// Public auth routes.
routes.post("/register", registerController);
routes.post("/login", loginController);
routes.post("/logout", logoutController);

// Protected auth route — current user.
routes.get("/auth/me", protect, getCurrentUserController);

// Protected upload route.
routes.post("/upload", protect, upload.single("profileImage"), uploadController);

// Protected home route (returns profile with embedded contacts).
routes.get("/home", protect, homeController);

// Protected contact routes — order matters: static paths before /:id.
routes.post("/add-contact", protect, addContactController);
routes.get("/contacts", protect, getContactsController);
routes.get("/contacts/search", protect, searchContactsController);
routes.get("/contacts/favorites", protect, getFavoriteContactsController);
routes.get("/contacts/:id", protect, getContactController);
routes.patch("/contacts/:id/favorite", protect, toggleFavoriteController);
routes.delete("/contacts/:id", protect, deleteContactController);
routes.put("/contacts/:id", protect, updateContactController);

// Contact support routes.
routes.post("/support", protect, createContactSupport);
routes.get("/support/tickets", protect, getContactSupportTickets);
routes.patch("/support/tickets/:id/status", protect, updateContactSupportStatus);

export default routes;