import contactSupportModal from "../models/contactSupportModal.js";

export const createContactSupport = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newSupportTicket = new contactSupportModal({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newSupportTicket.save();

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon.",
      data: newSupportTicket,
    });
  } catch (error) {
    console.error("Contact support error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

export const getContactSupportTickets = async (req, res) => {
  try {
    // Admin-only endpoint - get all tickets with pagination
    const tickets = await contactSupportModal
      .find()
      .sort({ createdAt: -1 });
    
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

    const ticket = await contactSupportModal.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
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