"use client";
import Link from "next/link";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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
          window.location.href = '/login'; // simple redirect
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
              I accept the <Link href="/termsofservices" className="text-blue-600 hover:text-indigo-600 transition-colors font-semibold">terms</Link> and <Link href="/privacypolicy" className="text-blue-600 hover:text-indigo-600 transition-colors font-semibold">privacy policy</Link>.
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