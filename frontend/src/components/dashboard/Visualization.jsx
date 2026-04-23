'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  UploadCloud, BarChart3, LineChart, PieChart, Sparkles, Loader2,
  FlaskConical, X, ClipboardList, FileUp, Table2, Wand2,
  ChevronDown, ChevronUp, Info, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
);

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const PIE_COLORS = [
  '#6366f1','#0ea5e9','#10b981','#f59e0b',
  '#ef4444','#8b5cf6','#ec4899','#14b8a6',
  '#f43f5e','#06b6d4','#84cc16','#f97316',
];

const SAMPLE_DATA = {
  headers: ['Month','Revenue','Expenses','Profit','Units Sold','Region'],
  rows: [
    ['Jan',52000,31000,21000,420,'North'],
    ['Feb',61000,34000,27000,510,'South'],
    ['Mar',74000,38000,36000,640,'East'],
    ['Apr',68000,36000,32000,580,'West'],
    ['May',82000,41000,41000,710,'North'],
    ['Jun',91000,45000,46000,790,'South'],
    ['Jul',95000,47000,48000,830,'East'],
    ['Aug',88000,43000,45000,760,'West'],
    ['Sep',79000,40000,39000,680,'North'],
    ['Oct',84000,42000,42000,720,'South'],
    ['Nov',97000,48000,49000,850,'East'],
    ['Dec',112000,54000,58000,980,'West'],
  ],
};

const SAMPLE_CHARTS_PRESET = [
  { id:1, title:'Monthly Revenue Trend',   type:'line',     xAxis:'Month', yAxis:'Revenue',    description:'Revenue performance across all 12 months.' },
  { id:2, title:'Profit by Month',          type:'bar',      xAxis:'Month', yAxis:'Profit',     description:'Monthly profit margin at a glance.' },
  { id:3, title:'Units Sold per Month',     type:'bar',      xAxis:'Month', yAxis:'Units Sold', description:'Sales volume fluctuations throughout the year.' },
  { id:4, title:'Expense Distribution',     type:'doughnut', xAxis:'Month', yAxis:'Expenses',   description:'How expenses are spread across months.' },
];

// ── CSV text → { headers, rows } ───────────────────────────────────────────
function parseCsvText(text) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return null;
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(l =>
    l.split(',').map(c => {
      const s = c.trim().replace(/^"|"$/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? s : n;
    })
  );
  return { headers, rows };
}

