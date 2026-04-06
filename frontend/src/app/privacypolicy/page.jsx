"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>

          <p className="text-gray-400">
            <span className="font-semibold text-white">Effective Date:</span> [Add Date] <br />
            <span className="font-semibold text-white">Website:</span> ExcelIQ
          </p>
        </motion.div>

        {/* Intro */}
        <section className="mb-8 text-gray-300 leading-relaxed">
          ExcelIQ ("we", "our", or "us") respects your privacy and is committed
          to protecting your personal information. This Privacy Policy explains
          how we collect, use, and safeguard your information when you use our
          AI-powered Excel assistant and related services.
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>

          <h3 className="font-semibold mb-2">Personal Information</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Account login information</li>
            <li>Uploaded Excel files (when you use upload feature)</li>
          </ul>

          <h3 className="font-semibold mb-2">Usage Information</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Browser type</li>
            <li>Device information</li>
            <li>IP address</li>
            <li>AI queries and Excel requests</li>
            <li>Usage analytics</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>

          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Provide AI-powered Excel assistance</li>
            <li>Generate formulas and data insights</li>
            <li>Improve AI model responses</li>
            <li>Enhance user experience</li>
            <li>Send updates and notifications</li>
            <li>Provide customer support</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Excel File Upload & Data Processing
          </h2>

          <p className="text-gray-300 leading-relaxed">
            When you upload Excel files to ExcelIQ, the data is processed
            securely to generate AI responses. We do not sell your uploaded data
            or use it for purposes outside providing the service.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Cookies & Tracking
          </h2>

          <p className="text-gray-300 leading-relaxed">
            ExcelIQ uses cookies and analytics tools to improve performance,
            understand usage patterns, and enhance the AI experience.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Data Sharing
          </h2>

          <p className="text-gray-300 leading-relaxed">
            We do not sell your personal data. We may share information with
            trusted third-party services such as hosting providers, analytics,
            authentication providers, or payment gateways.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Data Security
          </h2>

          <p className="text-gray-300 leading-relaxed">
            We implement security measures to protect your data. However, no
            system is completely secure, and we recommend not uploading highly
            sensitive information.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Your Rights
          </h2>

          <p className="text-gray-300 leading-relaxed">
            You may request access, correction, or deletion of your data. You may
            also request account removal at any time.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Changes to Policy
          </h2>

          <p className="text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Continued use of
            ExcelIQ indicates acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            9. Contact Us
          </h2>

          <p className="text-gray-300">
            If you have questions about this Privacy Policy:
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