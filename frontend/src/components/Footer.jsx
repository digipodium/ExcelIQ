import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative mt-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50 border-t border-indigo-100">

      {/* Glow Background Effects */}
      <div className="absolute -top-20 left-0 w-72 h-72 bg-indigo-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>

      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-10 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">

          {/* Logo + About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-3 group"
              >
              <img
                src="/logo.png"
                alt="logo"
                className="w-10 h-10 rounded-lg"
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Excel IQ
              </h2>
              </Link>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed max-w-md">
              AI-powered spreadsheet automation platform helping users generate
              formulas, pivot tables, dashboards and data insights instantly.
            </p>

            <p className="mt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} Excel IQ. All rights reserved.
            </p>
          </div>

          {/* Column Component */}
          {[
            {
              title: "Product",
              links: ["Overview", "Solutions", "Pricing", "Customers"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers"],
            },
            {
              title: "Support",
              links: ["Contact", "Help Center", "FAQ"],
            },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-900">
                {section.title}
              </h3>

              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="group text-gray-600 transition duration-300"
                    >
                      <span className="relative">
                        {link}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-900">
              Legal
            </h3>

            <ul className="space-y-4">
              {["Terms of Service", "Privacy Policy", "Cookie Settings"].map(
                (item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="group text-gray-600 transition duration-300"
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-16 border-t border-indigo-100 pt-6 text-center text-sm text-gray-500">
          Built with ❤️ for smarter Excel automation.
        </div>
      </div>
    </footer>
  );
};

export default Footer;