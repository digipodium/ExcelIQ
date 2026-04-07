"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (otp.length !== 6) {
    toast.error("Enter valid OTP");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost:5000/user/reset-password-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success("Password reset successfully");
      router.push("/login");
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error("Server error");
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 px-4 pt-20 pb-6 overflow-hidden font-sans">
      
      {/* Background blur */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-lg px-8 py-6 sm:px-12 sm:py-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/60">

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
            Verify OTP
          </h2>

          <p className="text-gray-500 text-sm">
            Enter OTP sent to your email and set new password
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              OTP Code
            </label>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6 digit OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              required
            />
          </div>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            Confirm Reset
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center text-sm text-gray-500 font-medium">
          Back to{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}