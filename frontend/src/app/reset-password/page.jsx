"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();
      alert(data.message || "Password updated successfully");

      router.push("/login");

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
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full mt-1 p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full mt-1 p-3 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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

            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  );
}