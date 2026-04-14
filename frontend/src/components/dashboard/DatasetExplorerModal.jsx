import React from 'react';
import { Table, X } from 'lucide-react';

export default function DatasetExplorerModal({ isOpen, onClose, fileData, fileName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/40">
      <div className="bg-white rounded-3xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Table className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Data Explorer</h2>
              <p className="text-sm text-slate-500">Previewing uploaded dataset: <span className="font-semibold">{fileName || 'Unknown File'}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Modal Body - Table (scrollable) */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm shadow-slate-200/50">
                  <tr>
                    {fileData?.headers?.map((header, idx) => (
                      <th key={idx} className="py-3 px-4 font-semibold border-b border-slate-200">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {fileData?.rows?.length > 0 ? (
                    fileData.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors">
                        {fileData.headers.map((_, colIdx) => (
                          <td key={colIdx} className="py-3 px-4 max-w-xs truncate" title={row[colIdx] !== undefined ? String(row[colIdx]) : ''}>
                            {row[colIdx]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={Math.max(fileData?.headers?.length || 1, 1)} className="py-12 text-center text-slate-400">
                        No preview data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between text-sm text-slate-500">
          <p className="font-medium">Showing <span className="text-indigo-600 font-bold">{fileData?.rows?.length || 0}</span> rows</p>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shadow-sm"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
