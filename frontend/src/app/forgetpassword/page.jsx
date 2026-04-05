"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        router.push(`/reset-password?email=${email}`);
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#cfc8a8] flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-[28px] shadow-xl p-8 relative">

        <h2 className="text-center text-blue-500 text-xl font-semibold mt-4">
          Reset your password
        </h2>

        <form onSubmit={sendOtp} className="mt-6">

          <input
            type="email"
            placeholder="Enter your ExcelIQ email"
            className="w-full h-14 px-4 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full mt-5 bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Code"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}