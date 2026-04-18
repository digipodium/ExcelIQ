'use client';
import { useState, useEffect, useMemo } from 'react';
import { UploadCloud, BarChart3, LineChart, PieChart, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
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

export default function Visualization() {
  const [fileData, setFileData] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [suggestedCharts, setSuggestedCharts] = useState([]);
  const [activeChart, setActiveChart] = useState(null);
  const [isGeneratingCharts, setIsGeneratingCharts] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Use viz_ keys — completely separate from ExcelAssistant's ea_ keys
        const storedFileData = localStorage.getItem('viz_fileData');
        if (storedFileData) {
          const parsedFileData = JSON.parse(storedFileData);
          if (parsedFileData.headers && parsedFileData.rows) {
            setFileData(parsedFileData);
          }
        }
        const storedFileMeta = localStorage.getItem('viz_fileMeta');
        if (storedFileMeta) {
          setFileMeta(JSON.parse(storedFileMeta));
        }
        const storedSuggestedCharts = localStorage.getItem('viz_suggestedCharts');
        if (storedSuggestedCharts) {
          const parsedSuggestedCharts = JSON.parse(storedSuggestedCharts);
          if (Array.isArray(parsedSuggestedCharts)) {
            setSuggestedCharts(parsedSuggestedCharts);
            if (parsedSuggestedCharts.length > 0) {
              setActiveChart(parsedSuggestedCharts[0]);
            }
          }
        }
      } catch (e) { }
    }
  }, []);

  const handleUploadSuccess = (data) => {
    if (data.previewData) {
      setFileData(data.previewData);
      localStorage.setItem('viz_fileData', JSON.stringify(data.previewData));
    }
    if (data.fileMeta) {
      setFileMeta(data.fileMeta);
      localStorage.setItem('viz_fileMeta', JSON.stringify(data.fileMeta));
    }

    const fileId = data.fileMeta?.id || data.fileId || data._id || data.id;
    if (fileId && data.path) {
      setSuggestedCharts([]);
      setActiveChart(null);
      setIsGeneratingCharts(true);
      const token = localStorage.getItem('token');
      axios.post('http://localhost:5000/ai/suggest-charts', {
        fileId,
        filePath: data.path
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.suggestedCharts) {
          setSuggestedCharts(res.data.suggestedCharts);
          if (res.data.suggestedCharts.length > 0) setActiveChart(res.data.suggestedCharts[0]);
          localStorage.setItem('viz_suggestedCharts', JSON.stringify(res.data.suggestedCharts));
        }
      }).catch(err => {
        console.error("AI Chart Error:", err);
      }).finally(() => {
        setIsGeneratingCharts(false);
      });
    }
  };

  const handleFileRemoved = () => {
    setFileData(null);
    setFileMeta(null);
    setSuggestedCharts([]);
    setActiveChart(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('viz_suggestedCharts');
      localStorage.removeItem('viz_fileData');
      localStorage.removeItem('viz_fileMeta');
      localStorage.removeItem('viz_uploadedFilePath');
    }
  };

  const chartData = useMemo(() => {
    if (!activeChart || !fileData || !fileData.headers) return null;
    const { xAxis, yAxis, type } = activeChart;

    // Make matching case-insensitive and robust against trailing spaces
    const normalizedHeaders = fileData.headers.map(h => String(h).trim().toLowerCase());
    const xIdx = normalizedHeaders.indexOf(String(xAxis).trim().toLowerCase());
    const yIdx = normalizedHeaders.indexOf(String(yAxis).trim().toLowerCase());

    if (xIdx === -1 || yIdx === -1) {
      console.warn(`Could not map X or Y axis. X: ${xAxis} (${xIdx}), Y: ${yAxis} (${yIdx})`);
      return null;
    }

    let labels = [];
    let dataPoints = [];

    // WE ONLY SHOW TOP 30 TO AVOID CLUTTER
    fileData.rows.slice(0, 30).forEach(row => {
      labels.push(row[xIdx] !== undefined ? String(row[xIdx]) : 'Unknown');
      dataPoints.push(parseFloat(row[yIdx]) || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: String(yAxis),
          data: dataPoints,
          backgroundColor: type === 'pie' || type === 'doughnut'
            ? ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#06b6d4']
            : 'rgba(99, 102, 241, 0.6)',
          borderColor: type === 'pie' || type === 'doughnut' ? '#ffffff' : 'rgb(99, 102, 241)',
          borderWidth: 2,
          borderRadius: type === 'bar' ? 6 : 0,
          fill: type === 'line' ? false : true,
        }
      ]
    };
  }, [activeChart, fileData]);

  const stats = useMemo(() => {
    if (!chartData || chartData.datasets[0].data.length === 0) return [];
    const values = chartData.datasets[0].data;
    const max = Math.max(...values);
    const peakIdx = values.indexOf(max);
    const peakLabel = chartData.labels[peakIdx];
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

    return [
      { label: `Peak ${activeChart?.yAxis || ''}`, val: peakLabel || '—' },
      { label: 'Max Value', val: max.toLocaleString() },
      { label: 'Average', val: Number(avg).toLocaleString() },
    ];
  }, [chartData, activeChart]);

  const renderChart = () => {
    if (!chartData) return <div className="text-center text-slate-400 mt-20">Unable to render chart data. Maybe X or Y axis was not found.</div>;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      }
    };
    switch (activeChart.type) {
      case 'line': return <Line data={chartData} options={options} />;
      case 'pie': return <Pie data={chartData} options={options} />;
      case 'doughnut': return <Doughnut data={chartData} options={options} />;
      default: return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="space-y-6">
      <FileUpload
        onUploadSuccess={handleUploadSuccess}
        onFileRemoved={handleFileRemoved}
        persistedFileMeta={fileMeta}
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar controls (Suggested Charts) */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" /> ExcelIQ Suggestions
            </h3>
            <div className="space-y-2">
              {isGeneratingCharts ? (
                <div className="text-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-500">Analyzing your data...</p>
                  <p className="text-[10px] text-slate-400 mt-1">Generating best visualizations for you.</p>
                </div>
              ) : suggestedCharts.length > 0 ? (
                suggestedCharts.map((chart, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveChart(chart)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeChart?.title === chart.title ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600'}`}
                  >
                    <div className="shrink-0 flex items-center">
                      {chart.type === 'line' ? <LineChart size={18} /> : chart.type === 'pie' ? <PieChart size={18} /> : <BarChart3 size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${activeChart?.title === chart.title ? 'text-white' : 'text-slate-800'}`}>{chart.title}</h4>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 border border-slate-100 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold">No Suggestions Yet</p>
                  <p className="text-[10px] mt-1 text-slate-500">Upload a dataset to get smart chart suggestions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{activeChart ? activeChart.title : 'Data Visualization'}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {activeChart ? activeChart.description : 'Awaiting data upload via Assistant'}
                </p>
              </div>

              {activeChart ? (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                  {['bar', 'line', 'pie', 'doughnut'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveChart({ ...activeChart, type: t })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeChart.type === t
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 bg-slate-100 text-slate-400">
                  No Data
                </span>
              )}
            </div>

            <div className="min-h-[400px] w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative flex items-center justify-center p-4">
              {activeChart && chartData ? (
                <div className="w-full h-[350px]">
                  {renderChart()}
                </div>
              ) : (
                <div className="h-[350px] w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center">
                    <UploadCloud className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-600 text-sm">No chart to display</p>
                    <p className="text-xs text-slate-400 mt-1">Select a suggestion from the left panel.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-white p-4 border border-slate-100 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-lg font-bold text-slate-800 break-words">{s.val}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}