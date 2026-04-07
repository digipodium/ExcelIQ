"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TakeTour() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-28 pb-20">

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Take a Tour of{" "}
          <span className="text-indigo-600">ExcelIQ</span>
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Discover how ExcelIQ helps you generate formulas, automate tasks,
          and analyze spreadsheets using AI.
        </p>
      </div>

      {/* Section 1 */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-24">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Smart AI Dashboard
          </h2>

          <p className="text-gray-600 mb-6">
            Your ExcelIQ dashboard gives you instant access to AI-powered
            spreadsheet tools. Ask questions, generate formulas, and upload
            files directly from one place.
          </p>

          <ul className="space-y-2 text-gray-600">
            <li>• AI Formula Generator</li>
            <li>• Excel File Upload</li>
            <li>• Data Insights Panel</li>
            <li>• Automation Suggestions</li>
          </ul>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          src="/dashboard.png"
          alt="Dashboard"
          className="rounded-2xl shadow-2xl border"
        />
      </div>

      {/* Section 2 */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-24">

        <motion.img
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          src="/ai-chat.png"
          alt="AI Chat"
          className="rounded-2xl shadow-2xl border"
        />

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ask AI Anything
          </h2>

          <p className="text-gray-600 mb-6">
            Simply type your Excel question and ExcelIQ will generate formulas,
            pivot tables, and automation instantly.
          </p>

          <ul className="space-y-2 text-gray-600">
            <li>• Generate Excel formulas</li>
            <li>• Create Pivot Tables</li>
            <li>• Build dashboards</li>
            <li>• Explain formulas</li>
          </ul>
        </motion.div>
      </div>

      {/* Section 3 */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-24">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Upload Excel Files
          </h2>

          <p className="text-gray-600 mb-6">
            Upload your Excel file and ExcelIQ will analyze your data,
            generate insights, and suggest improvements automatically.
          </p>

          <ul className="space-y-2 text-gray-600">
            <li>• Upload .xlsx files</li>
            <li>• Automatic analysis</li>
            <li>• Data cleaning suggestions</li>
            <li>• AI recommendations</li>
          </ul>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          src="/upload.png"
          alt="Upload"
          className="rounded-2xl shadow-2xl border"
        />
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <h3 className="text-3xl font-bold mb-4">
          Ready to try ExcelIQ?
        </h3>

        <p className="text-gray-600 mb-6">
          Start using AI-powered Excel automation today.
        </p>

        <Link
          href="/signup"
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </div>

    </div>
  );
}