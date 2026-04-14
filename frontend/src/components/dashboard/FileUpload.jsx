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
      className={`fu-dropzone ${dragOver ? 'fu-dropzone--active' : ''}`}
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
        className="fu-hidden"
        onChange={onFileChange}
      />

      <div className="fu-dropzone__inner">
        {/* animated cloud icon */}
        <div className={`fu-upload-icon ${dragOver ? 'fu-upload-icon--float' : ''}`}>
          <div className="fu-upload-icon__ring fu-upload-icon__ring--1" />
          <div className="fu-upload-icon__ring fu-upload-icon__ring--2" />
          <CloudUpload className="fu-upload-icon__svg" />
        </div>

        <div className="fu-dropzone__text">
          <p className="fu-dropzone__headline">
            {dragOver ? 'Release to upload' : (
              <>Drop your spreadsheet here or <span className="fu-link">browse</span></>
            )}
          </p>
          <p className="fu-dropzone__sub">CSV, XLSX, XLS &bull; Max {MAX_SIZE_MB} MB</p>
        </div>

        <div className="fu-badge-row">
          {['CSV', 'XLSX', 'XLS'].map((fmt) => (
            <span key={fmt} className="fu-badge">{fmt}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file, status, progress, onRemove, onUpload, uploading }) {
  const iconColor = getFileIcon(file.name);
  const ext = file.name.split('.').pop()?.toUpperCase();

  return (
    <div className="fu-card">
      {/* glow bar that fills based on progress */}
      {status === 'uploading' && (
        <div className="fu-progress-bar" style={{ width: `${progress}%` }} />
      )}

      <div className="fu-card__top">
        {/* file type badge */}
        <div className="fu-file-badge" style={{ '--badge-color': iconColor }}>
          <FileSpreadsheet className="fu-file-badge__icon" />
          <span className="fu-file-badge__ext">{ext}</span>
        </div>

        <div className="fu-card__info">
          <p className="fu-card__name" title={file.name}>{file.name}</p>
          <p className="fu-card__meta">{formatBytes(file.size)}</p>
        </div>

        <div className="fu-card__actions">
          {status === 'idle' && (
            <button
              id="fu-upload-btn"
              className="fu-btn fu-btn--primary"
              onClick={onUpload}
              disabled={uploading}
            >
              <Upload size={14} /> Upload
            </button>
          )}
          {status === 'uploading' && (
            <button className="fu-btn fu-btn--ghost" disabled>
              <Loader2 size={14} className="fu-spin" /> {progress}%
            </button>
          )}
          {status === 'done' && (
            <span className="fu-status fu-status--done">
              <CheckCircle2 size={15} /> Uploaded
            </span>
          )}
          {status === 'error' && (
            <button
              id="fu-retry-btn"
              className="fu-btn fu-btn--danger"
              onClick={onUpload}
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}

          <button
            id="fu-remove-btn"
            className="fu-close-btn"
            onClick={onRemove}
            aria-label="Remove file"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* status strip */}
      <div className="fu-card__strip">
        {status === 'idle' && (
          <span className="fu-strip fu-strip--idle">
            <AlertCircle size={12} /> Ready to upload
          </span>
        )}
        {status === 'uploading' && (
          <span className="fu-strip fu-strip--uploading">
            <Loader2 size={12} className="fu-spin" /> Uploading &amp; parsing data…
          </span>
        )}
        {status === 'done' && (
          <span className="fu-strip fu-strip--done">
            <CheckCircle2 size={12} /> Data ready — start asking questions!
          </span>
        )}
        {status === 'error' && (
          <span className="fu-strip fu-strip--error">
            <AlertCircle size={12} /> Upload failed. Click Retry.
          </span>
        )}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
/**
 * FileUpload
 *
 * Props:
 *  onUploadSuccess(data)  – called with the backend response once upload succeeds.
 *                           data = { fileMeta, path, previewData }
 *  onFileRemoved()        – called when the user discards the file.
 *  className              – optional extra class on the root wrapper.
 */
export default function FileUpload({ onUploadSuccess, onFileRemoved, className = '' }) {
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

  return (
    <>
      <style>{CSS}</style>
      <div className={`fu-root ${className}`}>
        {!file ? (
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
            file={file}
            status={status}
            progress={progress}
            uploading={status === 'uploading'}
            onRemove={handleRemove}
            onUpload={handleUpload}
          />
        )}
      </div>
    </>
  );
}

// ─── scoped CSS ──────────────────────────────────────────────────────────────
const CSS = `
/* ── root ── */
.fu-root { width: 100%; font-family: inherit; }
.fu-hidden { display: none; }

/* ── drop zone ── */
.fu-dropzone {
  position: relative;
  border: 2px dashed #c7d2fe;
  border-radius: 24px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  background: #ffffff;
  transition: border-color .2s, background .2s, transform .15s;
  outline: none;
}
.fu-dropzone:hover,
.fu-dropzone:focus-visible {
  border-color: #6366f1;
  background: #eef2ff;
}
.fu-dropzone--active {
  border-color: #6366f1;
  background: #eef2ff;
  transform: scale(1.015);
}
.fu-dropzone__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* ── animated upload icon ── */
.fu-upload-icon {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .3s;
}
.fu-upload-icon--float {
  animation: fu-float .8s ease-in-out infinite alternate;
}
@keyframes fu-float {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}
.fu-upload-icon__svg {
  width: 32px;
  height: 32px;
  color: #6366f1;
  position: relative;
  z-index: 1;
}
.fu-upload-icon__ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid #818cf8;
  opacity: .5;
}
.fu-upload-icon__ring--1 {
  inset: 0;
  animation: fu-pulse 2s ease-in-out infinite;
}
.fu-upload-icon__ring--2 {
  inset: -10px;
  animation: fu-pulse 2s ease-in-out infinite .5s;
}
@keyframes fu-pulse {
  0%, 100% { opacity: .5; transform: scale(1); }
  50%       { opacity: .15; transform: scale(1.12); }
}

/* ── drop zone text ── */
.fu-dropzone__headline {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}
.fu-dropzone__sub {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}
.fu-link { color: #6366f1; text-decoration: underline; text-underline-offset: 2px; }

/* ── format badges ── */
.fu-badge-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.fu-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #e0e7ff;
  color: #4338ca;
  letter-spacing: .04em;
}

/* ── file card ── */
.fu-card {
  position: relative;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(99,102,241,.08);
  overflow: hidden;
  transition: box-shadow .2s;
}
.fu-card:hover { box-shadow: 0 4px 20px 0 rgba(99,102,241,.14); }

/* progress glow bar at top of card */
.fu-progress-bar {
  position: absolute;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 3px 3px 0 0;
  transition: width .3s ease;
}

.fu-card__top {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* file type badge */
.fu-file-badge {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--badge-color) 12%, #fff);
  border: 1.5px solid color-mix(in srgb, var(--badge-color) 25%, #fff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  flex-shrink: 0;
}
.fu-file-badge__icon {
  width: 18px;
  height: 18px;
  color: var(--badge-color);
}
.fu-file-badge__ext {
  font-size: 8px;
  font-weight: 800;
  color: var(--badge-color);
  letter-spacing: .06em;
}

.fu-card__info { flex: 1; min-width: 0; }
.fu-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fu-card__meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }

.fu-card__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

/* buttons */
.fu-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
  border: none;
}
.fu-btn--primary {
  background: #6366f1;
  color: #fff;
}
.fu-btn--primary:hover:not(:disabled) {
  background: #4f46e5;
  box-shadow: 0 4px 12px rgba(99,102,241,.4);
  transform: translateY(-1px);
}
.fu-btn--ghost {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}
.fu-btn--danger {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}
.fu-btn--danger:hover {
  background: #fee2e2;
}
.fu-btn:disabled { opacity: .6; cursor: not-allowed; transform: none !important; }

.fu-close-btn {
  width: 32px; height: 32px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  color: #94a3b8;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all .15s;
}
.fu-close-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

.fu-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
}
.fu-status--done { color: #10b981; }

/* ── status strip at bottom of card ── */
.fu-card__strip {
  margin-top: 14px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}
.fu-strip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.fu-strip--idle     { color: #64748b; }
.fu-strip--uploading { color: #6366f1; }
.fu-strip--done     { color: #10b981; }
.fu-strip--error    { color: #ef4444; }
.fu-card__strip:has(.fu-strip--idle)      { background: #f8fafc; }
.fu-card__strip:has(.fu-strip--uploading) { background: #eef2ff; }
.fu-card__strip:has(.fu-strip--done)      { background: #ecfdf5; }
.fu-card__strip:has(.fu-strip--error)     { background: #fef2f2; }

/* ── spinner ── */
.fu-spin { animation: fu-spin .8s linear infinite; }
@keyframes fu-spin { to { transform: rotate(360deg); } }
`;
