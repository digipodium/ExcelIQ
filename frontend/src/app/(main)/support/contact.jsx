"use client";

import { Mail, User, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-white via-gray-50 to-purple-50 overflow-hidden">

      {/* background glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 blur-[120px] opacity-30 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 blur-[120px] opacity-30 rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contact Us
          </h2>

          <p className="mt-4 text-gray-500">
            Have questions about Excel IQ? We'd love to hear from you.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">

          <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-10 border border-gray-200">

            <form className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />

                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />

                  <textarea
                    rows="4"
                    placeholder="Write your message..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                  ></textarea>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] hover:shadow-xl transition duration-300"
              >
                Send Message
              </button>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}