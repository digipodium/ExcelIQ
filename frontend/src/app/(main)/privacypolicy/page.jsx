"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-indigo-200 text-black py-20 px-6">
      <div className="max-w-5xl mx-auto bg-black/5 border border-white/10 rounded-2xl p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Last Updated:</span> July 2026 <br />
            <span className="font-semibold text-gray-800">Product:</span> ExcelIQ — AI Excel Assistant
          </p>
        </motion.div>

        {/* Intro */}
        <section className="mb-8 text-gray-600 leading-relaxed">
          This Privacy Policy explains how ExcelIQ ("we", "our", or "us")
          collects, uses, and protects your information when you use our AI-powered
          Excel assistant platform. By using ExcelIQ, you agree to the collection
          and use of information in accordance with this policy.
        </section>

        {/* Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>

          <h3 className="font-semibold mb-2">Account Information</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Account preferences</li>
          </ul>

          <h3 className="font-semibold mb-2">Usage Data</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li>Browser and device information</li>
            <li>IP address</li>
            <li>Pages visited</li>
            <li>Feature usage</li>
            <li>AI queries</li>
          </ul>

          <h3 className="font-semibold mb-2">Uploaded Files</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Excel spreadsheets</li>
            <li>CSV files</li>
            <li>Data used for AI processing</li>
          </ul>
        </section>

        {/* Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>

          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Provide AI-powered Excel assistance</li>
            <li>Process uploaded spreadsheets</li>
            <li>Generate formulas and automation</li>
            <li>Improve platform performance</li>
            <li>Provide customer support</li>
            <li>Send important service notifications</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Cookies & Tracking Technologies
          </h2>

          <p className="text-gray-600">
            We use cookies and analytics tools to understand usage patterns,
            improve performance, and enhance user experience. You can disable
            cookies in your browser settings.
          </p>
        </section>

        {/* Sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Third-Party Services
          </h2>

          <p className="text-gray-600 mb-3">
            We may use trusted third-party services including:
          </p>

          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Authentication providers</li>
            <li>Cloud hosting providers</li>
            <li>Analytics services</li>
            <li>Payment gateways</li>
            <li>Email delivery services</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Data Security
          </h2>

          <p className="text-gray-600">
            We implement industry-standard security measures including encryption,
            secure APIs, and protected servers. However, no system is 100% secure.
          </p>
        </section>

        {/* Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Data Retention
          </h2>

          <p className="text-gray-600">
            We retain your data only as long as necessary to provide services.
            You may request deletion of your account and data at any time.
          </p>
        </section>

        {/* Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Your Privacy Rights
          </h2>

          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Access your personal data</li>
            <li>Request data correction</li>
            <li>Request account deletion</li>
            <li>Request data export</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        {/* Children */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Children's Privacy
          </h2>

          <p className="text-gray-600">
            ExcelIQ is not intended for users under 13 years of age. We do not
            knowingly collect personal information from children.
          </p>
        </section>

        {/* Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Changes to This Policy
          </h2>

          <p className="text-gray-600">
            We may update this Privacy Policy periodically. Continued use of the
            platform indicates acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Contact Us
          </h2>

          <p className="text-gray-600">
            If you have questions about this Privacy Policy, contact us:
          </p>

          <p className="text-gray-600 mt-3">
            Email: support@exceliq.com <br />
            Website: ExcelIQ <br />
            Support: /support
          </p>
        </section>

      </div>
    </div>
  );
}