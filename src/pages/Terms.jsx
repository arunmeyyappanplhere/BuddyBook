import { Link } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h1 className="text-4xl font-semibold mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: August 2026</p>

          <div className="prose prose-lg text-gray-700 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Buddy Book ("the Service"), you accept and agree to be
                bound by the terms and provisions of this agreement. If you do not agree to all
                the terms and conditions, you may not access the Service or use any of its features.
                These Terms of Service constitute a legally binding agreement between you and
                Buddy Book regarding your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
              <p>
                Buddy Book provides a contact management system designed to help you organize
                and manage your professional and personal contacts. You agree to use the Service
                only for lawful purposes and in accordance with these Terms. You are solely
                responsible for your conduct and any data you submit through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials, including your password and any other identifying information.
                You agree to accept responsibility for all activities that occur under your
                account. You must notify us immediately of any unauthorized use of your account
                or any other breach of security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Privacy</h2>
              <p>
                Your contact data is private and secure. We do not sell, trade, or rent your
                personal information to third parties. Your data is only used to provide you
                with the Buddy Book service. Please review our Privacy Policy for more details
                on how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p>
                The Service and all content, trademarks, logos, and other intellectual property
                displayed on the Service are the property of Buddy Book or its licensors.
                You may not use, reproduce, or distribute any content without prior written
                permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your access to the Service immediately, without
                prior notice, for any reason, including without limitation if you breach the
                Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p>
                Buddy Book shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without limitation, loss of data,
                use, goodwill, or other intangible losses, resulting from your access to or use
                of or inability to access or use the Service, even if we have been advised of
                the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of
                India, without regard to its conflict of law provisions. Any dispute arising
                out of or in connection with these Terms shall be subject to the exclusive
                jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms
                at any time. If a revision is material, we will provide at least 30 days'
                notice prior to the new terms taking effect. What constitutes a "material
                change" will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at
                evocodes.co@gmail.com.
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
              to="/privacy"
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-100"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;