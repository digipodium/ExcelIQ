'use client';
import { Sparkles, Upload, Shield, Bot, Send, Table } from 'lucide-react';

export default function ExcelAssistant() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Sparkles className="text-white w-6 h-6" /></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Excel Assistant</h2>
          <p className="text-sm text-slate-500">Ask anything about your data in plain English.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="border-2 border-dashed rounded-3xl p-12 text-center border-slate-200 bg-white hover:border-indigo-400 cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center"><Upload className="w-8 h-8 text-indigo-600" /></div>
              <p className="font-semibold text-slate-800 text-lg">Drop your file here or <span className="text-indigo-600 underline">browse</span></p>
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Secure & Encrypted</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4"><Bot className="text-indigo-600" /></div>
              <p className="text-slate-600 font-medium">Ready to analyze your data</p>
            </div>
            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <input type="text" placeholder="Type your question..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none" />
              <button className="bg-indigo-600 text-white p-3 rounded-xl"><Send size={18} /></button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Table size={18} className="text-indigo-600" /> File Details</h3>
          <p className="text-center py-6 text-slate-400 text-sm italic">No file uploaded</p>
        </div>
      </div>
    </div>
  );
}