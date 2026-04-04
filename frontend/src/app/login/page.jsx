'use client';
import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Login = () => {
  // Logic from login
  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values);

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, values)
        .then((response) => {
          toast.success('login sucessfully');
          console.log(response.data);
          const {token} = response.data;
          localStorage.setItem('token', token);
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            toast.error(err?.response?.data?.message);
          } else {
            toast.error('some error occured');
          }
        });
    }
  });

  return (
    <>
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 px-4 pt-20 pb-6 overflow-hidden font-sans">
      
      {/* Background Decorations */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-lg px-8 py-6 sm:px-12 sm:py-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/60">

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Log in to <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excel IQ</span> to access your datasets.
          </p>
        </div>

        {/* Google Auth */}
        <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-gray-50 transition-all duration-300 mb-5">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center mb-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-medium uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={loginForm.handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={loginForm.handleChange}
              value={loginForm.values.email}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={loginForm.handleChange}
              value={loginForm.values.password}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300" />
              <span className="text-xs text-gray-600 font-medium">Remember me</span>
            </label>
            <Link href="#" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </div>
    </>
  );
}
export default Login;