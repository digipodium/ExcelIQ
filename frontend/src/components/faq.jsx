"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can I cancel at anytime?",
    a: "Yes. You can cancel your Excel IQ subscription anytime without restrictions."
  },
  {
    q: "How does Excel IQ work?",
    a: "Upload your Excel CV file and Excel IQ automatically analyzes the data and provides intelligent insights."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. Your uploaded files are encrypted and processed securely."
  },
  {
    q: "Do you offer discounts?",
    a: "Yes. We provide discounts for students, teams, and organizations."
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes, you can upgrade or downgrade your plan anytime."
  },
  {
    q: "What is the refund policy?",
    a: "If you're not satisfied, you can request a refund during the refund period."
  }
];

export default function FAQ() {
  const [active, setActive] = useState(null);

  const toggle = (i) => {
    setActive(active === i ? null : i);
  };

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-purple-50">

      {/* background blur effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full blur-[120px] opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-500">
            Everything you need to know about Excel IQ
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {faqs.map((faq, i) => (

            <div
              key={i}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 hover:scale-[1.02] transition duration-500"
            >

              <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg">

                {/* Question */}
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition">
                    {faq.q}
                  </span>

                  <ChevronDown
                    className={`transition-transform duration-400 ${
                      active === i ? "rotate-180 text-purple-600" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    active === i ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}