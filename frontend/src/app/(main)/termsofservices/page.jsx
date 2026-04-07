"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-indigo-200 text-black py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>

          <p className="text-gray-600">
            <span className="text-gray-800 font-semibold">Last Updated:</span>{" "}
            July 2026 <br />
            <span className="text-gray-800 font-semibold">Product:</span> ExcelIQ —
            AI Excel Assistant
          </p>
        </motion.div>

        <div className="bg-black/5 border border-white/10 rounded-2xl p-10 space-y-10">

          {/* Introduction */}
          <section className="text-gray-800 leading-relaxed">
            These Terms of Service ("Terms") govern your use of ExcelIQ. By
            accessing or using the platform, you agree to these Terms. If you do
            not agree, you must not use the service.
          </section>

          {/* Account */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Accounts</h2>
            <p className="text-gray-800">
              To access certain features, you may be required to create an
              account. You are responsible for maintaining the confidentiality
              of your login credentials and for all activities that occur under
              your account.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-gray-800">
              ExcelIQ provides AI-powered spreadsheet assistance including
              formula generation, automation suggestions, Excel analysis, and
              file processing. AI-generated outputs may contain inaccuracies and
              should be reviewed before use.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>

            <ul className="list-disc list-inside text-gray-800 space-y-2">
              <li>You may not use the service for illegal purposes</li>
              <li>You may not upload malicious or harmful files</li>
              <li>You may not attempt to reverse engineer the platform</li>
              <li>You may not abuse API or automation limits</li>
              <li>You may not resell or redistribute the service</li>
            </ul>
          </section>

          {/* Data */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Data</h2>
            <p className="text-gray-800">
              You retain ownership of your uploaded data. By uploading files,
              you grant ExcelIQ permission to process data for generating AI
              results. We do not sell your data.
            </p>
          </section>

          {/* AI Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. AI Disclaimer</h2>
            <p className="text-gray-800">
              ExcelIQ uses artificial intelligence. AI outputs are generated
              automatically and may not always be accurate. You are responsible
              for reviewing results before making decisions.
            </p>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Subscriptions & Billing</h2>
            <p className="text-gray-800">
              Some features require paid subscription. Pricing may change at any
              time. Subscriptions renew automatically unless cancelled. Refunds
              are only provided where required by law.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="text-gray-800">
              The ExcelIQ platform, UI, branding, and AI system are protected by
              intellectual property laws. You may not copy, reproduce, or
              distribute any part of the service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Account Termination</h2>
            <p className="text-gray-800">
              We may suspend or terminate accounts that violate these Terms,
              misuse AI features, or attempt unauthorized access.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-800">
              ExcelIQ is provided "as is" without warranties. We are not liable
              for data loss, AI inaccuracies, financial losses, or business
              damages.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-800">
              We may update these Terms periodically. Continued use of the
              platform after updates constitutes acceptance of the revised
              Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-gray-800">
              These Terms are governed by applicable laws. Any disputes will be
              resolved in the jurisdiction where ExcelIQ operates.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
            <p className="text-gray-800">
              If you have questions about these Terms, contact:
            </p>

            <p className="text-gray-800 mt-3">
              Email: support@exceliq.com <br />
              Website: ExcelIQ <br />
              Support: /support
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}