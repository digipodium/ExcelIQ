"use client";

import { motion } from "framer-motion";
import { Users, Star, Brain, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function Customers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-indigo-200 text-black py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Trusted by Excel Users Worldwide
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Students, analysts, and professionals use ExcelIQ to generate
            formulas, analyze spreadsheets, and automate Excel tasks using AI.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
          <div className="bg-black/5 border border-black/100 rounded-2xl p-8">
            <Users className="mx-auto mb-4 text-blue-500" size={32} />
            <h2 className="text-3xl font-bold">10K+</h2>
            <p className="text-gray-600 mt-2">ExcelIQ Users</p>
          </div>

          <div className="bg-black/5 border border-black/100 rounded-2xl p-8">
            <Star className="mx-auto mb-4 text-yellow-500" size={32} />
            <h2 className="text-3xl font-bold">4.9/5</h2>
            <p className="text-gray-600 mt-2">User Rating</p>
          </div>

          <div className="bg-black/5 border border-black/100 rounded-2xl p-8">
            <Brain className="mx-auto mb-4 text-cyan-500" size={32} />
            <h2 className="text-3xl font-bold">50K+</h2>
            <p className="text-gray-600 mt-2">Formulas Generated</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What ExcelIQ Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-black/100 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                "ExcelIQ saved me hours of work. I just describe what I need and
                it generates the exact Excel formula instantly."
              </p>
              <h4 className="font-semibold">— Rohan Sharma</h4>
              <p className="text-sm text-gray-500">Data Analyst</p>
            </div>

            <div className="bg-white/5 border border-black/100 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                "Uploading my Excel file and getting insights using AI is
                amazing. Perfect tool for students and professionals."
              </p>
              <h4 className="font-semibold">— Priya Verma</h4>
              <p className="text-sm text-gray-500">MBA Student</p>
            </div>

            <div className="bg-white/5 border border-black/100 rounded-xl p-6">
              <p className="text-gray-600 mb-4">
                "The AI formula generator and automation features are incredibly
                powerful. ExcelIQ makes spreadsheet work effortless."
              </p>
              <h4 className="font-semibold">— Amit Kapoor</h4>
              <p className="text-sm text-gray-500">Business Owner</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-12 text-center">
          <FileSpreadsheet className="mx-auto mb-4 text-blue-600" size={36} />

          <h2 className="text-3xl font-bold mb-6">
            Join Thousands Using ExcelIQ
          </h2>

          <p className="max-w-2xl mx-auto mb-8 text-gray-600">
            Generate formulas, analyze spreadsheets, and automate Excel tasks
            using AI. ExcelIQ helps you work smarter with data.
          </p>

          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Start Using ExcelIQ
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}