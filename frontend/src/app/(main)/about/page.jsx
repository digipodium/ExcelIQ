import React from 'react';

const Company = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 via-white to-indigo-200 py-16">

      {/* About Section */}
      <section id="about" className="scroll-mt-32 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ExcelIQ</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            <strong>ExcelIQ</strong> is an AI-powered Excel Assistant designed to simplify spreadsheet tasks using natural language.
            It helps users analyze data, generate formulas, clean datasets, and create visualizations without needing advanced Excel skills.
            Our goal is to make Excel smarter, faster, and more accessible for everyone.
          </p>
        </div>

        {/* Team Section */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Team ExcelIQ
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Member 1 */}
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">
                Ratan Prakash Verma
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Frontend Developer & AI Integration
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Natural Language Query Interface</li>
                <li>AI Response Integration</li>
                <li>Interactive UI & Data Visualization</li>
              </ul>
            </div>

            {/* Member 2 */}
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                Rajeshwar Pratap Singh
              </h3>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Backend Developer & System Architecture
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Server & API Development</li>
                <li>Excel File Processing System</li>
                <li>Database & Performance Optimization</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Optional: Remove this section if not needed */}
      {/* You can later replace with real blog or features */}

    </div>
  );
};

export default Company;