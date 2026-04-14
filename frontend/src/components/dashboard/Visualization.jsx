'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart3, PieChart, LineChart, Palette, UploadCloud } from 'lucide-react';
import * as d3 from 'd3';
import FileUpload from './FileUpload';

const palettes = {
  indigo: {
    name: 'Indigo',
    colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
    bg: ['rgba(99,102,241,0.15)', 'rgba(129,140,248,0.15)', 'rgba(165,180,252,0.15)', 'rgba(199,210,254,0.15)', 'rgba(224,231,255,0.15)'],
  },
  ocean: {
    name: 'Ocean',
    colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#06b6d4', '#22d3ee'],
    bg: ['rgba(14,165,233,0.15)', 'rgba(56,189,248,0.15)', 'rgba(125,211,252,0.15)', 'rgba(6,182,212,0.15)', 'rgba(34,211,238,0.15)'],
  },
};

// ── D3 chart hooks ───────────────────────────────────────────────────────────

function useBarChart(svgRef, data, pal) {
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const el = svgRef.current;
    d3.select(el).selectAll('*').remove();

    const W = el.clientWidth || 500;
    const H = el.clientHeight || 320;
    const mg = { top: 20, right: 16, bottom: 36, left: 44 };

    const svg = d3.select(el).attr('width', W).attr('height', H);

    const x = d3.scaleBand().domain(data.map(d => d.label)).range([mg.left, W - mg.right]).padding(0.3);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value) * 1.15]).range([H - mg.bottom, mg.top]);

    svg.append('g').attr('transform', `translate(${mg.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-(W - mg.left - mg.right)))
      .call(g => {
        g.select('.domain').remove();
        g.selectAll('.tick line').attr('stroke', 'rgba(0,0,0,0.06)').attr('stroke-dasharray', '3,3');
        g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', 11);
      });

    svg.append('g').attr('transform', `translate(0,${H - mg.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => {
        g.select('.domain').attr('stroke', 'rgba(0,0,0,0.08)');
        g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', 11);
      });

    const color = d3.scaleLinear().domain([0, data.length - 1]).range([pal.colors[0], pal.colors[2]]);

    svg.selectAll('rect').data(data).join('rect')
      .attr('x', d => x(d.label))
      .attr('y', H - mg.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', (_, i) => color(i))
      .transition().duration(600).ease(d3.easeCubicOut)
      .attr('y', d => y(d.value))
      .attr('height', d => y(0) - y(d.value));

    svg.selectAll('text.val').data(data).join('text')
      .attr('class', 'val')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#64748b')
      .attr('opacity', 0)
      .text(d => d.value)
      .transition().delay(500).duration(200)
      .attr('opacity', 1);
  }, [svgRef, data, pal]);
}

function usePieChart(svgRef, data, pal) {
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const el = svgRef.current;
    d3.select(el).selectAll('*').remove();

    const W = el.clientWidth || 500;
    const H = el.clientHeight || 320;
    const r = Math.min(W, H) / 2 - 20;

    const svg = d3.select(el).attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`);

    const arc = d3.arc().innerRadius(r * 0.5).outerRadius(r);
    const arcHover = d3.arc().innerRadius(r * 0.5).outerRadius(r + 8);
    const pie = d3.pie().value(d => d.value).sort(null);
    const total = d3.sum(data, d => d.value);

    const slices = g.selectAll('path').data(pie(data)).join('path')
      .attr('fill', (_, i) => pal.colors[i % pal.colors.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .each(function (d) { this._current = { startAngle: d.startAngle, endAngle: d.startAngle }; })
      .on('mouseenter', function (_, d) {
        d3.select(this).transition().duration(200).attr('d', arcHover(d));
      })
      .on('mouseleave', function (_, d) {
        d3.select(this).transition().duration(200).attr('d', arc(d));
      });

    slices.transition().duration(700).ease(d3.easeCubicOut)
      .attrTween('d', function (d) {
        const interp = d3.interpolate(this._current, d);
        this._current = interp(1);
        return t => arc(interp(t));
      });

    g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.3em')
      .attr('font-size', 22).attr('font-weight', 600).attr('fill', '#1e293b').text(total);
    g.append('text').attr('text-anchor', 'middle').attr('dy', '1.2em')
      .attr('font-size', 11).attr('fill', '#94a3b8').text('Total');

    const legend = svg.append('g').attr('transform', `translate(${W / 2 + r + 16}, ${H / 2 - data.length * 14})`);
    data.forEach((d, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 26})`);
      row.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', pal.colors[i % pal.colors.length]);
      row.append('text').attr('x', 14).attr('y', 9).attr('font-size', 11).attr('fill', '#64748b').text(`${d.label} (${d.value})`);
    });
  }, [svgRef, data, pal]);
}

