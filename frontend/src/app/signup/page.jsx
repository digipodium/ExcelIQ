"use client";
import Link from "next/link";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
});

export default function Signup() {

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
  console.log(values);
  try {
    const res = await axios.post('http://localhost:5000/user/add', values);
    console.log(res.status);

    if (res.status === 200) {
      toast.success('Signup successful!');

      // If your API returns a token after signup
      const token = res.data.token; // check if your API sends token
      if (token) {
        localStorage.setItem('token', token);
      }

      // Redirect to dashboard
      window.location.href = '/Dashboard'; // simple redirect
      // OR, if using Next.js app router with useRouter:
      // router.push('/dashboard');
    } else {
      toast.error('Signup failed. Please try again.');
    }
  } catch (error) {
    if (error.response?.data?.code === 11000 || error.response?.status === 409) {
      toast.error('You are already registered, please sign in');
    } else {
      toast.error('An error occurred. Please try again.');
    }
    console.error(error);
  }
}
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 px-4 pt-20 pb-6 overflow-hidden font-sans">

      {/* Animated Background Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500 opacity-20 rounded-full blur-[100px] animate-pulse"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-lg px-8 py-6 sm:px-12 sm:py-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/60">

        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Create Account</h2>
          <p className="text-gray-500 text-sm">
            Get started with <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excel IQ</span>
          </p>
        </div>

        {/* Google Auth Button */}
        <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-300 mb-5">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-xs font-medium uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={signupForm.handleSubmit} className="space-y-3.5">

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.name}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${signupForm.touched.name && signupForm.errors.name
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
            />
            {signupForm.touched.name && signupForm.errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{signupForm.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.email}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${signupForm.touched.email && signupForm.errors.email
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
            />
            {signupForm.touched.email && signupForm.errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{signupForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.password}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${signupForm.touched.password && signupForm.errors.password
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
            />
            {signupForm.touched.password && signupForm.errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium">{signupForm.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              value={signupForm.values.confirmPassword}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${signupForm.touched.confirmPassword && signupForm.errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
            />
            {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 font-medium">{signupForm.errors.confirmPassword}</p>
            )}
          </div>

          {/* Checkbox */}
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-200 cursor-pointer"
              required
            />
            <label htmlFor="terms" className="text-xs text-gray-500 leading-snug font-medium cursor-pointer">
              I accept the <Link href="/legal" className="text-blue-600 hover:text-indigo-600 transition-colors font-semibold">terms</Link> and <Link href="/legal" className="text-blue-600 hover:text-indigo-600 transition-colors font-semibold">privacy policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
            disabled={signupForm.isSubmitting}
          >
            {signupForm.isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="group relative text-blue-600 font-semibold transition duration-300">
            <span>Sign in</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}