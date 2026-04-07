'use client';
import { HelpCircle, User, Activity, ShieldAlert, Phone, ChevronRight } from 'lucide-react';

export default function AdminHelp() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Help Center</h2>
        <p className="text-slate-500 mt-1">Admin guides, quick actions, and support resources.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'Reset User Password', desc: "Force-reset a user's password from the management panel.", icon: User, color: 'bg-indigo-600' },
          { title: 'View Audit Logs', desc: 'Track all admin actions for compliance and monitoring.', icon: Activity, color: 'bg-emerald-600' },
          { title: 'System Health Check', desc: 'Check API uptime, database status, and server load.', icon: ShieldAlert, color: 'bg-violet-600' },
          { title: 'Contact Support', desc: 'Reach out to the ExcelIQ engineering team directly.', icon: Phone, color: 'bg-amber-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group">
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center text-white mb-4 shadow-md`}>
              <item.icon size={20} />
            </div>
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><HelpCircle size={18} className="text-indigo-600" /> Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: 'How do I add a new admin?', a: 'Register a new account at /signup, select "Administrator" role. The account will have admin privileges immediately.' },
            { q: 'Can I restore a deleted user?', a: 'No. Deletion is permanent. Make sure to export user data before removing an account.' },
            { q: 'How do I monitor file uploads?', a: 'The System Overview dashboard shows total processed files. For detailed logs, check the MongoDB FileModel collection.' },
            { q: 'How are JWT tokens managed?', a: 'Tokens are generated on login with user ID and role. They expire based on your JWT_SECRET config. Users must re-login after expiry.' },
          ].map((faq, i) => (
            <details key={i} className="group border border-slate-100 rounded-xl overflow-hidden">
              <summary className="p-4 font-semibold text-slate-800 cursor-pointer hover:bg-slate-50 transition flex items-center justify-between text-sm">
                {faq.q}
                <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