function useLineChart(svgRef, data, pal) {
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const el = svgRef.current;
    d3.select(el).selectAll('*').remove();

    const W = el.clientWidth || 500;
    const H = el.clientHeight || 320;
    const mg = { top: 20, right: 16, bottom: 36, left: 44 };

    const svg = d3.select(el).attr('width', W).attr('height', H);

    const x = d3.scalePoint().domain(data.map(d => d.label)).range([mg.left, W - mg.right]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value) * 1.2]).range([H - mg.bottom, mg.top]);

    svg.append('g').attr('transform', `translate(${mg.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-(W - mg.left - mg.right)))
      .call(g => {
        g.select('.domain').remove();
        g.selectAll('.tick line').attr('stroke', 'rgba(0,0,0,0.06)').attr('stroke-dasharray', '3,3');
        g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', 11);
      });

    svg.append('g').attr('transform', `translate(0,${H - mg.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => {
        g.select('.domain').attr('stroke', 'rgba(0,0,0,0.08)');
        g.selectAll('text').attr('fill', '#94a3b8').attr('font-size', 11);
      });

    const area = d3.area().x(d => x(d.label)).y0(y(0)).y1(d => y(d.value)).curve(d3.curveCatmullRom);
    svg.append('path').datum(data).attr('fill', pal.bg[0]).attr('d', area);

    const line = d3.line().x(d => x(d.label)).y(d => y(d.value)).curve(d3.curveCatmullRom);
    const path = svg.append('path').datum(data)
      .attr('fill', 'none').attr('stroke', pal.colors[0]).attr('stroke-width', 2.5).attr('d', line);

    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
      .transition().duration(900).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);

    svg.selectAll('circle').data(data).join('circle')
      .attr('cx', d => x(d.label)).attr('cy', d => y(d.value))
      .attr('r', 0).attr('fill', pal.colors[0]).attr('stroke', '#fff').attr('stroke-width', 2)
      .transition().delay((_, i) => i * 60).duration(300)
      .attr('r', 4);
  }, [svgRef, data, pal]);
}

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert the raw fileData prop (either an array of row-objects or {headers, rows})
 * into a flat [{label, value}] array suitable for bar/line charts,
 * and a [{label, value}] array suitable for pie charts.
 */