// ── Mode badge styles ────────────────────────────────────────────────────────
const MODE_BADGE = {
  upload: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Uploaded File' },
  paste:  { bg: 'bg-blue-100',   text: 'text-blue-700',    label: 'Pasted Data'   },
  sample: { bg: 'bg-violet-100', text: 'text-violet-700',  label: 'Sample Data'   },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Visualization() {
  // ── Active data + charts ──────────────────────────────────────────────────
  const [fileData,        setFileData]        = useState(null); // { headers, rows }
  const [fileMeta,        setFileMeta]        = useState(null);
  const [suggestedCharts, setSuggestedCharts] = useState([]);
  const [activeChart,     setActiveChart]     = useState(null);
  const [dataMode,        setDataMode]        = useState(null); // 'upload'|'paste'|'sample'

  // ── Input panel state ─────────────────────────────────────────────────────
  const [inputTab,          setInputTab]          = useState('upload'); // 'upload'|'paste'|'sample'
  const [csvText,           setCsvText]           = useState('');
  const [csvParseError,     setCsvParseError]     = useState('');
  const [isAiLoading,       setIsAiLoading]       = useState(false);
  const [inputPanelOpen,    setInputPanelOpen]    = useState(true);

  // ── Restore from localStorage on mount ───────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const fd = localStorage.getItem('viz_fileData');
      if (fd) { const p = JSON.parse(fd); if (p.headers && p.rows) setFileData(p); }
      const fm = localStorage.getItem('viz_fileMeta');
      if (fm) setFileMeta(JSON.parse(fm));
      const sc = localStorage.getItem('viz_suggestedCharts');
      if (sc) { const p = JSON.parse(sc); if (Array.isArray(p) && p.length) { setSuggestedCharts(p); setActiveChart(p[0]); } }
      const dm = localStorage.getItem('viz_dataMode');
      if (dm) setDataMode(dm);
    } catch {}
  }, []);

  // ── Persist ───────────────────────────────────────────────────────────────
  const persist = (fd, sc, dm) => {
    try {
      if (fd) localStorage.setItem('viz_fileData', JSON.stringify(fd));
      if (sc) localStorage.setItem('viz_suggestedCharts', JSON.stringify(sc));
      if (dm) localStorage.setItem('viz_dataMode', dm);
    } catch {}
  };

  const clearAll = () => {
    setFileData(null); setFileMeta(null); setSuggestedCharts([]); setActiveChart(null); setDataMode(null);
    ['viz_fileData','viz_fileMeta','viz_suggestedCharts','viz_dataMode','viz_uploadedFilePath']
      .forEach(k => localStorage.removeItem(k));
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Mode handlers
  // ────────────────────────────────────────────────────────────────────────────

  // 1) File upload → AI via /suggest-charts (file path on server)
  const handleUploadSuccess = (data) => {
    if (data.previewData) { setFileData(data.previewData); localStorage.setItem('viz_fileData', JSON.stringify(data.previewData)); }
    if (data.fileMeta)    { setFileMeta(data.fileMeta);   localStorage.setItem('viz_fileMeta',  JSON.stringify(data.fileMeta)); }
    setDataMode('upload'); localStorage.setItem('viz_dataMode', 'upload');
    const fileId = data.fileMeta?.id || data.fileId || data._id || data.id;
    if (fileId && data.path) {
      setSuggestedCharts([]); setActiveChart(null); setIsAiLoading(true);
      const token = localStorage.getItem('token');
      axios.post('http://localhost:5000/ai/suggest-charts', { fileId, filePath: data.path }, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        if (res.data.suggestedCharts?.length) {
          setSuggestedCharts(res.data.suggestedCharts);
          setActiveChart(res.data.suggestedCharts[0]);
          persist(null, res.data.suggestedCharts, null);
          setInputPanelOpen(false);
        } else toast.error('AI returned no chart suggestions for this file.');
      }).catch(() => toast.error('Failed to get AI chart suggestions.')).finally(() => setIsAiLoading(false));
    }
  };

  const handleFileRemoved = () => { clearAll(); };

  // 2) Pasted CSV → AI via /suggest-charts-from-preview
  const handleAnalyzePasted = async () => {
    setCsvParseError('');
    if (!csvText.trim()) { setCsvParseError('Paste some CSV data first.'); return; }
    const parsed = parseCsvText(csvText);
    if (!parsed) { setCsvParseError('Could not parse CSV. Make sure first row is headers, values comma-separated.'); return; }
    if (parsed.headers.length < 2) { setCsvParseError('Need at least 2 columns.'); return; }
    if (parsed.rows.length < 2)   { setCsvParseError('Need at least 2 rows of data.'); return; }

    setFileData(parsed); setDataMode('paste'); setIsAiLoading(true); setSuggestedCharts([]); setActiveChart(null);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/ai/suggest-charts-from-preview',
        { previewData: parsed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.suggestedCharts?.length) {
        setSuggestedCharts(res.data.suggestedCharts);
        setActiveChart(res.data.suggestedCharts[0]);
        persist(parsed, res.data.suggestedCharts, 'paste');
        setInputPanelOpen(false);
        toast.success(`AI suggested ${res.data.suggestedCharts.length} charts!`);
      } else {
        toast.error('AI returned no chart suggestions. Try adding more numeric columns.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed. Please try again.');
    } finally { setIsAiLoading(false); }
  };

  // 3) Sample data → AI via /suggest-charts-from-preview
  const handleAnalyzeSample = async (usePreset = false) => {
    setFileData(SAMPLE_DATA); setDataMode('sample'); setSuggestedCharts([]); setActiveChart(null);
    if (usePreset) {
      setSuggestedCharts(SAMPLE_CHARTS_PRESET);
      setActiveChart(SAMPLE_CHARTS_PRESET[0]);
      persist(SAMPLE_DATA, SAMPLE_CHARTS_PRESET, 'sample');
      setInputPanelOpen(false);
      return;
    }
    setIsAiLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/ai/suggest-charts-from-preview',
        { previewData: SAMPLE_DATA },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.suggestedCharts?.length) {
        setSuggestedCharts(res.data.suggestedCharts);
        setActiveChart(res.data.suggestedCharts[0]);
        persist(SAMPLE_DATA, res.data.suggestedCharts, 'sample');
        setInputPanelOpen(false);
        toast.success(`AI suggested ${res.data.suggestedCharts.length} charts from sample data!`);
      } else {
        // Fallback to preset
        setSuggestedCharts(SAMPLE_CHARTS_PRESET);
        setActiveChart(SAMPLE_CHARTS_PRESET[0]);
        setInputPanelOpen(false);
      }
    } catch {
      // Fallback to preset on error
      setSuggestedCharts(SAMPLE_CHARTS_PRESET);
      setActiveChart(SAMPLE_CHARTS_PRESET[0]);
      setInputPanelOpen(false);
    } finally { setIsAiLoading(false); }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Chart data derivation
  // ────────────────────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!activeChart || !fileData?.headers) return null;
    const { xAxis, yAxis, type } = activeChart;
    const normH = fileData.headers.map(h => String(h).trim().toLowerCase());
    const xIdx  = normH.indexOf(String(xAxis).trim().toLowerCase());
    const yIdx  = normH.indexOf(String(yAxis).trim().toLowerCase());
    if (xIdx === -1 || yIdx === -1) return null;

    const labels = [], dataPoints = [];
    fileData.rows.slice(0, 30).forEach(row => {
      labels.push(row[xIdx] != null ? String(row[xIdx]) : 'Unknown');
      dataPoints.push(parseFloat(row[yIdx]) || 0);
    });

    const isPie = type === 'pie' || type === 'doughnut';
    return {
      labels,
      datasets: [{
        label: String(yAxis),
        data: dataPoints,
        backgroundColor: isPie ? PIE_COLORS : 'rgba(99,102,241,0.65)',
        borderColor:     isPie ? '#ffffff'   : 'rgb(99,102,241)',
        borderWidth:     isPie ? 2 : 2,
        borderRadius:    type === 'bar' ? 6 : 0,
        fill:            type === 'line' ? false : true,
        tension:         type === 'line' ? 0.4 : 0,
        pointBackgroundColor: type === 'line' ? 'rgb(99,102,241)' : undefined,
        pointRadius:          type === 'line' ? 4 : undefined,
      }],
    };
  }, [activeChart, fileData]);

  const stats = useMemo(() => {
    if (!chartData || !chartData.datasets[0].data.length) return [];
    const vals   = chartData.datasets[0].data;
    const max    = Math.max(...vals);
    const min    = Math.min(...vals);
    const avg    = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1);
    const peakLb = chartData.labels[vals.indexOf(max)];
    return [
      { label: `Peak ${activeChart?.yAxis||''}`, val: peakLb||'—' },
      { label: 'Max Value',  val: max.toLocaleString() },
      { label: 'Average',    val: Number(avg).toLocaleString() },
      { label: 'Min Value',  val: min.toLocaleString() },
    ];
  }, [chartData, activeChart]);

  const chartOptions = useMemo(() => {
    const isPie = activeChart?.type === 'pie' || activeChart?.type === 'doughnut';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.88)',
          padding: 12, cornerRadius: 10,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
        },
      },
      scales: isPie ? {} : {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
        y: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: {
            font: { size: 11 }, color: '#94a3b8',
            callback: v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v,
        }},
      },
    };
  }, [activeChart?.type]);

  const renderChart = () => {
    if (!chartData) return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-amber-400" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Column mapping failed</p>
        <p className="text-xs text-slate-400 max-w-xs">
          &ldquo;{activeChart?.xAxis}&rdquo; or &ldquo;{activeChart?.yAxis}&rdquo; not found in headers: {fileData?.headers?.join(', ') || '—'}
        </p>
      </div>
    );
    switch (activeChart.type) {
      case 'line':     return <Line     data={chartData} options={chartOptions} />;
      case 'pie':      return <Pie      data={chartData} options={chartOptions} />;
      case 'doughnut': return <Doughnut data={chartData} options={chartOptions} />;
      default:         return <Bar      data={chartData} options={chartOptions} />;
    }
  };

  const modeBadge = dataMode ? MODE_BADGE[dataMode] : null;
  const hasCharts = suggestedCharts.length > 0;

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── COLLAPSIBLE INPUT PANEL ── */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Panel header / toggle */}
        <button
          onClick={() => setInputPanelOpen(p => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">AI Chart Generator</p>
              <p className="text-xs text-slate-400">
                {hasCharts
                  ? `${suggestedCharts.length} charts generated · click to change data source`
                  : 'Upload a file, paste CSV, or use sample data to get AI-powered charts'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {modeBadge && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${modeBadge.bg} ${modeBadge.text}`}>
                {modeBadge.label}
              </span>
            )}
            {isAiLoading
              ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              : inputPanelOpen
                ? <ChevronUp  className="w-5 h-5 text-slate-400" />
                : <ChevronDown className="w-5 h-5 text-slate-400" />
            }
          </div>
        </button>

        {/* Panel body */}
        {inputPanelOpen && (
          <div className="border-t border-slate-100">
            {/* Tab switcher */}
            <div className="flex border-b border-slate-100 px-6 pt-4 gap-1">
              {[
                { id: 'upload', Icon: FileUp,       label: 'Upload File' },
                { id: 'paste',  Icon: ClipboardList, label: 'Paste CSV'  },
                { id: 'sample', Icon: FlaskConical,  label: 'Sample Data' },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setInputTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 -mb-px ${
                    inputTab === id
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50/60'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── TAB: Upload File ── */}
              {inputTab === 'upload' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Info size={12} className="text-slate-400" />
                    Upload a CSV / XLSX / XLS file. AI will read it and suggest the best charts automatically.
                  </p>
                  <FileUpload
                    onUploadSuccess={handleUploadSuccess}
                    onFileRemoved={handleFileRemoved}
                    persistedFileMeta={fileMeta}
                  />
                  {isAiLoading && (
                    <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-xs text-indigo-600 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      AI is analyzing your data and picking the best chart types…
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: Paste CSV ── */}
              {inputTab === 'paste' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Info size={12} className="text-slate-400" />
                    Paste any CSV data below. First row must be column headers. AI will analyze it and suggest charts.
                  </p>
                  <div className="relative">
                    <textarea
                      value={csvText}
                      onChange={e => { setCsvText(e.target.value); setCsvParseError(''); }}
                      placeholder={`Month,Revenue,Expenses\nJan,52000,31000\nFeb,61000,34000\nMar,74000,38000`}
                      className="w-full h-44 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-xs font-mono text-slate-700 resize-none bg-slate-50 placeholder:text-slate-300 transition-all"
                      spellCheck={false}
                    />
                    {csvText && (
                      <button
                        onClick={() => { setCsvText(''); setCsvParseError(''); }}
                        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                      >
                        <X size={12} className="text-slate-500" />
                      </button>
                    )}
                  </div>

                  {csvParseError && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                      <X size={12} /> {csvParseError}
                    </p>
                  )}

                  {/* Quick-fill with sample CSV */}
                  <div className="flex gap-3 items-center flex-wrap">
                    <button
                      onClick={() => setCsvText('Month,Revenue,Expenses,Profit,Units Sold\nJan,52000,31000,21000,420\nFeb,61000,34000,27000,510\nMar,74000,38000,36000,640\nApr,68000,36000,32000,580\nMay,82000,41000,41000,710\nJun,91000,45000,46000,790\nJul,95000,47000,48000,830\nAug,88000,43000,45000,760')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                    >
                      <FlaskConical size={12} /> Fill with sample CSV
                    </button>

                    <button
                      onClick={handleAnalyzePasted}
                      disabled={isAiLoading || !csvText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-md hover:shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {isAiLoading
                        ? <><Loader2 size={13} className="animate-spin" /> Analyzing…</>
                        : <><Sparkles size={13} /> Analyze with AI</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB: Sample Data ── */}
              {inputTab === 'sample' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Info size={12} className="text-slate-400" />
                    Use a built-in monthly sales dataset to preview AI-powered chart suggestions instantly.
                  </p>

                  {/* Sample data preview table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                      <Table2 size={13} className="text-indigo-500" />
                      <span className="text-xs font-bold text-slate-600">Sample Dataset Preview</span>
                      <span className="ml-auto text-[10px] text-slate-400">12 rows × 6 columns</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-indigo-50">
                          <tr>
                            {SAMPLE_DATA.headers.map(h => (
                              <th key={h} className="px-3 py-2 font-bold text-indigo-700 whitespace-nowrap border-b border-indigo-100">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {SAMPLE_DATA.rows.slice(0, 5).map((row, ri) => (
                            <tr key={ri} className="hover:bg-slate-50 transition-colors">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-3 py-2 text-slate-600 whitespace-nowrap">{String(cell)}</td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={SAMPLE_DATA.headers.length} className="px-3 py-2 text-center text-[10px] text-slate-400 italic">
                              … {SAMPLE_DATA.rows.length - 5} more rows
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleAnalyzeSample(false)}
                      disabled={isAiLoading}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-md hover:shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {isAiLoading
                        ? <><Loader2 size={13} className="animate-spin" /> AI Analyzing…</>
                        : <><Sparkles size={13} /> Get AI Suggestions</>}
                    </button>
                    <button
                      onClick={() => handleAnalyzeSample(true)}
                      disabled={isAiLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <FlaskConical size={13} /> Quick Preview (Preset Charts)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT: sidebar + chart ── */}
      <div className="grid lg:grid-cols-4 gap-6">

        {/* ── Left sidebar ── */}
        <div className="space-y-4">

          {/* Suggestions list */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={13} className="text-indigo-500" />
              {dataMode === 'sample' ? 'Sample Charts' : 'AI Suggestions'}
            </h3>

            {isAiLoading ? (
              <div className="text-center py-8 space-y-3">
                <div className="relative w-12 h-12 mx-auto">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-200" />
                  <Sparkles className="w-5 h-5 text-indigo-500 absolute inset-0 m-auto" />
                </div>
                <p className="text-xs font-semibold text-slate-500">AI is analyzing…</p>
                <p className="text-[10px] text-slate-400">Generating best chart types for your data.</p>
              </div>
            ) : hasCharts ? (
              <div className="space-y-2">
                {suggestedCharts.map((chart, idx) => {
                  const isActive = activeChart?.title === chart.title;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveChart(chart)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-left ${
                        isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                    >
                      <span className="shrink-0">
                        {chart.type === 'line'
                          ? <LineChart size={16} />
                          : chart.type === 'pie' || chart.type === 'doughnut'
                            ? <PieChart size={16} />
                            : <BarChart3 size={16} />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`text-xs font-bold block truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                          {chart.title}
                        </span>
                        <span className={`text-[10px] truncate block mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {chart.type} · {chart.xAxis} → {chart.yAxis}
                        </span>
                      </span>
                    </button>
                  );
                })}

                {/* Regenerate */}
                {(dataMode === 'paste' || dataMode === 'sample') && (
                  <button
                    onClick={() => dataMode === 'sample' ? handleAnalyzeSample(false) : handleAnalyzePasted()}
                    disabled={isAiLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-indigo-200 text-indigo-500 text-xs font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={13} /> Regenerate with AI
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 border border-slate-100 rounded-xl bg-slate-50 p-4 space-y-3">
                <p className="text-sm font-semibold">No Suggestions Yet</p>
                <p className="text-[10px] text-slate-500">Use one of the options above to generate AI chart suggestions.</p>
              </div>
            )}
          </div>

          {/* Chart type switcher */}
          {activeChart && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Chart Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { t: 'bar',      Icon: BarChart3  },
                  { t: 'line',     Icon: LineChart  },
                  { t: 'pie',      Icon: PieChart   },
                  { t: 'doughnut', Icon: PieChart   },
                ].map(({ t, Icon }) => (
                  <button
                    key={t}
                    onClick={() => setActiveChart(c => ({ ...c, type: t }))}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold capitalize transition-all ${
                      activeChart.type === t
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={15} /> {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Main chart area ── */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-800 truncate">
                  {activeChart?.title || 'Data Visualization'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {activeChart?.description || 'Use the panel above to generate AI-powered charts from your data.'}
                </p>
              </div>
              {activeChart && (
                <div className="flex items-center gap-2 shrink-0">
                  {modeBadge && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${modeBadge.bg} ${modeBadge.text}`}>
                      {modeBadge.label}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    activeChart.type === 'line'                               ? 'bg-blue-100 text-blue-600'
                    : activeChart.type === 'pie' || activeChart.type === 'doughnut' ? 'bg-rose-100 text-rose-600'
                    : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {activeChart.type}
                  </span>
                </div>
              )}
            </div>

            {/* Chart canvas */}
            <div className="min-h-[380px] w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-4">
              {activeChart ? (
                <div className="w-full h-[370px]">{renderChart()}</div>
              ) : (
                <div className="h-[330px] w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-5 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-600 text-sm">No chart to display</p>
                    <p className="text-xs text-slate-400 mt-1">Choose a data source above to get started.</p>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={() => { setInputTab('sample'); setInputPanelOpen(true); }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] transition-all"
                    >
                      <FlaskConical size={15} /> Try Sample Data
                    </button>
                    <button
                      onClick={() => { setInputTab('paste'); setInputPanelOpen(true); }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
                    >
                      <ClipboardList size={15} /> Paste CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-white p-4 border border-slate-100 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg font-bold text-slate-800 break-words">{s.val}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Axis info */}
          {activeChart && chartData && (
            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm flex flex-wrap gap-4 text-xs text-slate-500">
              <span><span className="font-bold text-slate-700">X-Axis:</span> {activeChart.xAxis}</span>
              <span className="text-slate-200">|</span>
              <span><span className="font-bold text-slate-700">Y-Axis:</span> {activeChart.yAxis}</span>
              <span className="text-slate-200">|</span>
              <span><span className="font-bold text-slate-700">Data Points:</span> {chartData.labels.length}</span>
              {modeBadge && (
                <>
                  <span className="text-slate-200">|</span>
                  <span className={`font-semibold ${modeBadge.text}`}>{modeBadge.label}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}