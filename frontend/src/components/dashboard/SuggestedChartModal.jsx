'use client';
import { useState, useEffect } from 'react';
import { X, BarChart3, LineChart, PieChart } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
);

export default function SuggestedChartModal({ isOpen, onClose, chartConfig, fileData }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!isOpen || !chartConfig || !fileData?.headers?.length || !fileData?.rows?.length) return;

    try {
      const { xAxis, yAxis, type } = chartConfig;
      
      const normalizedHeaders = fileData.headers.map(h => String(h).trim().toLowerCase());
      const xIdx = normalizedHeaders.indexOf(String(xAxis).trim().toLowerCase());
      const yIdx = normalizedHeaders.indexOf(String(yAxis).trim().toLowerCase());

      if (xIdx === -1 || yIdx === -1) {
        console.warn(`X or Y axis label not found in dataset headers. X:${xAxis}, Y:${yAxis}`);
        return;
      }

      let labels = [];
      let dataPoints = [];

      fileData.rows.slice(0, 30).forEach(row => {
          labels.push(row[xIdx] !== undefined ? String(row[xIdx]) : 'Unknown');
          dataPoints.push(parseFloat(row[yIdx]) || 0);
      });

      setChartData({
        labels,
        datasets: [
          {
            label: yAxis,
            data: dataPoints,
            backgroundColor: type === 'pie' 
              ? ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']
              : 'rgba(99, 102, 241, 0.5)',
            borderColor: type === 'pie' ? '#fff' : 'rgb(99, 102, 241)',
            borderWidth: 1,
            fill: type === 'line' ? false : true,
          }
        ]
      });
    } catch (err) {
      console.error("Error generating chart data:", err);
    }
  }, [isOpen, chartConfig, fileData]);

  if (!isOpen || !chartConfig) return null;

  const renderChart = () => {
    if (!chartData) return <div className="text-sm text-slate-500">Processing data...</div>;
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: false }
      }
    };
    
    switch (chartConfig.type) {
      case 'line': return <Line data={chartData} options={options} />;
      case 'pie': return <Pie data={chartData} options={options} />;
      case 'doughnut': return <Pie data={chartData} options={{...options, cutout: '60%'}} />;
      default: return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                {chartConfig.type === 'line' ? <LineChart /> : chartConfig.type === 'pie' ? <PieChart /> : <BarChart3 />}
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-800">{chartConfig.title}</h2>
               <p className="text-xs text-slate-500">{chartConfig.description}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex-1 min-h-[400px]">
           {renderChart()}
        </div>
      </div>
    </div>
  );
}
