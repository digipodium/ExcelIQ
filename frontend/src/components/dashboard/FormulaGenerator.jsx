'use client';
import { useState } from 'react';
import { FunctionSquare, Sparkles, Copy, Lightbulb, Clock, BookOpen, Info } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FormulaGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('=SUMIFS(C:C, A:A, "Marketing")'); // Default value
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Kuch likhiye!");

    setLoading(true);
    setExplanation(''); // Clear previous explanation
    try {
      const res = await axios.post('http://localhost:5000/ai/generate-formula', { prompt });
      setResult(res.data.formula);
      toast.success("Formula generated!");
    } catch (error) {
      toast.error("Error generating formula");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!result) return toast.error("Generate a formula first!");
    
    setExplaining(true);
    setExplanation("Generating explanation...");
    try {
      const explainRes = await axios.post('http://localhost:5000/ai/explain-formula', { formula: result });
      setExplanation(explainRes.data.explanation);
    } catch (explainError) {
      setExplanation("Failed to load explanation.");
      toast.error("Error explaining formula");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="space-y-6">


      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-4">What do you want to calculate?</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Find the average salary for Marketing department"'
                className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 outline-none"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-violet-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-violet-700 transition shadow-md disabled:opacity-50"
              >
                <Sparkles size={18} /> {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2"><Lightbulb size={18} className="text-amber-400" /> Result</h3>
              <button
                onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                className="flex items-center gap-2 text-xs bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                <Copy size={14} /> Copy
              </button>
            </div>
            <code className="text-xl font-mono text-violet-300 block bg-black/30 p-6 rounded-2xl border border-white/10">
              {result}
            </code>
          </div>
        </div>
        {/* FORMULA EXPLANATION SECTION */}
        <div className="lg:col-span-1 h-full">
          {explanation ? (
            <div className="bg-amber-50/70 border border-amber-100 rounded-3xl p-6 h-full w-full shadow-sm">
              <h3 className="font-bold flex items-center gap-2 text-amber-800 mb-4 pb-4 border-b border-amber-200/60">
                <BookOpen size={18} className="text-amber-600" />
                Formula Explanation & Learning
              </h3>
              <div className="text-sm text-amber-900 leading-relaxed font-medium whitespace-pre-wrap">
                {explanation}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-700 mb-2">Learn the Logic</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Generate or select a formula to see its step-by-step breakdown.</p>
              <button 
                onClick={handleExplain} 
                disabled={explaining || !result}
                className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50"
              >
                <BookOpen size={18} /> {explaining ? 'Explaining...' : 'Explain Formula'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}