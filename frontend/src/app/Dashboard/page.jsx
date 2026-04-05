'use client';
import React, { useState } from 'react';
import ExcelAssistant from './components/excel-assistant';
import Visualization from './components/visualization';
import FormulaGen from './components/formula-gen';
import ReportGen from './components/report';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  const renderContent = () => {
    switch (activeTab) {
      case 'assistant': return <excel-assistent />;
      case 'viz': return <Visualization />;
      case 'formula': return <formula-gen/>;
      case 'report': return <report/>
      default: return <ExcelAssistant />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">Excel IQ</div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('assistant')} className={`w-full text-left p-3 rounded ${activeTab === 'assistant' ? 'bg-green-600' : 'hover:bg-slate-700'}`}>Excel Assistant</button>
          <button onClick={() => setActiveTab('viz')} className={`w-full text-left p-3 rounded ${activeTab === 'viz' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>Chat Visualization</button>
          <button onClick={() => setActiveTab('formula')} className={`w-full text-left p-3 rounded ${activeTab === 'formula' ? 'bg-purple-600' : 'hover:bg-slate-700'}`}>Formula Generation</button>
          <button onClick={() => setActiveTab('report')} className={`w-full text-left p-3 rounded ${activeTab === 'report' ? 'bg-orange-600' : 'hover:bg-slate-700'}`}>Report Generation</button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;