"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/user/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: enteredOtp,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP verified successfully");

        // redirect after 1 sec
        setTimeout(() => {
          router.push("/Dashboard");
        }, 1000);

      } else {
        setMessage(data.message || "Invalid OTP");
      }

    } catch (error) {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#cfc8a8] flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-[28px] shadow-xl p-8">

        <h2 className="text-center text-blue-500 text-xl font-semibold">
          Enter OTP send to your email
        </h2>

        <p className="text-center text-gray-400 text-sm">
          {email}
        </p>

        <form onSubmit={verifyOtp}>

          <div className="flex justify-between mt-6 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                className="w-12 h-14 border rounded-xl text-center"
              />
            ))}
          </div>

          {message && (
            <p className="text-center text-sm mb-3 text-red-500">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl flex justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Verify Code"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}