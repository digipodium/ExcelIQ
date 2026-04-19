'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Files, Trash2, Loader2, AlertCircle, RefreshCw,
  FileSpreadsheet, FunctionSquare, MessageSquare,
  Rows3, Columns3, HardDrive, Calendar, X, TriangleAlert
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ totalFormulas: 0, totalCommands: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/file/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data.files || []);
      setStats({
        totalFormulas: res.data.totalFormulas || 0,
        totalCommands: res.data.totalCommands || 0
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

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
      console.error(err);
      toast.error('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statCards = [
    {
      label: 'Total Files',
      value: files.length,
      icon: Files,
      gradient: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    {
      label: 'Formulas Generated',
      value: stats.totalFormulas,
      icon: FunctionSquare,
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600'
    },
    {
      label: 'AI Commands Run',
      value: stats.totalCommands,
      icon: MessageSquare,
      gradient: 'from-sky-500 to-blue-600',
      bg: 'bg-sky-50',
      text: 'text-sky-600'
    },
  ];

  return (
    <div className="space-y-6">

      {/* Stats Bar */}
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Files className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Uploaded Files</h2>
              <p className="text-xs text-slate-400">Manage your datasets</p>
            </div>
          </div>
          <button
            onClick={fetchFiles}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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
                    <th key={h} className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-600 w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 max-w-[200px] truncate" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <HardDrive className="w-3.5 h-3.5 text-slate-300" />
                        {file.size}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Rows3 className="w-3.5 h-3.5 text-slate-300" />
                        {file.rows?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Columns3 className="w-3.5 h-3.5 text-slate-300" />
                        {file.columns}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {formatDate(file.uploadedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setConfirmId(file.id)}
                        disabled={deletingId === file.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                      >
                        {deletingId === file.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                        Delete
                      </button>
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
                  This will permanently delete the file, its data from storage, and all linked AI chat history. This action cannot be undone.
                </p>
              </div>
              <button onClick={() => setConfirmId(null)} className="text-slate-400 hover:text-slate-600 ml-auto shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
