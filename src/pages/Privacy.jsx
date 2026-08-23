import { Link } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-4xl font-semibold mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: August 2026</p>

          <div className="prose prose-lg text-gray-700 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Personal Information:</strong> Your name, email address, phone number, date of birth, and address when you create an account.</li>
                <li><strong>Profile Image:</strong> Your profile picture, which is uploaded and stored securely.</li>
                <li><strong>Contact Data:</strong> Information about your contacts that you choose to store in Buddy Book, including their names, phone numbers, email addresses, roles, relationships, and other details.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with the Service, such as which features you use and how often.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process your requests and communications</li>
                <li>Authenticate your account and keep it secure</li>
                <li>Send you important updates and notifications about the Service</li>
                <li>Respond to your questions and support requests</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. Your passwords are hashed using bcrypt with a salt factor of 10,
                and your session is secured with JWT tokens. Data is stored in a secure MongoDB
                database with access controls in place.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
              <p>
                We may use third-party service providers to help us operate and improve the
                Service. These parties are not authorized to use your personal information for
                any purpose other than providing the services we request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Cloudinary</h2>
              <p>
                Profile images and contact photos may be uploaded to and served via Cloudinary,
                a cloud-based media management platform. Cloudinary processes these images solely
                to provide image hosting and delivery services. We do not store sensitive
                metadata in image files. Cloudinary is contractually obligated to maintain the
                confidentiality and security of any data it processes on our behalf.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Sharing & Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties.
                We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>To service providers who assist us in operating the Service</li>
                <li>In connection with a business transaction (with appropriate safeguards)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as
                needed to provide you with the Service. If you wish to delete your account,
                you may do so at any time by contacting us. Upon account deletion, we will
                remove your personal data from our active records within 30 days, except where
                retention is required for legal or security purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Rectification:</strong> Correct any inaccurate or incomplete personal data.</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data and account.</li>
                <li><strong>Restrict Processing:</strong> Request limitation of processing your data in certain circumstances.</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong>Object:</strong> Object to processing of your data for certain purposes.</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, please contact us at evocodes.co@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than
                your own. We will take all reasonable steps to ensure your data is treated
                securely and in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page and updating the
                "Last updated" date. We encourage you to review this Privacy Policy whenever
                you use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or your personal data,
                please contact us at evocodes.co@gmail.com.
              </p>
            </section>
          </div>

          <div className="mt-10 flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition duration-100"
            >
              Back to Login
            </Link>
            <Link
              to="/terms"
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-100"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;