function deriveChartData(fileData) {
  if (!fileData) return { barLine: [], pie: [] };

  // Case 1: array of plain objects e.g. [{Month:'Jan', Sales:42}, …]
  if (Array.isArray(fileData) && fileData.length) {
    const keys = Object.keys(fileData[0]);
    const labelKey = keys[0];
    const numericKeys = keys.filter(k => k !== labelKey && !isNaN(parseFloat(fileData[0][k])));
    if (!numericKeys.length) return { barLine: [], pie: [] };
    const valueKey = numericKeys[0];

    const barLine = fileData.map(row => ({
      label: String(row[labelKey] ?? ''),
      value: parseFloat(row[valueKey]) || 0,
    }));

    // For pie: aggregate by label key using valueKey
    const pie = barLine.slice(0, 8); // cap at 8 slices for readability
    return { barLine, pie };
  }

  // Case 2: { headers: [], rows: [] } (from ExcelAssistant previewData)
  if (fileData.headers && Array.isArray(fileData.rows) && fileData.rows.length) {
    const { headers, rows } = fileData;
    const labelIdx = 0;
    const numericIdx = headers.findIndex((_, i) => i > 0 && !isNaN(parseFloat(rows[0]?.[i])));
    if (numericIdx === -1) return { barLine: [], pie: [] };

    const barLine = rows.map(row => ({
      label: String(row[labelIdx] ?? ''),
      value: parseFloat(row[numericIdx]) || 0,
    }));
    const pie = barLine.slice(0, 8);
    return { barLine, pie };
  }

  return { barLine: [], pie: [] };
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="h-[350px] w-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center">
        <UploadCloud className="w-7 h-7 text-indigo-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-600 text-sm">No data to visualize yet</p>
        <p className="text-xs text-slate-400 mt-1">Upload a spreadsheet in the Excel Assistant tab to see charts here.</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Visualization({ fileData = null }) {
  const [localFileData, setLocalFileData] = useState(null);
  const [activeChart, setActiveChart] = useState('bar');
  const [activePalette, setActivePalette] = useState('indigo');
  const pal = palettes[activePalette];

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const lineRef = useRef(null);

  const dataToVisualize = localFileData || fileData;
  const { barLine, pie } = useMemo(() => deriveChartData(dataToVisualize), [dataToVisualize]);
  const hasData = barLine.length > 0;

  useBarChart(barRef, barLine, pal);
  usePieChart(pieRef, pie, pal);
  useLineChart(lineRef, barLine, pal);

  const handleUploadSuccess = (data) => {
    if (data.previewData) {
      setLocalFileData(data.previewData);
    }
  };

  const handleFileRemoved = () => {
    setLocalFileData(null);
  };

  const stats = useMemo(() => {
    if (!hasData) return [];
    const values = barLine.map(d => d.value);
    const max = Math.max(...values);
    const peak = barLine.find(d => d.value === max);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    const prev = values[values.length - 2];
    const last = values[values.length - 1];
    const growth = prev ? (((last - prev) / prev) * 100).toFixed(1) : '—';
    return [
      { label: 'Peak', val: peak?.label ?? '—' },
      { label: 'Average', val: String(avg) },
      { label: 'Growth', val: prev ? `${growth > 0 ? '+' : ''}${growth}%` : '—' },
    ];
  }, [barLine, hasData]);

  return (
    <div className="space-y-6">
      {/* ── FILE UPLOAD COMPONENT ── */}
      <FileUpload
        onUploadSuccess={handleUploadSuccess}
        onFileRemoved={handleFileRemoved}
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar controls */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Chart Type</h3>
            <div className="space-y-2">
              {[
                { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
                { id: 'pie', label: 'Pie Chart', icon: PieChart },
                { id: 'line', label: 'Line Chart', icon: LineChart },
              ].map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setActiveChart(ct.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeChart === ct.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <ct.icon size={18} /> {ct.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Palette size={14} /> Colors
            </h3>
            <div className="space-y-2">
              {Object.entries(palettes).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setActivePalette(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activePalette === key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}
                >
                  <div className="flex -space-x-1">
                    {p.colors.slice(0, 3).map((c, i) => (
                      <span key={i} className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800">{activeChart.toUpperCase()} Analysis</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  {hasData ? 'Live Preview from Dataset' : 'Awaiting data upload'}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${hasData ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                {hasData ? 'Active' : 'No Data'}
              </span>
            </div>

            <div className="h-[350px] w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
              {hasData ? (
                <>
                  <svg ref={barRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: activeChart === 'bar' ? 'block' : 'none' }} />
                  <svg ref={pieRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: activeChart === 'pie' ? 'block' : 'none' }} />
                  <svg ref={lineRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: activeChart === 'line' ? 'block' : 'none' }} />
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* Stats — only shown when data is present */}
          {hasData && (
            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-white p-4 border border-slate-100 rounded-2xl text-center shadow-sm">
                  <p className="text-lg font-bold text-slate-900">{s.val}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}