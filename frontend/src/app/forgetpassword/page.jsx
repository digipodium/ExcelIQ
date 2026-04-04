"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/user/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const text = await res.text();
    const data = JSON.parse(text);
    alert(data.message || "Reset link sent to your email ");

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="w-[420px] bg-white rounded-3xl shadow-xl p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold p-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

      </div>
    </div>
  );
}