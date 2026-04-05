'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function GeminiPage() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskGemini = async () => {
    // 1. Basic Check
    if (!userInput.trim()) {
      toast.error('Please type a message!');
      return;
    }

    // 2. Direct API Key
    const apiKey = "AIzaSyBCQLvsrAaonUblfoQTzu7xOR1BWPU596E"; 
    
    // 3. Stable API URL
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    setResponse('');
    setIsLoading(true);

    try {
      // 4. Axios POST Request
      const res = await axios.post(url, {
        contents: [{
          parts: [{ text: userInput }]
        }]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // 5. Extract Text from Response
      if (res.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResponse(res.data.candidates[0].content.parts[0].text);
      } else {
        toast.error("No response from Gemini.");
      }

    } catch (error) {
      console.error("Full Error Info:", error.response?.data || error.message);
      
      const status = error.response?.status;
      if (status === 404) {
        toast.error("Error 404: URL or Model Name is incorrect.");
      } else if (status === 400) {
        toast.error("Error 400: Your API Key is likely invalid.");
      } else {
        toast.error("Connection failed. Check your internet or API key.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4 font-sans text-white">
    
      {/* Response Display Area */}
      <div className="w-full max-w-2xl min-h-[150px] mb-8 overflow-y-auto">
        {response && (
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-neutral-200 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] uppercase tracking-widest text-blue-500 mb-3 font-bold">Assistant</p>
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {response}
            </div>
          </div>
        )}
      </div>

      {/* Input Bar (Matches your Image Design) */}
      <div className="w-full max-w-2xl flex items-center gap-3 px-6 py-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.6)] focus-within:border-neutral-700 transition-all">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
          placeholder="Ask me anything..."
          className="flex-grow bg-transparent text-white text-sm outline-none placeholder-neutral-600"
          disabled={isLoading}
        />
        
        <button
          onClick={handleAskGemini}
          disabled={isLoading}
          className="px-6 py-2 rounded-full bg-neutral-800 text-white text-xs font-extrabold hover:bg-neutral-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[70px]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : 'Ask'}
        </button>
      </div>

      <p className="mt-8 text-[10px] text-neutral-700 uppercase tracking-widest font-medium">
        Direct API Mode
      </p>

    </div>
  );
}