'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader2, Table, FileSpreadsheet, HardDrive, Rows3, Columns3, AlertCircle, Eye, Download, FileText, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';
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

export default function ReportGeneration() {
  const [fileMeta, setFileMeta] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [fileData, setFileData] = useState({ headers: [], rows: [] });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isHydrated = useRef(false);

  useEffect(() => {
    setFileMeta(safeGetItem('rg_fileMeta', null));
    setUploadedFilePath(safeGetItem('rg_uploadedFilePath', null));
    setFileData(safeGetItem('rg_fileData', { headers: [], rows: [] }));
    setReportData(safeGetItem('rg_reportData', null));
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      if (fileMeta !== null) {
        localStorage.setItem('rg_fileMeta', JSON.stringify(fileMeta));
        localStorage.setItem('rg_uploadedFilePath', JSON.stringify(uploadedFilePath));
        localStorage.setItem('rg_fileData', JSON.stringify(fileData));
      }
      if (reportData !== null) {
        localStorage.setItem('rg_reportData', JSON.stringify(reportData));
      }
    } catch { /* ignore */ }
  }, [fileMeta, uploadedFilePath, fileData, reportData]);

  const handleUploadSuccess = async (data) => {
    setFileMeta(data.fileMeta);
    setUploadedFilePath(data.path);
    if (data.previewData) setFileData(data.previewData);
    
    // Automatically generate report
    generateReport(data.fileMeta.id, data.path);
  };

  const handleFileRemoved = () => {
    setFileMeta(null);
    setUploadedFilePath(null);
    setFileData({ headers: [], rows: [] });
    setReportData(null);
    setIsPreviewOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rg_fileMeta');
      localStorage.removeItem('rg_uploadedFilePath');
      localStorage.removeItem('rg_fileData');
      localStorage.removeItem('rg_reportData');
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

  const generateReport = async (fileId, filePath) => {
    setIsGenerating(true);
    setReportData(null);
    const toastId = toast.loading('Analyzing data and generating report...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/generate-report',
        { fileId, filePath },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (res.data.report) {
         setReportData(res.data.report);
         toast.success('Report generated successfully!', { id: toastId });
      } else {
         toast.error('Failed to generate report output', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="flex-1 min-h-0 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onFileRemoved={handleFileRemoved}
            persistedFileMeta={fileMeta}
          />

          <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                  <p className="text-slate-600 font-semibold text-lg">Generating Professional Report...</p>
                  <p className="text-slate-400 text-sm max-w-sm">Our AI is analyzing your dataset to produce executive summaries, key findings, and recommendations.</p>
                </div>
              ) : reportData ? (
                <div className="space-y-8 animate-in fade-in duration-500 pb-10">
                  {/* Title Area */}
                  <div className="pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                         <FileText className="w-5 h-5" />
                       </div>
                       <h2 className="text-2xl font-bold text-slate-800">{reportData.title || "Data Analysis Report"}</h2>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  {reportData.executiveSummary && (
                    <div className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        Executive Summary
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {reportData.executiveSummary}
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Findings */}
                    {reportData.keyFindings && reportData.keyFindings.length > 0 && (
                      <div className="bg-emerald-50 border text-left border-emerald-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Key Findings
                        </h3>
                        <ul className="space-y-3">
                          {reportData.keyFindings.map((finding, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-emerald-900">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trends & Anomalies */}
                    {reportData.trendsAndAnomalies && reportData.trendsAndAnomalies.length > 0 && (
                      <div className="bg-amber-50 border text-left border-amber-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-amber-600" />
                          Trends & Anomalies
                        </h3>
                        <ul className="space-y-3">
                          {reportData.trendsAndAnomalies.map((trend, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-amber-900">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {reportData.recommendations && reportData.recommendations.length > 0 && (
                    <div className="bg-indigo-50 border text-left border-indigo-100 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-indigo-600" />
                        Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {reportData.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-indigo-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center mb-4"><FileText className="w-8 h-8 text-indigo-600" /></div>
                  <h3 className="text-slate-800 font-bold text-lg mb-2">No Report Found</h3>
                  <p className="text-slate-500 font-medium max-w-sm text-sm">Upload a dataset, and we'll analyze it to generate a comprehensive AI-driven business report.</p>
                </div>
              )}
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