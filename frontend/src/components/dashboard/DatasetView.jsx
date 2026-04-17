import React, { useState, useEffect } from 'react';
import { Table, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatasetView({ isOpen, onClose, fileData, fileName }) {
  // 🔥 Page track karne ke liye state
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_ROWS = 100;

  // Jab bhi modal open ho, page 1 par reset kar dein
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen, fileData]);

  if (!isOpen) return null;

  const totalRows = fileData?.rows?.length || 0;
  const totalPages = Math.ceil(totalRows / MAX_ROWS);

  // Kaunsi rows dikhani hain uska calculation
  const startIndex = (currentPage - 1) * MAX_ROWS;
  const endIndex = startIndex + MAX_ROWS;
  const displayRows = fileData?.rows?.slice(startIndex, endIndex) || [];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
                  {displayRows.length > 0 ? (
                    displayRows.map((row, rowIdx) => (
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
          
          <p className="font-medium">
            Showing <span className="text-indigo-600 font-bold">{startIndex + 1}</span> to <span className="text-indigo-600 font-bold">{Math.min(endIndex, totalRows)}</span> of <span className="text-indigo-600 font-bold">{totalRows}</span> rows
          </p>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="font-semibold text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

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
