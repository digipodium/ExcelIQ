import React from "react";

const Home = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-20">

      {/* Background Glow Effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* Title */}
        <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Upload Your Excel. Get Instant Insights.

        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-gray-600 text-lg md:text-xl leading-relaxed">
         AI-powered spreadsheet automation in seconds.
        </p>

        {/* Update Alert */}
        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          All systems running smoothly. Some files may take a few seconds.
        </div>

        {/* Input + Button */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">

          <input
            type="text"
            placeholder="Upload Your file here..."
            className="w-full flex-1 px-6 py-4 rounded-xl border border-indigo-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300">
            Upload
          </button>

         

        </div>

      </div>
    </section>
  );
};

export default Home;