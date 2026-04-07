'use client';
import { Users, FileText, ShieldAlert, User, Activity } from 'lucide-react';

export default function AdminOverview({ stats, users }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">System Overview</h2>
        <p className="text-slate-500 mt-1">Real-time platform monitoring.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, light: 'bg-indigo-50 text-indigo-600' },
          { label: 'Processed Files', value: stats.totalFiles, icon: FileText, light: 'bg-emerald-50 text-emerald-600' },
          { label: 'Admin Accounts', value: users.filter(u => u.role === 'admin').length, icon: ShieldAlert, light: 'bg-violet-50 text-violet-600' },
          { label: 'User Accounts', value: users.filter(u => u.role !== 'admin').length, icon: User, light: 'bg-amber-50 text-amber-600' },
        ].map(card => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.light}`}>
              <card.icon size={22} />
            </div>
            <p className="text-3xl font-black text-slate-900">{card.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-indigo-600" /> Recent Registrations
        </h3>
        {users.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No users registered yet.</p>
        ) : (
          <div className="space-y-3">
            {users.slice(0, 5).map(user => (
              <div key={user._id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  {user.role || 'user'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
