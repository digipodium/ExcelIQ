"use client";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 px-4 pt-20 pb-6 overflow-hidden font-sans">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>

      {/* Login Card (Wider with max-w-lg) */}
      <div className="relative z-10 w-full max-w-lg px-8 py-6 sm:px-12 sm:py-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/60">
        
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Log in to <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excel IQ</span> to access your datasets.
          </p>
        </div>

        {/* Google Auth Button */}
        <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-300 mb-5">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-medium uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Login Form */}
        <form className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          {/* Password Input (Label fixed, link removed from here) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 pr-10"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password Layout Fix */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-200 cursor-pointer" 
              />
              <span className="text-xs text-gray-600 font-medium">Remember me</span>
            </label>
            
            <Link href="#" className="text-xs font-medium text-blue-600 hover:text-indigo-600 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
          >
            Sign in
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-5 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="group relative text-blue-600 font-semibold transition duration-300">
            <span>Sign up</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

      </div>
    </div>
  );
}