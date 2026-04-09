'use client';
import { useState, useRef } from 'react';
import { Sparkles, Upload, Shield, Bot, Send, Table, Loader2, User, FileSpreadsheet, HardDrive, Rows3, Columns3, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ExcelAssistant() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  

  const [dragOver, setDragOver] = useState(false); // Fixes the ReferenceError
  const [cleaningStatus, setCleaningStatus] = useState('idle'); // Needed for the status badges
  const inputRef = useRef(null); // Fixes the click handler
  const ACCEPTED = ".xlsx,.xls,.csv"; 

  // --- NEW MISSING FUNCTIONS ADDED ---
  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
// Function for the onDrop handler
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };
//function for removeFile
  const removeFile = () => {
    setFile(null);
    setFileMeta(null);
    setUploadedFilePath(null);
    setCleaningStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");

    const formData = new FormData();
    formData.append('excelFile', file);

    setUploading(true);
    setCleaningStatus('cleaning'); // Trigger cleaning UI
    const toastId = toast.loading("Uploading and analyzing...");

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("File uploaded successfully!", { id: toastId });
      setFileMeta(res.data.fileMeta);
      setUploadedFilePath(res.data.path);
      setCleaningStatus('ready'); // Update status UI
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
      setCleaningStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentQuery.trim()) return;
    if (!uploadedFilePath) return toast.error("Please upload a file first!");

    setChatHistory(prev => [...prev, { role: 'user', content: currentQuery }]);
    setCurrentQuery('');
    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/chat/query', 
        { query: currentQuery, file: uploadedFilePath },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
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
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          
          {/* --- NEW UPLOAD ZONE --- */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-400'}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    Drop your spreadsheet here or{' '}
                    <span className="text-indigo-600">browse</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Supports CSV, XLSX, XLS • Max 25 MB
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
                  <Shield className="w-3.5 h-3.5" />
                  Secure File Upload — End-to-End Encrypted
                </div>
              </div>
            </div>
          ) : (
            /* --- FILE LOADED STATE --- */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{file.name}</p>
                    <p className="text-xs text-slate-400">Ready to upload</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!uploadedFilePath && (
                    <button 
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Confirm"}
                    </button>
                  )}
                  <button
                    onClick={removeFile}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition border border-slate-200 hover:border-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cleaning status */}
              <div className="mt-4">
                {cleaningStatus === 'cleaning' && (
                  <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Status: Uploading & Parsing Data...
                  </div>
                )}
                {cleaningStatus === 'ready' && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                    Status: Data Ready ✓
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- CHAT BOX --- */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
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

        {/* --- FILE METADATA PANEL --- */}
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
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]" title={item.value}>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No file uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 