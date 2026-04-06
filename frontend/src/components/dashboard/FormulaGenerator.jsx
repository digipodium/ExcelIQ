'use client';
import { useState } from 'react';
import { FunctionSquare, Sparkles, Copy, Check, Lightbulb, Clock } from 'lucide-react';

export default function FormulaGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg"><FunctionSquare className="text-white w-6 h-6" /></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Formula Generator</h2>
          <p className="text-sm text-slate-500">Describe what you need — get an Excel formula instantly.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-4">What do you want to calculate?</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Find the average salary for Marketing department"'
                className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none"
              />
              <button className="bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-700 transition shadow-md">
                <Sparkles size={18} /> Generate
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2"><Lightbulb size={18} className="text-amber-400" /> Result</h3>
              <button className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"><Copy size={14} /> Copy</button>
            </div>
            <code className="text-xl font-mono text-violet-300 block bg-black/30 p-6 rounded-2xl border border-white/10">
              =SUMIFS(C:C, A:A, "Marketing")
            </code>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400" /> History</h3>
          <p className="text-sm text-slate-400 italic">No recent history</p>
        </div>
      </div>
    </div>
  );
}