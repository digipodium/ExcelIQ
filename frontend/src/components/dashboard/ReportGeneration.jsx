'use client';
import { FileText, FileSpreadsheet, FileDown, TrendingUp, BarChart3, Columns3, DollarSign } from 'lucide-react';

export default function ReportGeneration() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3 mb-2">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold"><FileSpreadsheet className="w-4 h-4" /> Export Excel</button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold"><FileDown className="w-4 h-4" /> Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rows', value: '1,247', icon: BarChart3, color: 'bg-indigo-500' },
          { label: 'Columns', value: '8', icon: Columns3, color: 'bg-violet-500' },
          { label: 'Trends', value: '5', icon: TrendingUp, color: 'bg-emerald-500' },
          { label: 'Avg. Value', value: '$342.80', icon: DollarSign, color: 'bg-amber-500' },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
            <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.color} text-white mb-3`}><card.icon size={20} /></span>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500 uppercase font-bold">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}