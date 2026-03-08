'use client';
import React from "react";
import { motion } from "framer-motion";
import Faq from "@/components/faq";

export const Home = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* Animated Background Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      <div className="mx-auto max-w-screen-2xl px-6 md:px-10 py-16">

        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center lg:w-1/2"
          >
            <p className="mb-4 font-semibold text-indigo-600 text-lg">
              Proudly Presenting ExcelIQ
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Redefining the Future of{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Excel Learning
              </span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              ExcelIQ combines intelligence with simplicity to deliver a
              next-generation Excel experience with smart automation,
              instant formulas, and powerful insights.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition duration-300">
                Start Now
              </button>

              <button className="px-8 py-3 rounded-xl border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition duration-300">
                Take Tour
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative lg:w-1/2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20 rounded-3xl"></div>

            <img
              src="hero sectionexceliq.png"
              alt="Excel IQ"
              className="relative rounded-3xl shadow-2xl hover:scale-105 transition duration-500"
            />
          </motion.div>
        </section>

        {/* SECOND SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto mt-28"
        >
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-indigo-700">Excel IQ</span>{" "}
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Spreadsheet Automation
            </span>
          </h2>

          <p className="text-gray-600 mt-6 text-lg">
            Generate formulas, Pivot Tables, dashboards and uncover powerful
            data insights instantly with AI.
          </p>
        </motion.div>

        {/* USERS + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
        >
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {[
                "https://randomuser.me/api/portraits/women/1.jpg",
                "https://randomuser.me/api/portraits/men/2.jpg",
                "https://randomuser.me/api/portraits/men/3.jpg",
                "https://randomuser.me/api/portraits/women/4.jpg",
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="user"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
              ))}
            </div>

            <span className="ml-4 text-sm text-gray-600">
              <span className="text-indigo-600 font-semibold">
                1.4 Million+
              </span>{" "}
              Happy users
            </span>
          </div>

          <button className="bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-indigo-600 hover:scale-105 transition duration-300 shadow-xl">
            GET STARTED →
          </button>
        </motion.div>
      </div>
     
     <Faq/>
    </div>
  );
};

export default Home;