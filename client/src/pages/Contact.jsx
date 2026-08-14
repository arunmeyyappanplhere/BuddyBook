import { useState } from "react";
import { Link } from "react-router";
import BuddyBookLogo from "/BuddyBookLogo.png";
import { Mail, MessageSquare, Send, ArrowLeft, Phone, User } from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <img src={BuddyBookLogo} alt="" className="rounded-md size-12" />
          <h1 className="text-blue-500 text-3xl font-bold">Buddy Book</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h1 className="text-4xl font-semibold mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a question or feedback? We'd love to hear from you. Fill out
            the form below and we'll get back to you within 24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="text-blue-500" size={20} />
                  <h3 className="font-semibold">Email Support</h3>
                </div>
                <p className="text-gray-600">support@buddybook.app</p>
                <p className="text-sm text-gray-500 mt-1">
                  We typically respond within 24 hours.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="text-blue-500" size={20} />
                  <h3 className="font-semibold">Phone</h3>
                </div>
                <p className="text-gray-600">+91 (80) 1234-5678</p>
                <p className="text-sm text-gray-500 mt-1">
                  Mon-Fri, 9:00 AM - 6:00 PM IST
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="text-blue-500" size={20} />
                  <h3 className="font-semibold">Response Time</h3>
                </div>
                <p className="text-gray-600">
                  We typically respond within 24 hours on business days.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    className={`w-full border rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500 ${
                      errors.name ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-gray-600 text-sm block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    className={`w-full border rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500 ${
                      errors.email ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-gray-600 text-sm block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    className={`w-full border rounded-lg px-4 py-2.5 pl-10 focus:outline-0 focus:border-blue-500 ${
                      errors.phone ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="12345 12345"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-gray-600 text-sm block mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-0 focus:border-blue-500 ${
                    errors.subject ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="text-gray-600 text-sm block mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-0 focus:border-blue-500 resize-none ${
                    errors.message ? "border-red-400" : "border-gray-300"
                  }`}
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-2 items-center justify-center w-full px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-400 hover:scale-[1.01] transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-10">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-100"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;