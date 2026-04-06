"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export  function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ handleSubmit MUST BE HERE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Enter valid OTP");
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
        router.push("/login"); // change if needed
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // ✅ RETURN AFTER FUNCTION
  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-96 shadow-2xl"
      >
        <h2 className="text-2xl text-cyan-500 font-bold mb-2 text-center">
          Verify OTP
        </h2>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 bg-slate-800 text-white rounded-lg mb-3"
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-800 text-white rounded-lg mb-3"
        />

        {message && (
          <p className="text-red-400 text-sm text-center">{message}</p>
        )}

        <button className="w-full py-2 bg-cyan-500 rounded-lg">
          Confirm Reset
        </button>
      </form>
    </div>
  );
}

export default function VerifyOtpPageWrapper() {
    return (
        <Suspense fallback={<div className='min-h-screen bg-[#0b0f1a] flex items-center justify-center text-white text-xl'>
            Loading...
        </div>}>
            <VerifyOTP />
        </Suspense>
    );
}