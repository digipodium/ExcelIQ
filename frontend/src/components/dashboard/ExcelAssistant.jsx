'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Table, Loader2, User, FileSpreadsheet, HardDrive, Rows3, Columns3, AlertCircle, Eye, Download, Wrench, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatasetView from './DatasetView';
import FileUpload from './FileUpload';

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

  const [cleaningSuggestions, setCleaningSuggestions] = useState(null);
  const [isCleaningAnalyzing, setIsCleaningAnalyzing] = useState(false);
  const [executingIdx, setExecutingIdx] = useState(null);
  const [showCleaningList, setShowCleaningList] = useState(false);
  const [appliedIndices, setAppliedIndices] = useState([]);

  const chatEndRef = useRef(null);
  const isHydrated = useRef(false);

  useEffect(() => {
    setChatHistory(safeGetItem('ea_chatHistory', []));
    setFileMeta(safeGetItem('ea_fileMeta', null));
    setUploadedFilePath(safeGetItem('ea_uploadedFilePath', null));
    setFileData(safeGetItem('ea_fileData', { headers: [], rows: [] }));
    setCleaningSuggestions(safeGetItem('ea_cleaningSuggestions', null));
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    try { localStorage.setItem('ea_chatHistory', JSON.stringify(chatHistory)); } catch { }
  }, [chatHistory]);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      if (fileMeta !== null) {
        localStorage.setItem('ea_fileMeta', JSON.stringify(fileMeta));
        localStorage.setItem('ea_uploadedFilePath', JSON.stringify(uploadedFilePath));
        localStorage.setItem('ea_fileData', JSON.stringify(fileData));
      }
      if (cleaningSuggestions !== null) {
        localStorage.setItem('ea_cleaningSuggestions', JSON.stringify(cleaningSuggestions));
      }
    } catch { /* ignore */ }
  }, [fileMeta, uploadedFilePath, fileData, cleaningSuggestions]);

  const handleUploadSuccess = (data) => {
    setFileMeta(data.fileMeta);
    setUploadedFilePath(data.path);
    console.log(data);

    if (data.previewData) setFileData(data.previewData);
    setAppliedIndices([]);
    fetchCleaningSuggestions(data.fileMeta.id, data.path);
  };

  const fetchCleaningSuggestions = async (fileId, filePath) => {
    setIsCleaningAnalyzing(true);
    setCleaningSuggestions(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/suggest-cleaning',
        { fileId, filePath },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.data.suggestions) {
        setCleaningSuggestions(res.data.suggestions);
        try { localStorage.setItem('ea_cleaningSuggestions', JSON.stringify(res.data.suggestions)); } catch { }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data cleaning suggestions from endpoint.");
    } finally {
      setIsCleaningAnalyzing(false);
    }
  };

  const handleFileRemoved = () => {
    setFileMeta(null);
    setUploadedFilePath(null);
    setFileData({ headers: [], rows: [] });
    setChatHistory([]);
    setCleaningSuggestions(null);
    setAppliedIndices([]);
    setIsPreviewOpen(false);
    setShowCleaningList(false);

    if (typeof window !== 'undefined') {
      [
        'ea_fileMeta', 'ea_uploadedFilePath', 'ea_fileData',
        'ea_chatHistory', 'ea_suggestedCharts', 'ea_cleaningSuggestions'
      ].forEach(k => localStorage.removeItem(k));
    }
  };

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

      if (res.data.isModified) {
        setFileData(res.data.previewData);
        if (res.data.newMeta) {
          setFileMeta(prev => ({
            ...prev,
            name: res.data.newMeta.name || prev?.name,
            size: res.data.newMeta.size || prev?.size,
            rows: res.data.newMeta.rows,
            columns: res.data.newMeta.columns
          }));
        }
        toast.success("Dataset successfully modified!");
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsAnalyzing(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExecuteCleaning = async (suggestion, index) => {
    setExecutingIdx(index);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/execute-cleaning',
        { fileId: fileMeta?.id, filePath: uploadedFilePath, suggestion },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.data.success) {
        setFileData(res.data.previewData);
        if (res.data.newMeta) {
          setFileMeta(prev => ({
            ...prev,
            name: res.data.newMeta.name || prev?.name,
            size: res.data.newMeta.size || prev?.size,
            rows: res.data.newMeta.rows,
            columns: res.data.newMeta.columns
          }));
        }
        toast.success("Data cleaning applied successfully!");
        setAppliedIndices(prev => [...prev, index]);
      } else {
        toast.error(res.data.message || "Execution returned an error");
      }
    } catch (error) {
      console.error("Execution error", error);
      toast.error("Failed to execute data cleaning step.");
    } finally {
      setExecutingIdx(null);
    }
  };

  return (
    <div className="h-auto lg:h-full flex flex-col gap-5">
      <div className="flex-1 min-h-0 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">

          <div className="flex gap-2 sm:gap-4 items-stretch">
            <div className="flex-1 min-w-0">
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onFileRemoved={handleFileRemoved}
                persistedFileMeta={fileMeta}
              />
            </div>

            {/* Right aligned Data Cleaning button (Displays only after upload) */}
            {fileMeta && (
              <div className="relative shrink-0 w-20 sm:w-28 z-20">
                <button
                  onClick={() => setShowCleaningList(!showCleaningList)}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-2 h-full w-full py-2 sm:py-0 rounded-2xl sm:rounded-[20px] border-[1.5px] font-bold transition-all ${showCleaningList ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 shadow-sm hover:shadow-md'}`}
                >
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-[9px] sm:text-[11px] leading-tight text-center">Data<br />Cleaning</span>
                  {cleaningSuggestions?.length > 0 && (cleaningSuggestions.length - appliedIndices.length) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 sm:text-[10px] sm:w-6 sm:h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {cleaningSuggestions.length - appliedIndices.length}
                    </span>
                  )}
                </button>

                {/* Popout List */}
                {showCleaningList && (
                  <div className="absolute top-[calc(100%+12px)] right-0 sm:right-auto sm:left-0 w-[calc(100vw-3rem)] sm:w-[420px] max-w-[420px] z-[60] bg-white border border-rose-200 rounded-3xl p-5 shadow-[0_20px_60px_-10px_rgba(225,29,72,0.25)] flex flex-col max-h-[500px] overflow-hidden">
                    <div className="flex items-center gap-3 mb-4 text-rose-700 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-rose-600" />
                      </div>
                      <h3 className="text-sm font-bold">Data Cleaning Suggestions</h3>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {isCleaningAnalyzing ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          AI is inspecting dataset quality...
                        </div>
                      ) : cleaningSuggestions && cleaningSuggestions.length > 0 ? (
                        <ul className="space-y-3">
                          {cleaningSuggestions.map((sug, i) => {
                            const isApplied = appliedIndices.includes(i);
                            return (
                              <li key={i} className="flex flex-col gap-3 text-xs text-slate-700 bg-rose-50/50 p-4 rounded-xl border border-rose-100 font-medium">
                                <p className="leading-relaxed">{sug}</p>
                                {isApplied ? (
                                  <button disabled className="flex items-center justify-center gap-2 self-start bg-emerald-50 border border-emerald-200 text-emerald-600 py-1.5 px-4 rounded-lg font-bold shadow-sm opacity-100 cursor-not-allowed transition-all">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleExecuteCleaning(sug, i)}
                                    disabled={executingIdx !== null}
                                    className="flex items-center justify-center gap-2 self-start bg-white border border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 py-1.5 px-4 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {executingIdx === i ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />}
                                    {executingIdx === i ? 'Applying...' : 'Apply'}
                                  </button>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <div className="py-2">
                          <p className="text-sm text-slate-500">Your data looks clean! No immediate issues detected.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Dataset Preview Button (Displays only on mobile) */}
            {fileMeta && (
              <div className="shrink-0 w-20 sm:hidden z-20">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className={`flex flex-col items-center justify-center gap-1 h-full w-full py-2 rounded-2xl border-[1.5px] font-bold bg-white border-indigo-200 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm transition-all`}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-[9px] leading-tight text-center">Data<br />Preview</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[450px] lg:min-h-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
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

        {/* Right sidebar */}
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
              className="hidden sm:block bg-white border border-indigo-200 rounded-3xl p-5 shadow-sm cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group overflow-hidden relative"
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
