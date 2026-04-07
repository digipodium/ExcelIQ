'use client';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast'; 
import Sidebar from '@/components/dashboard/Sidebar';
import ExcelAssistant from '@/components/dashboard/ExcelAssistant';
import FormulaGenerator from '@/components/dashboard/FormulaGenerator';
import ReportGeneration from '@/components/dashboard/ReportGeneration';
import Visualization from '@/components/dashboard/Visualization';
import Profile from '@/components/dashboard/Profile'; // <--- Yeh import zaroori hai
import { Bell, Search } from 'lucide-react';

// Tab titles mapping
const tabTitles = {
  assistant: 'Excel Assistant',
  formula: 'Formula Generator',
  report: 'Report Generation',
  visualization: 'Visualization',
  profile: 'My Profile',
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('assistant');

  // Render modules based on active tab
  const renderModule = () => {
    switch (activeTab) {
      case 'assistant': return <ExcelAssistant />;
      case 'formula': return <FormulaGenerator />;
      case 'report': return <ReportGeneration />;
      case 'visualization': return <Visualization />;
      case 'profile': return <Profile />; // Ab yeh sahi kaam karega
      default: return <ExcelAssistant />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200">
            <div className="flex items-center justify-between px-6 md:px-8 py-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{tabTitles[activeTab]}</h1>
                <p className="text-xs text-slate-400 mt-0.5">Welcome back — let's work with your data.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-sm">
                  <Search className="w-4 h-4" />
                  <span>Search…</span>
                </div>
                {/* Profile Button: Is par click karke bhi profile open kar sakte hain */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-indigo-50 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
                </button>
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform"
                >
                  U
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8">
            {renderModule()}
          </div>
        </main>
      </div>
    </>
  );
}