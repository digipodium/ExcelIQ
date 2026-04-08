'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, FunctionSquare, FileText, BarChart3, Menu, X, LogOut, Settings, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'assistant', label: 'Excel Assistant', icon: MessageSquare, desc: 'Natural Language AI' },
  { id: 'formula', label: 'Formula Generator', icon: FunctionSquare, desc: 'Auto Formulas' },
  { id: 'report', label: 'Report Generation', icon: FileText, desc: 'Insights & Summaries' },
  { id: 'visualization', label: 'Visualization', icon: BarChart3, desc: 'Charts & Graphs' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300">
      {/* Logo */}
      <div className="px-6 pt-8 pb-10">
        <Link href="" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Excel IQ"
            className="w-10 h-10 rounded-xl shadow-md object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Excel<span className="text-indigo-400">IQ</span></h1>
            <p className="text-[0.6rem] text-slate-500 font-bold uppercase tracking-widest">AI Spreadsheet</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 mb-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">Modules</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group ${isActive ? 'bg-indigo-600/10 border-l-4 border-indigo-600' : 'hover:bg-slate-800'
                }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                }`}>
                <Icon size={20} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{item.label}</p>
                <p className="text-[0.65rem] text-slate-500 truncate">{item.desc}</p>
              </div>
              {isActive && <ChevronRight size={14} className="text-indigo-500" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-all"
        >
          <LogOut size={18} /> <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900 text-white shadow-lg"><Menu size={24} /></button>
      {mobileOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 h-screen ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}