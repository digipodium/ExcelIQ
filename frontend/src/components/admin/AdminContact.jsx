'use client';
import { useState } from 'react';
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminContact() {
  const [queryForm, setQueryForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [querySent, setQuerySent] = useState(false);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    setQuerySent(true);
    toast.success("Query submitted successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Incoming queries */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><MessageSquare size={18} className="text-indigo-600" /> Incoming Requests</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: 'Rahul Sharma', msg: 'Unable to upload .xlsx file, getting error 500.', time: '2 hours ago', status: 'pending' },
              { name: 'Priya Kaur', msg: 'How do I export my formula history as PDF?', time: '5 hours ago', status: 'pending' },
              { name: 'Arjun Patel', msg: 'Dashboard stats not updating after file cleaning.', time: '1 day ago', status: 'resolved' },
            ].map((q, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-800 text-sm">{q.name}</p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${q.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{q.msg}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <Clock size={12} /> {q.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit query form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Send size={18} className="text-violet-600" /> Submit Internal Query</h3>

          {querySent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CheckCircle className="text-emerald-500 w-14 h-14" />
              <h4 className="text-xl font-bold text-slate-800">Query Sent!</h4>
              <p className="text-slate-500 text-sm">Your message has been logged.</p>
              <button onClick={() => { setQuerySent(false); setQueryForm({ subject: '', message: '', priority: 'medium' }); }}
                className="mt-4 text-indigo-600 text-sm font-bold hover:underline">
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input required value={queryForm.subject} onChange={e => setQueryForm({ ...queryForm, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  placeholder="E.g. Server latency issue" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select value={queryForm.priority} onChange={e => setQueryForm({ ...queryForm, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea required rows={4} value={queryForm.message} onChange={e => setQueryForm({ ...queryForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                  placeholder="Describe the issue..." />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition shadow-md">
                <Send size={16} /> Send Query
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
