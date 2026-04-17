'use client';
import { useState, useRef, useCallback } from 'react';
import {
  Upload, FileSpreadsheet, X, CheckCircle2, Loader2,
  AlertCircle, CloudUpload, File, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ACCEPTED_EXTENSIONS = '.xlsx,.xls,.csv';
const ACCEPTED_MIME = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/csv',
];
const MAX_SIZE_MB = 25;

// ─── helper ─────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(name = '') {
  const ext = name.split('.').pop()?.toLowerCase();
  const colors = { xlsx: '#217346', xls: '#1f7244', csv: '#0284c7' };
  return colors[ext] || '#6366f1';
}

// ─── sub-components ──────────────────────────────────────────────────────────
function DropZone({ dragOver, onDragOver, onDragLeave, onDrop, onBrowse, inputRef, onFileChange }) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-[24px] p-12 text-center cursor-pointer transition-all duration-200 outline-none w-full
        ${dragOver 
          ? 'border-indigo-500 bg-indigo-50 scale-[1.015]' 
          : 'border-indigo-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 focus-visible:border-indigo-500 focus-visible:bg-indigo-50'
        }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowse}
      role="button"
      tabIndex={0}
      aria-label="Upload file drop zone"
      onKeyDown={(e) => e.key === 'Enter' && onBrowse()}
    >
      <input
        ref={inputRef}
        id="fu-file-input"
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex flex-col items-center gap-4">
        {/* icon cluster */}
        <div className={`relative w-[72px] h-[72px] flex items-center justify-center transition-transform duration-300 ${dragOver ? '-translate-y-2' : ''}`}>
          {/* using border opacity to simulate the rings */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-indigo-400/50 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-indigo-400/30 animate-pulse" />
          <CloudUpload className="relative z-10 w-8 h-8 text-indigo-500" />
        </div>

        <div className="text-center">
          <p className="text-[15px] font-semibold text-slate-800 leading-relaxed">
            {dragOver ? 'Release to upload' : (
              <>Drop your spreadsheet here or <span className="text-indigo-500 underline underline-offset-2">browse</span></>
            )}
          </p>
          <p className="text-xs text-slate-400 mt-1">CSV, XLSX, XLS &bull; Max {MAX_SIZE_MB} MB</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['CSV', 'XLSX', 'XLS'].map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 tracking-wider">
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file, status, progress, onRemove, onUpload, uploading, sizeDisplay }) {
  const iconColor = getFileIcon(file.name);
  const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <div className="relative bg-white border-[1.5px] border-slate-200 rounded-[20px] p-5 shadow-[0_2px_12px_0_rgba(99,102,241,0.08)] overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_20px_0_rgba(99,102,241,0.14)] w-full">
      {/* glow bar that fills based on progress */}
      {status === 'uploading' && (
        <div className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-400 rounded-t-[3px] transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
      )}

      <div className="flex items-center gap-3.5">
        {/* file type badge */}
        <div 
          className="w-[46px] h-[46px] rounded-[14px] border-[1.5px] flex flex-col items-center justify-center gap-[1px] shrink-0" 
          style={{ backgroundColor: `${iconColor}15`, borderColor: `${iconColor}40` }}
        >
          <FileSpreadsheet className="w-[18px] h-[18px]" style={{ color: iconColor }} />
          <span className="text-[8px] font-extrabold tracking-[0.06em]" style={{ color: iconColor }}>{ext}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis" title={file.name}>{file.name}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{sizeDisplay || formatBytes(file.size)}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {status === 'idle' && (
            <button
              id="fu-upload-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-150 border-none bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              onClick={onUpload}
              disabled={uploading}
            >
              <Upload size={14} /> Upload
            </button>
          )}
          {status === 'uploading' && (
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed transition-all duration-150 border-none bg-slate-100 text-slate-500" disabled>
              <Loader2 size={14} className="animate-spin" /> {progress}%
            </button>
          )}
          {status === 'done' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
              <CheckCircle2 size={15} /> Uploaded
            </span>
          )}
          {status === 'error' && (
            <button
              id="fu-retry-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-150 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
              onClick={onUpload}
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}

          <button
            id="fu-remove-btn"
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent text-slate-400 border-[1.5px] border-slate-200 cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
            onClick={onRemove}
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* status strip */}
      <div className={`mt-3.5 px-3 py-2.5 rounded-lg text-xs font-medium inline-flex items-center w-full gap-1.5
        ${status === 'idle' ? 'bg-slate-50 text-slate-500' : ''}
        ${status === 'uploading' ? 'bg-indigo-50 text-indigo-500' : ''}
        ${status === 'done' ? 'bg-emerald-50 text-emerald-500' : ''}
        ${status === 'error' ? 'bg-red-50 text-red-500' : ''}
      `}>
        {status === 'idle' && <><AlertCircle size={12} /> Ready to upload</>}
        {status === 'uploading' && <><Loader2 size={12} className="animate-spin" /> Uploading &amp; parsing data…</>}
        {status === 'done' && <><CheckCircle2 size={12} /> Data ready — start asking questions!</>}
        {status === 'error' && <><AlertCircle size={12} /> Upload failed. Click Retry.</>}
      </div>
    </div>
  );
}

// ─── main component
export default function FileUpload({ onUploadSuccess, onFileRemoved, persistedFileMeta = null, className = '' }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  // ── validation ──────────────────────────────────────────────────────────
  const validate = useCallback((f) => {
    if (!f) return false;
    const sizeMB = f.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      toast.error(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
      return false;
    }
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      toast.error('Unsupported file type. Use CSV, XLSX or XLS.');
      return false;
    }
    return true;
  }, []);

  // ── drag events ─────────────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (validate(dropped)) { setFile(dropped); setStatus('idle'); setProgress(0); }
  };
  const handleBrowse = () => inputRef.current?.click();
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (validate(selected)) { setFile(selected); setStatus('idle'); setProgress(0); }
    // reset so same file can be re-selected
    e.target.value = '';
  };

  // ── remove ──────────────────────────────────────────────────────────────
  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    onFileRemoved?.();
  };

  // ── upload ──────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('excelFile', file);

    setStatus('uploading');
    setProgress(0);
    const toastId = toast.loading('Uploading and analysing…');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded / evt.total) * 95));
          }
        },
      });

      setProgress(100);
      setStatus('done');
      toast.success('File uploaded successfully!', { id: toastId });
      onUploadSuccess?.(res.data);
    } catch (err) {
      setStatus('error');
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };

  // ── Restored state when no real File object but fileMeta available ──────
  const displayFile = file || (persistedFileMeta ? { name: persistedFileMeta.name, size: 0 } : null);
  const displayStatus = file ? status : (persistedFileMeta ? 'done' : 'idle');
  const displaySizeLabel = !file && persistedFileMeta ? persistedFileMeta.size : null;

  return (
    <div className={`w-full font-sans ${className}`}>
      {!displayFile ? (
        <DropZone
          dragOver={dragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBrowse={handleBrowse}
          inputRef={inputRef}
          onFileChange={handleFileChange}
        />
      ) : (
        <FileCard
          file={displayFile}
          status={displayStatus}
          progress={progress}
          uploading={displayStatus === 'uploading'}
          sizeDisplay={displaySizeLabel}
          onRemove={handleRemove}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}


