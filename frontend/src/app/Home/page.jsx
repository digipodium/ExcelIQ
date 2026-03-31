"use client";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #475569;
          }
        `,
        }}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0 transition-colors duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl">
              table_chart
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              ExcelIQ
            </h1>
            <p className="text-xs text-slate-500">AI Data Assistant</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 gap-2 flex flex-col">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-medium">
            <span className="material-symbols-outlined">folder_open</span>
            My Projects
          </a>

          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100">
            <span className="material-symbols-outlined">description</span>
            Templates
          </a>

          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100">
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </a>
        </nav>

        <div className="p-4">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Dashboard
              </h2>
              <p className="text-slate-500">
                Welcome back! Manage your data and generate insights.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg">
              <span className="material-symbols-outlined">add</span>
              New Project
            </button>
          </div>

          {/* Upload Box */}
          <div className="border-2 border-dashed rounded-2xl p-10 text-center bg-white">
            <span className="material-symbols-outlined text-5xl text-emerald-500">
              cloud_upload
            </span>

            <h3 className="text-xl font-bold mt-4">
              Upload New File
            </h3>

            <p className="text-slate-500 mt-2">
              Drag and drop Excel or CSV file
            </p>

            <button className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg">
              Browse Files
            </button>
          </div>

          {/* Recent Projects */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-6">
              Recent Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card */}
              <div className="bg-white rounded-2xl border p-5">
                <span className="material-symbols-outlined text-3xl text-emerald-500">
                  table_view
                </span>

                <h4 className="font-bold mt-3">
                  Q3 Financial Report.xlsx
                </h4>

                <p className="text-sm text-slate-500">
                  Last modified: 2 hours ago
                </p>

                <button className="text-emerald-600 text-sm mt-3">
                  Open Project
                </button>
              </div>

              <div className="bg-white rounded-2xl border p-5">
                <span className="material-symbols-outlined text-3xl text-purple-500">
                  dataset
                </span>

                <h4 className="font-bold mt-3">
                  Customer_List_2023.csv
                </h4>

                <p className="text-sm text-slate-500">
                  Last modified: Yesterday
                </p>

                <button className="text-emerald-600 text-sm mt-3">
                  Open Project
                </button>
              </div>

              <div className="bg-white rounded-2xl border p-5">
                <span className="material-symbols-outlined text-3xl text-blue-500">
                  bar_chart
                </span>

                <h4 className="font-bold mt-3">
                  Inventory_Logs_v2.xlsx
                </h4>

                <p className="text-sm text-slate-500">
                  Last modified: 3 days ago
                </p>

                <button className="text-emerald-600 text-sm mt-3">
                  Open Project
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}