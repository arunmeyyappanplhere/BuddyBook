import contactSupportModal from "../models/contactSupportModal.js";
import { isValidEmail } from "../middleware/security.js";

export const createContactSupport = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Server-side validation
    if (!name || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ success: false, message: "Name must be between 2 and 50 characters." });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    if (!subject || subject.trim().length < 3 || subject.trim().length > 100) {
      return res.status(400).json({ success: false, message: "Subject must be between 3 and 100 characters." });
    }

    if (!message || message.trim().length < 10 || message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Message must be between 10 and 1000 characters." });
    }

    // Basic phone validation if provided
    if (phone && !/^\+?[\d\s-]{7,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Please provide a valid phone number." });
    }

    const newSupportTicket = new contactSupportModal({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
    });

    await newSupportTicket.save();

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon.",
      data: newSupportTicket,
    });
  } catch (error) {
    console.error("Contact support error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

export const getContactSupportTickets = async (req, res) => {
  try {
    const tickets = await contactSupportModal.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Get contact support tickets error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets.",
    });
  }
};

export const updateContactSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const ticket = await contactSupportModal.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Update contact support status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update support ticket status.",
    });
  }
};
