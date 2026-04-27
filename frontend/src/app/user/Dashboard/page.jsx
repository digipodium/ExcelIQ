'use client';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Sidebar from '@/components/dashboard/Sidebar';
import ExcelAssistant from '@/components/dashboard/ExcelAssistant';
import FormulaGenerator from '@/components/dashboard/FormulaGenerator';
import ReportGeneration from '@/components/dashboard/ReportGeneration';
import Visualization from '@/components/dashboard/Visualization';
import DatasetView from '@/components/dashboard/DatasetView';
import {
  Files, Trash2, Loader2, AlertCircle, RefreshCw,
  FileSpreadsheet, FunctionSquare, MessageSquare,
  Rows3, Columns3, HardDrive, Calendar, X, TriangleAlert,
  Search, Eye
} from 'lucide-react';

const tabTitles = {
  dashboard: 'Dashboard',
  assistant: 'Excel Assistant',
  formula: 'Formula Generator',
  report: 'Report Generation',
  visualization: 'Visualization'
};

function DashboardView() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ totalFormulas: 0, totalCommands: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [previewData, setPreviewData] = useState({ headers: [], rows: [] });
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/file/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data.files || []);
      setStats({ totalFormulas: res.data.totalFormulas || 0, totalCommands: res.data.totalCommands || 0 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleViewFile = async (file) => {
    setIsPreviewLoading(true);
    setViewingFile(file);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/file/preview/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreviewData(res.data.previewData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load file preview');
      setViewingFile(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/file/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('File deleted successfully');
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      toast.error('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const statCards = [
    { label: 'Total Files', value: files.length, icon: Files, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Formulas Generated', value: stats.totalFormulas, icon: FunctionSquare, bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'AI Commands Run', value: stats.totalCommands, icon: MessageSquare, bg: 'bg-sky-50', text: 'text-sky-600' },
  ];

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center shrink-0`}>
              <card.icon className={`w-7 h-7 ${card.text}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Files className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Uploaded Files</h2>
              <p className="text-xs text-slate-400">Manage your datasets</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-full sm:w-48 transition-all"
              />
            </div>
            <button onClick={fetchFiles} disabled={isLoading}
              className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-2 rounded-xl transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Loading your files...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No files uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1">Go to Excel Assistant and upload a dataset to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['File Name', 'Size', 'Rows', 'Columns', 'Uploaded On', 'Action'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 max-w-[200px] truncate" title={file.name}>{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><HardDrive className="w-3.5 h-3.5 text-slate-300" />{file.size}</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Rows3 className="w-3.5 h-3.5 text-slate-300" />{file.rows?.toLocaleString()}</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Columns3 className="w-3.5 h-3.5 text-slate-300" />{file.columns}</div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-sm text-slate-500"><Calendar className="w-3.5 h-3.5 text-slate-300" />{formatDate(file.uploadedAt)}</div></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewFile(file)} disabled={isPreviewLoading}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 px-3 py-2 rounded-xl transition-all disabled:opacity-50">
                          {isPreviewLoading && viewingFile?.id === file.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                          View
                        </button>
                        <button onClick={() => setConfirmId(file.id)} disabled={deletingId === file.id}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-xl transition-all disabled:opacity-50">
                          {deletingId === file.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                <TriangleAlert className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Delete File?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  This will permanently delete the file and all linked AI chat history. This cannot be undone.
                </p>
              </div>
              <button onClick={() => setConfirmId(null)} className="text-slate-400 hover:text-slate-600 ml-auto shrink-0"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => handleDelete(confirmId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset View Modal */}
      <DatasetView
        isOpen={!!viewingFile && !isPreviewLoading}
        onClose={() => setViewingFile(null)}
        fileData={previewData}
        fileName={viewingFile?.name}
      />
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const savedTab = localStorage.getItem('dashboard_activeTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload._id;
          if (userId) {
            const res = await axios.get(`http://localhost:5000/user/getall`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const currentUser = res.data.find(u => u._id === userId);
            if (currentUser) {
              if (currentUser.name) setUserName(currentUser.name);
              if (currentUser.email) setUserEmail(currentUser.email);
            } else {
              if (payload.email) setUserEmail(payload.email);
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse token or fetch user');
      }
    };
    fetchUserDetails();
  }, []);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Not authenticated');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload._id;
      if (!userId) return toast.error('User ID not found');
      toast.loading('Changing password...', { id: 'pwd' });
      await axios.put(`http://localhost:5000/user/update/${userId}`,
        { password: newPassword },
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      toast.success('Password changed successfully!', { id: 'pwd' });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Error changing password', { id: 'pwd' });
    }
  };

  const handleLogout = () => {
    ['token', 'ea_chatHistory', 'ea_fileMeta', 'ea_uploadedFilePath',
      'ea_fileData', 'ea_suggestedCharts', 'viz_fileMeta', 'viz_uploadedFilePath',
      'viz_fileData', 'viz_suggestedCharts', 'viz_dataMode', 'dashboard_activeTab',
      'rg_fileMeta', 'rg_uploadedFilePath', 'rg_fileData', 'rg_reportData',
    ].forEach((key) => localStorage.removeItem(key));
    window.location.href = '/login';
  };

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'assistant': return <ExcelAssistant />;
      case 'formula': return <FormulaGenerator />;
      case 'report': return <ReportGeneration />;
      case 'visualization': return <Visualization />;
      default: return <DashboardView />;
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
        <Sidebar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          localStorage.setItem('dashboard_activeTab', tab);
        }} />

        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <header className="shrink-0 backdrop-blur-xl bg-white/80 border-b border-slate-200 z-30">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 pl-16 md:pl-8">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{tabTitles[activeTab]}</h1>
                <p className="text-xs text-slate-400 mt-0.5">Welcome back — let's work with your data.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group pe-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform uppercase">
                    {userName ? userName.charAt(0) : (userEmail ? userEmail.charAt(0) : 'U')}
                  </div>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="font-bold text-slate-800 text-sm truncate capitalize">{userName || (userEmail ? userEmail.split('@')[0] : 'User Profile')}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail || 'user@exceliq.com'}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={() => setIsPasswordModalOpen(true)}
                          className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition">
                          Change Password
                        </button>
                        <hr className="my-1 border-slate-100" />
                        <button onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-5 md:p-6">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="Enter new password" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="Confirm new password" />
              </div>
              <div className="flex gap-3 mt-6 pt-2">
                <button onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleChangePassword}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}