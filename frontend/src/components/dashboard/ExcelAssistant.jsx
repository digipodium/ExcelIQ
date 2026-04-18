'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Table, Loader2, User, FileSpreadsheet, HardDrive, Rows3, Columns3, AlertCircle, Eye, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatasetView from './DatasetView';
import FileUpload from './FileUpload';

// localStorage 
const safeGetItem = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};
export default function ExcelAssistant() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fileData, setFileData] = useState({ headers: [], rows: [] });
  const [isDownloading, setIsDownloading] = useState(false);
  const chatEndRef = useRef(null);

  // Prevents the persistence effect from writing null to localStorage during the
  // brief window when ExcelAssistant mounts before the tab switches away.
  const isHydrated = useRef(false);

  // Load persisted state from localStorage on first client render.
  useEffect(() => {
    setChatHistory(safeGetItem('ea_chatHistory', []));
    setFileMeta(safeGetItem('ea_fileMeta', null));
    setUploadedFilePath(safeGetItem('ea_uploadedFilePath', null));
    setFileData(safeGetItem('ea_fileData', { headers: [], rows: [] }));
    isHydrated.current = true;
  }, []);

  // Persist chat history whenever it changes.
  useEffect(() => {
    try { localStorage.setItem('ea_chatHistory', JSON.stringify(chatHistory)); }
    catch { /* storage quota exceeded */ }
  }, [chatHistory]);

  // Persist file-related state, but only after the initial hydration load.
  // Skipping before hydration prevents overwriting valid data with null defaults.
  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      if (fileMeta !== null) {
        localStorage.setItem('ea_fileMeta', JSON.stringify(fileMeta));
        localStorage.setItem('ea_uploadedFilePath', JSON.stringify(uploadedFilePath));
        localStorage.setItem('ea_fileData', JSON.stringify(fileData));
      }
    } catch { /* storage quota exceeded */ }
  }, [fileMeta, uploadedFilePath, fileData]);

  const handleUploadSuccess = (data) => {
    setFileMeta(data.fileMeta);
    setUploadedFilePath(data.path);
    if (data.previewData) setFileData(data.previewData);
    if (data.suggestedCharts) {
      try { localStorage.setItem('ea_suggestedCharts', JSON.stringify(data.suggestedCharts)); }
      catch { /* storage quota exceeded */ }
    }
  };

  // Clear all state and localStorage keys when the user removes the uploaded file.
  const handleFileRemoved = () => {
    setFileMeta(null);
    setUploadedFilePath(null);
    setFileData({ headers: [], rows: [] });
    setChatHistory([]);
    setIsPreviewOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ea_fileMeta');
      localStorage.removeItem('ea_uploadedFilePath');
      localStorage.removeItem('ea_fileData');
      localStorage.removeItem('ea_chatHistory');
      localStorage.removeItem('ea_suggestedCharts');
    }
  };

  // ── FUNCTION: DOWNLOAD DATA (For the blue button in Sidebar) ──
  const handleDownloadData = async () => {
    const currentFileId = fileMeta?.id;
    if (!currentFileId) {
      toast.error("File ID is missing! Please upload the file again.");
      return;
    }

    const token = localStorage.getItem('token');
    const toastId = toast.loading('Starting download...');
    setIsDownloading(true);

    try {
      const response = await axios.get(`http://localhost:5000/file/download/${currentFileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileMeta?.name || 'dataset.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error("Download Error:", error);
      toast.error('Failed to download file. Please try again.', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentQuery.trim()) return;
    if (!uploadedFilePath) return toast.error("Please upload a file first!");

    setChatHistory(prev => [...prev, { role: 'user', content: currentQuery }]);
    const queryToSend = currentQuery;
    setCurrentQuery('');
    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/chat/query',
        { query: queryToSend, file: uploadedFilePath, fileId: fileMeta?.id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsAnalyzing(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="flex-1 min-h-0 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">

          {/* ── FILE UPLOAD COMPONENT ── */}
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onFileRemoved={handleFileRemoved}
            persistedFileMeta={fileMeta}
          />

          {/* Chat box grows to fill remaining height in the column */}
          <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4"><Bot className="text-indigo-600" /></div>
                  <p className="text-slate-500 font-medium max-w-sm text-sm">Upload a dataset then ask me things like "What is the average sales volume for Q3?"</p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-700" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isAnalyzing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 text-slate-700"><Bot className="w-4 h-4" /></div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <p className="text-sm">Analyzing data...</p>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t bg-white flex gap-3 items-center">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-700 transition-all"
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                className={`p-3 rounded-xl transition-all ${isAnalyzing || !currentQuery.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                onClick={handleSendMessage}
                disabled={isAnalyzing || !currentQuery.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar: file metadata and dataset preview */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-600" />
              File Details
            </h3>
            {fileMeta ? (
              <div className="space-y-3">
                {[
                  { icon: FileSpreadsheet, label: 'File Name', value: fileMeta.name },
                  { icon: HardDrive, label: 'Size', value: fileMeta.size },
                  { icon: Rows3, label: 'Total Rows', value: fileMeta.rows },
                  { icon: Columns3, label: 'Columns', value: fileMeta.columns },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]" title={item.value}>{item.value}</span>
                  </div>
                ))}

                <button
                  onClick={handleDownloadData}
                  disabled={isDownloading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isDownloading ? 'Downloading...' : 'Download Data'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No file uploaded yet</p>
              </div>
            )}
          </div>

          {/* DATASET PREVIEW BOX */}
          {fileMeta && (
            <div
              onClick={() => setIsPreviewOpen(true)}
              className="bg-white border border-indigo-200 rounded-3xl p-5 shadow-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group overflow-hidden relative"
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dataset Preview</h3>
                  <p className="text-xs text-slate-500 mt-1">Click to explore entire data</p>
                </div>
              </div>

              <div className="relative mt-2 border border-slate-100 rounded-xl overflow-hidden bg-white/50 opacity-80 group-hover:opacity-100 transition-opacity">
                <table className="w-full text-left whitespace-nowrap table-fixed">
                  <thead className="bg-slate-50">
                    <tr>
                      {fileData.headers.slice(0, 4).map((header, idx) => (
                        <th key={idx} className="py-1.5 px-2 text-[9px] font-semibold text-slate-500 border-b border-slate-100 truncate">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {fileData.rows.slice(0, 5).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {fileData.headers.slice(0, 4).map((_, colIdx) => (
                          <td key={colIdx} className="py-1.5 px-2 text-[9px] text-slate-400 truncate">
                            {row[colIdx]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fileData.rows.length > 5 && (
                  <div className="text-center py-1.5 bg-gradient-to-t from-white to-transparent text-[9px] text-slate-400 font-medium pb-2">
                    ...and {fileData.rows.length - 5} more rows
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <DatasetView
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileData={fileData}
        fileName={fileMeta?.name}
      />
    </div>
  );
}
