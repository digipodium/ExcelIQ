"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
          ? "backdrop-blur-xl bg-white/70 shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-screen-2xl px-6 md:px-10">
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="w-10 h-10 rounded-lg shadow-md"
            />

            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Excel IQ
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { name: "Product", path: "/overview" },
              { name: "Pricing", path: "/pricing" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="relative text-gray-700 font-medium transition duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 font-medium hover:text-indigo-600 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}