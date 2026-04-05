"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // RESEND OTP
  const resendOtp = async () => {
    try {
      setTimer(60);

      await fetch("http://localhost:5000/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setMessage("New OTP sent to email");

    } catch (error) {
      setMessage("Failed to resend OTP");
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Enter complete OTP");
      return;
    }

    if (!password) {
      setMessage("Enter new password");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

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
            otp: enteredOtp,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful");

        setTimeout(() => {
          router.push("/login");
        }, 1200);

      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#cfc8a8] flex items-center justify-center">

      <div className="bg-white w-[440px] rounded-[30px] shadow-xl p-8">

        <h2 className="text-center text-blue-500 text-lg font-semibold">
          ExcelIQ Security
        </h2>

        <p className="text-center text-gray-400 text-sm mb-4">
          Reset your password
        </p>

        <form onSubmit={handleSubmit}>

          {/* OTP BOXES */}
          <div className="flex justify-between mb-4">
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
                className="w-12 h-14 border rounded-xl text-center text-lg"
              />
            ))}
          </div>

          {/* PASSWORD */}
          <div className="relative mb-3">
            <input
              type={show ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-3 border rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShow(!show)}
              className="absolute right-4 top-3 cursor-pointer text-sm"
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-xl mb-3"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {/* TIMER */}
          <div className="text-center text-sm text-gray-500 mb-2">
            {timer > 0 ? (
              <>Resend OTP in {timer}s</>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className="text-blue-600 font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* MESSAGE */}
          {message && (
            <p className="text-center text-sm text-red-500 mb-3">
              {message}
            </p>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl flex justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}