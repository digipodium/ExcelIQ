'use client';
import { useState, useEffect } from 'react';
import { X, BarChart3, LineChart, PieChart } from 'lucide-react';
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

const PIE_COLORS = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f43f5e', '#06b6d4', '#84cc16', '#f97316'
];

export default function SuggestedChartModal({ isOpen, onClose, chartConfig, fileData }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState(chartConfig?.type || 'bar');

  // Sync activeType when a new chart config is selected
  useEffect(() => {
    if (chartConfig?.type) setActiveType(chartConfig.type);
  }, [chartConfig]);

  useEffect(() => {
    if (!isOpen || !chartConfig) return;
    setError(null);
    setChartData(null);

    // Guard: need file data
    if (!fileData?.headers?.length || !fileData?.rows?.length) {
      setError('No dataset loaded. Please upload a file first.');
      return;
    }

    try {
      const { xAxis, yAxis } = chartConfig;

      const normalizedHeaders = fileData.headers.map(h => String(h).trim().toLowerCase());
      const xIdx = normalizedHeaders.indexOf(String(xAxis).trim().toLowerCase());
      const yIdx = normalizedHeaders.indexOf(String(yAxis).trim().toLowerCase());

      if (xIdx === -1 || yIdx === -1) {
        setError(
          `Column mismatch — "${xAxis}" or "${yAxis}" not found in this dataset. ` +
          `Available columns: ${fileData.headers.join(', ')}`
        );
        return;
      }

      const labels = [];
      const dataPoints = [];

      fileData.rows.slice(0, 30).forEach(row => {
        labels.push(row[xIdx] !== undefined ? String(row[xIdx]) : 'Unknown');
        dataPoints.push(parseFloat(row[yIdx]) || 0);
      });

      setChartData({ labels, dataPoints, xAxis, yAxis });
    } catch (err) {
      console.error('Error generating chart data:', err);
      setError('An unexpected error occurred while building the chart.');
    }
  }, [isOpen, chartConfig, fileData]);

  if (!isOpen || !chartConfig) return null;

  const isPie = activeType === 'pie' || activeType === 'doughnut';

  const builtData = chartData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: chartData.yAxis,
            data: chartData.dataPoints,
            backgroundColor: isPie ? PIE_COLORS : 'rgba(99, 102, 241, 0.65)',
            borderColor: isPie ? '#ffffff' : 'rgb(99, 102, 241)',
            borderWidth: isPie ? 2 : 2,
            borderRadius: activeType === 'bar' ? 6 : 0,
            fill: activeType === 'line' ? false : true,
            tension: activeType === 'line' ? 0.4 : 0,
            pointBackgroundColor: activeType === 'line' ? 'rgb(99, 102, 241)' : undefined,
            pointRadius: activeType === 'line' ? 4 : undefined,
          }
        ]
      }
    : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20, font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
      },
    },
    scales: isPie ? {} : {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: {
          font: { size: 11 },
          color: '#94a3b8',
          callback: (val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val,
        }
      }
    }
  };

  const renderChart = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Could not render chart</p>
          <p className="text-xs text-slate-400 max-w-sm">{error}</p>
        </div>
      );
    }
    if (!builtData) {
      return (
        <div className="flex items-center justify-center h-full gap-2 text-slate-400 text-sm">
          Processing data…
        </div>
      );
    }
    switch (activeType) {
      case 'line':     return <Line data={builtData} options={options} />;
      case 'pie':      return <Pie data={builtData} options={options} />;
      case 'doughnut': return <Doughnut data={builtData} options={options} />;
      default:         return <Bar data={builtData} options={options} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              {chartConfig.type === 'line' ? <LineChart size={20} /> : chartConfig.type === 'pie' ? <PieChart size={20} /> : <BarChart3 size={20} />}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-800 truncate">{chartConfig.title}</h2>
              <p className="text-xs text-slate-500 truncate">{chartConfig.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Chart type switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['bar', 'line', 'pie', 'doughnut'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    activeType === t
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chart body */}
        <div className="p-6 flex-1 min-h-[420px] bg-white">
          {renderChart()}
        </div>

        {/* Footer axis info */}
        {builtData && !error && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-4 text-xs text-slate-500">
            <span><span className="font-bold text-slate-700">X-Axis:</span> {chartConfig.xAxis}</span>
            <span className="text-slate-300">|</span>
            <span><span className="font-bold text-slate-700">Y-Axis:</span> {chartConfig.yAxis}</span>
            <span className="text-slate-300">|</span>
            <span><span className="font-bold text-slate-700">Data Points:</span> {builtData.labels.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
