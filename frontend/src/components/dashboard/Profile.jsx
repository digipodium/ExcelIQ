'use client';
import { User, Mail, Shield, Camera, Edit2, MapPin, Briefcase } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
          <User className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <p className="text-sm text-slate-500">Manage your personal information and account settings.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-sm">
                U
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-indigo-600 transition">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">User Name</h3>
            <p className="text-sm text-slate-500 mb-4">Pro Plan Member</p>
            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <Edit2 size={14} /> Edit Photo
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-lg">Personal Information</h3>
              <button className="text-indigo-600 text-sm font-bold hover:underline">Save Changes</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 text-slate-400" size={16} />
                  <input type="text" defaultValue="User Name" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-slate-400" size={16} />
                  <input type="email" defaultValue="user@exceliq.com" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}