"use client";
import React, { useState } from "react";

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on signup button and fill your details. After registration you will be redirected to dashboard."
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to login page and click on forgot password. Enter your email and verify OTP to reset password."
    },
    {
      question: "How do I contact support?",
      answer:
        "You can use the contact form or email us at support@exceliq.com."
    },
    {
      question: "Is Excel IQ free to use?",
      answer:
        "Yes, Excel IQ offers free plan with basic features. Premium features available in paid plans."
    },
    {
      question: "How to access dashboard?",
      answer:
        "After login you will automatically redirect to dashboard page."
    }
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Help <span className="text-indigo-600">Center</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers, guides and support for Excel IQ
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm">
              Learn how to create account and start using Excel IQ
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Account & Login</h3>
            <p className="text-gray-600 text-sm">
              Password reset, login issues and account settings
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">Billing & Plans</h3>
            <p className="text-gray-600 text-sm">
              Pricing, subscription and payment questions
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center"
                >
                  {faq.question}
                  <span>
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Support */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-3">
            Still need help?
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;