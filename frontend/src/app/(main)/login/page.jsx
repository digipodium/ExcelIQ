'use client';
import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ← Add this
import toast from 'react-hot-toast';

const Login = () => {
  const router = useRouter(); // ← Initialize router

  const loginForm = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: (values) => {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, values)
        .then((response) => {
          toast.success('Login successfully');

          // 1. Get token and role from response
          const { token, role } = response.data;

          // 2. Wipe any stale data from previous session BEFORE storing new token.
          [
            'ea_chatHistory', 'ea_fileMeta', 'ea_uploadedFilePath', 'ea_fileData', 'ea_suggestedCharts',
            'viz_fileMeta', 'viz_uploadedFilePath', 'viz_fileData', 'viz_suggestedCharts',
            'dashboard_activeTab',
          ].forEach((key) => localStorage.removeItem(key));

          // 3. Store new session credentials
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);

          // 4. Conditional Redirect
          if (role === 'admin') {
            router.push('/admin/Dashboard');
          } else {
            router.push('/user/Dashboard');
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 403) {
            toast.error(err.response.data.message);
          } else {
            toast.error('Some error occurred');
          }
        });
    },
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
              <Link href="/forgetpassword" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</Link>
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


};


export default Login;