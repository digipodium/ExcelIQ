"use client";
import Link from "next/link";
import React from "react";

export default function Signup() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12 overflow-hidden font-sans">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mt-2">
            Get started with <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Excel IQ</span>
          </p>
        </div>

        {/* Google Auth Button */}
        <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 hover:shadow-md transition-all duration-300 mb-6">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm font-medium">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Signup Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Create a strong password" 
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-10"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-200" 
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-snug font-medium">
              I accept the <Link href="#" className="text-indigo-600 hover:text-purple-600 transition-colors">terms and conditions</Link> and <Link href="#" className="text-indigo-600 hover:text-purple-600 transition-colors">privacy policy</Link>.
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
          >
            Create account
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="group relative text-indigo-600 transition duration-300">
            <span>Sign in</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}