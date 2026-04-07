"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  FileSpreadsheet,
  Sparkles,
  Upload,
  BarChart3,
  Zap,
  CheckCircle,
} from "lucide-react";

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Overview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#020617] to-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ExcelIQ AI Overview
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            ExcelIQ is your AI-powered Excel assistant that helps you generate
            formulas, analyze data, automate spreadsheets, and solve Excel
            problems instantly. Built for students, analysts, and professionals
            who want to work smarter with Excel.
          </p>
        </motion.div>

        {/* Mission Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-blue-500/40 transition"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To simplify Excel and spreadsheet workflows using AI so anyone can
              generate formulas, analyze data, and automate tasks without
              advanced Excel knowledge.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-blue-500/40 transition"
          >
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              To become the most intelligent Excel AI assistant trusted by
              students, businesses, and data professionals worldwide.
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What ExcelIQ Offers
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Formula Generator",
                desc: "Create complex Excel formulas using simple natural language.",
              },
              {
                icon: BarChart3,
                title: "Smart Data Analysis",
                desc: "Analyze large Excel data and get instant insights.",
              },
              {
                icon: Zap,
                title: "Automation",
                desc: "Automate repetitive spreadsheet tasks instantly.",
              },
              {
                icon: Upload,
                title: "Upload Excel Files",
                desc: "Upload spreadsheets and let AI understand your data.",
              },
              {
                icon: Sparkles,
                title: "AI Suggestions",
                desc: "Get intelligent formula and chart recommendations.",
              },
              {
                icon: FileSpreadsheet,
                title: "Excel Assistant",
                desc: "Ask Excel questions and get instant solutions.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition"
                >
                  <Icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">
            Powerful AI Dashboard
          </h2>

          <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Ask Excel Anything
                </h3>
                <p className="text-gray-400 mb-6">
                  Upload your Excel file or type your question. ExcelIQ will
                  generate formulas, clean data, create summaries, and provide
                  insights instantly.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                    <span className="text-gray-300">Formula generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                    <span className="text-gray-300">Data cleaning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                    <span className="text-gray-300">Chart suggestions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                    <span className="text-gray-300">Excel automation</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-xl p-6">
                <div className="bg-[#020617] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-gray-500 mb-2">ExcelIQ AI</p>
                  <p className="text-gray-300 text-sm">
                    Generate Excel formula to calculate total sales where region
                    = North
                  </p>
                </div>

                <div className="mt-4 bg-[#020617] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-gray-500 mb-2">Response</p>
                  <p className="text-green-400 text-sm font-mono">
                    =SUMIF(A:A,"North",B:B)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Start Using ExcelIQ Today
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Save time, generate formulas instantly, and analyze Excel data using
            AI. ExcelIQ helps you work smarter with spreadsheets.
          </p>

          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition px-8 py-3 rounded-lg font-semibold">
              Get Started Free
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}