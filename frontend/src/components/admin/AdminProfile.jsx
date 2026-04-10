"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, Save } from "lucide-react";

export default function AdminProfile() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchUser = async () => {
       const token = sessionStorage.getItem("token");
       if(!token) return;
       const res = await fetch(`${BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }});
       const data = await res.json();
       setFormData({ name: data.name, email: data.email, password: "" });
    };
    fetchUser();
  }, [BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await fetch(`${BASE_URL}/api/auth/update`, {
         method: "PUT",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         body: JSON.stringify(formData)
      });
      setMessage("Profile successfully updated.");
    } catch {
      setMessage("Update failed.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#2E3C43] mb-6 flex items-center gap-2"><User className="text-[#00ACC1]" /> Profile Settings</h2>
        
        {message && <div className="p-4 mb-6 text-emerald-700 bg-emerald-50 rounded-xl">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><User size={16}/> Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00ACC1]/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Mail size={16}/> Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00ACC1]/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><Lock size={16}/> New Password (Optional)</label>
            <input type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00ACC1]/50" />
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-[#00ACC1] to-[#007ea7] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">
            <Save size={20} /> Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}