'use client';
import { useState } from 'react';
import { Sparkles, Upload, Shield, Bot, Send, Table } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ExcelAssistant() {
  const [file, setFile] = useState(null); // State to store the selected file
  const [uploading, setUploading] = useState(false); // State to manage loading UI

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capturing the file from the browser input
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first"); // Validation check

    const formData = new FormData(); // Creating FormData to handle binary file transmission
    formData.append('excelFile', file); // This key must match your Multer backend config

    setUploading(true);
    const toastId = toast.loading("Uploading and analyzing...");

    try {
      const token = localStorage.getItem('token'); // Retrieving JWT for the userAuth middleware
      const res = await axios.post('http://localhost:5000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for Multer to parse the request
          'Authorization': `Bearer ${token}` // Passing authentication token
        }
      });

      toast.success("File uploaded successfully!", { id: toastId });
      console.log("Uploaded File Path:", res.data.path); // Logging backend response
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Sparkles className="text-white w-6 h-6" /></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Excel Assistant</h2>
          <p className="text-sm text-slate-500">Ask anything about your data in plain English.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Dropzone with hidden file input */}
          <div className="border-2 border-dashed rounded-3xl p-12 text-center border-slate-200 bg-white hover:border-indigo-400 transition-all">
            <label className="flex flex-col items-center gap-4 cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center"><Upload className="w-8 h-8 text-indigo-600" /></div>
              <p className="font-semibold text-slate-800 text-lg">
                {file ? file.name : "Drop your file here or browse"}
              </p>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileChange} 
              />
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Secure & Encrypted</span>
            </label>
            
            {file && (
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="mt-6 px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {uploading ? "Analyzing..." : "Confirm Upload"}
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px]">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4"><Bot className="text-indigo-600" /></div>
              <p className="text-slate-600 font-medium">Ready to analyze your data</p>
            </div>
            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <input type="text" placeholder="Type your question..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none" />
              <button className="bg-indigo-600 text-white p-3 rounded-xl"><Send size={18} /></button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Table size={18} className="text-indigo-600" /> File Details</h3>
          <p className="text-center py-6 text-slate-400 text-sm italic">{file ? `Size: ${(file.size / 1024).toFixed(2)} KB` : "No file uploaded"}</p>
        </div>
      </div>
    </div>
  );
}