'use client';
import { User, Mail } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Admin Profile</h2>
        <p className="text-slate-500 mt-1">Manage your account information.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
            A
          </div>
          <h3 className="text-lg font-bold text-slate-900">Admin</h3>
          <p className="text-sm text-slate-500 mt-1">System Administrator</p>
          <span className="inline-block mt-3 px-4 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">Admin Role</span>
        </div>

        {/* Info Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Personal Information</h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Save Changes</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3 text-slate-400" size={16} />
                <input type="text" defaultValue="Admin User" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 text-slate-400" size={16} />
                <input type="email" defaultValue="admin@exceliq.com" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-4">Security</h4>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Change Password</label>
              <input type="password" placeholder="New password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
