"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#020617] to-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">
            Terms of Service
          </h1>

          <p className="text-gray-400">
            <span className="font-semibold text-white">Effective Date:</span> [Add Date] <br />
            <span className="font-semibold text-white">Website:</span> ExcelIQ
          </p>
        </motion.div>

        {/* Intro */}
        <section className="mb-8 text-gray-300 leading-relaxed">
          Welcome to ExcelIQ. By accessing or using our AI-powered Excel
          assistant, you agree to be bound by these Terms of Service. If you do
          not agree, please do not use the platform.
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
          <p className="text-gray-300">
            You must be at least 13 years old to use ExcelIQ. By using the
            platform, you confirm that you are legally allowed to enter into
            this agreement.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Nature of Service</h2>
          <p className="text-gray-300">
            ExcelIQ provides AI-powered Excel assistance including formula
            generation, spreadsheet analysis, automation suggestions, and file
            processing. Results are generated using AI and may not always be
            perfect.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. AI Generated Content</h2>
          <p className="text-gray-300">
            ExcelIQ generates formulas and insights using artificial
            intelligence. You are responsible for reviewing and validating
            outputs before using them in production or business decisions.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Provide accurate account information</li>
            <li>Keep login credentials secure</li>
            <li>Use ExcelIQ only for lawful purposes</li>
            <li>Do not upload malicious or harmful files</li>
            <li>Do not attempt to reverse engineer the AI system</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. File Uploads</h2>
          <p className="text-gray-300">
            When uploading Excel files, you confirm that you have permission to
            use the data. You should not upload sensitive or confidential
            information.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Subscriptions & Payments</h2>
          <p className="text-gray-300">
            Paid plans provide additional AI usage and features. Subscription
            pricing may change. You can cancel anytime. No refunds unless
            required by law.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="text-gray-300">
            ExcelIQ branding, AI system, UI, and platform design are our
            intellectual property. You may not copy, reproduce, or resell the
            service.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-300">
            ExcelIQ is provided "as is". We are not responsible for errors in AI
            output, spreadsheet mistakes, or business losses resulting from use
            of the platform.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="text-gray-300">
            We may suspend accounts that violate these terms or misuse the AI
            system.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="text-gray-300">
            We may update these terms from time to time. Continued use of ExcelIQ
            indicates acceptance of the updated terms.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>

          <p className="text-gray-300">
            For questions about these Terms:
          </p>

          <p className="text-gray-300 mt-2">
            Email: support@excaliq.com <br />
            Website: ExcelIQ
          </p>
        </section>

      </div>
    </div>
  );
}