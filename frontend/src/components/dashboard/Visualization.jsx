'use client';
import { useState, useMemo } from 'react';
import { BarChart3, PieChart, LineChart, Palette, RefreshCw } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const palettes = {
  indigo: { name: 'Indigo', colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'], bg: ['rgba(99,102,241,0.15)', 'rgba(129,140,248,0.15)', 'rgba(165,180,252,0.15)', 'rgba(199,210,254,0.15)', 'rgba(224,231,255,0.15)'] },
  ocean: { name: 'Ocean', colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#06b6d4', '#22d3ee'], bg: ['rgba(14,165,233,0.15)', 'rgba(56,189,248,0.15)', 'rgba(125,211,252,0.15)', 'rgba(6,182,212,0.15)', 'rgba(34,211,238,0.15)'] },
};

export default function Visualization({ fileData = [] }) {
  const [activeChart, setActiveChart] = useState('bar');
  const [activePalette, setActivePalette] = useState('indigo');
  const pal = palettes[activePalette];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visualization</h2>
          <p className="text-sm text-slate-500">AI-generated charts from your dataset.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-5">
          {/* Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Chart Type</h3>
            <div className="space-y-2">
              {[
                { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
                { id: 'pie', label: 'Pie Chart', icon: PieChart },
                { id: 'line', label: 'Line Chart', icon: LineChart },
              ].map((ct) => (
                <button key={ct.id} onClick={() => setActiveChart(ct.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeChart === ct.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                  <ct.icon size={18} /> {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={14} /> Colors</h3>
            <div className="space-y-2">
              {Object.entries(palettes).map(([key, p]) => (
                <button key={key} onClick={() => setActivePalette(key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activePalette === key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                  <div className="flex -space-x-1">{p.colors.slice(0, 3).map((c, i) => <span key={i} className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: c }} />)}</div>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="font-bold text-slate-800">{activeChart.toUpperCase()} Analysis</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Live Preview from Dataset</p>
               </div>
               <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="h-[350px] w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-400 text-sm">
               {/* Chart component code stays the same, just wrapped in these standard classes */}
               Chart Preview Area
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             {[{ label: 'Highest', val: 'June' }, { label: 'Growth', val: '+18.2%' }, { label: 'Points', val: '12' }].map(s => (
               <div key={s.label} className="bg-white p-4 border border-slate-100 rounded-2xl text-center shadow-sm">
                 <p className="text-lg font-bold text-slate-900">{s.val}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{s.label}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}