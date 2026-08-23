import emailjs from "@emailjs/browser";

/**
 * Send the contact form details via EmailJS.
 *
 * Requires the following environment variables:
 *   VITE_EMAILJS_SERVICE_ID  - EmailJS service ID
 *   VITE_EMAILJS_TEMPLATE_ID - EmailJS template ID
 *   VITE_EMAILJS_PUBLIC_KEY  - EmailJS public key
 *
 * @param {Object} formData - { name, email, phone, subject, message }
 * @returns {Promise} EmailJS send result
 */
export const sendContactEmail = async (formData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.",
    );
  }

  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || "Not provided",
    subject: formData.subject,
    message: formData.message,
    to_email: "evocodes.co@gmail.com",
  };

  return emailjs.send(serviceId, templateId, templateParams, {
    publicKey,
  });
};