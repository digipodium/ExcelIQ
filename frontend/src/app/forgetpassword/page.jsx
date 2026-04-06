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
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4">
      <form onSubmit={sendOtp} className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-96 shadow-2xl text-center">
        <h2 className="text-2xl text-purple-500 font-bold mb-4 ">Forgot Password</h2>
        <p className='text-white text-sm mb-6 '>Enter email to receive a 6-digit OTP.</p>
         
           <input type="email" placeholder='Enter your Email' className='w-full p-3 bg-slate-800 text-black rounded-lg outline-none border border-slate-700 focus:border-cyan-600 transition-all mb-6'
           onChange={(e)=>{
            setEmail(e.target.value)
           }} required />
        
           <button
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition duration-300 shadow-2xl disabled:opacity-50">
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
     
           <div className='mt-4 text-center'>
            <a href='/auth/login' className='text-sm font-semibold text-cyan-500 hover:underline'>Back to Login</a>
           </div>
      </form>
    </div>
  );
}