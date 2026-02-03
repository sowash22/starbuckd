"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, RefreshCw, AlertCircle, Quote, ArrowRight, History, Trash2, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prediction {
  starbucksName: string;
  rationale: string;
  safeAlias: string;
  struggleRating: string | number;
  provider?: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ name: string, date: string }[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("starbucks_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleButcher = async (e: React.FormEvent | string) => {
    const targetName = typeof e === 'string' ? e : name;
    if (typeof e !== 'string') e.preventDefault();

    if (!targetName.trim()) return;

    setLoading(true);
    setError("");
    setPrediction(null);
    if (typeof e === 'string') setName(targetName);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });

      if (!res.ok) throw new Error("Failed to get prediction");

      const data = await res.json();
      setPrediction(data);

      const newHistory = [{ name: targetName, date: new Date().toISOString() }, ...history.filter(h => h.name !== targetName)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("starbucks_history", JSON.stringify(newHistory));
    } catch (err) {
      setError("The barista is confused. Try shouting again?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-12 px-4 overflow-hidden bg-white dark:bg-neutral-950 font-sans">
      {/* SVG Ink Bleed Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="marker-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </svg>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-900/[0.03] blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto space-y-12"
      >
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-600/20 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Identity Crisis Simulator</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 leading-none uppercase">
            Starbuck<span className="text-emerald-600">&apos;d</span>
          </h1>

          <div className="relative max-w-sm mx-auto w-full pt-4">
            <form onSubmit={handleButcher} className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What's your name?"
                className="w-full pl-6 pr-14 py-4 text-lg rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 focus:border-emerald-600 transition-all font-bold placeholder:text-neutral-300 shadow-sm"
              />
              <button
                type="submit"
                disabled={loading || !name}
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-500/10"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col lg:flex-row items-stretch justify-center gap-6"
            >
              {/* Left Column: The Cup */}
              <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col pt-12">
                <div className="relative">
                  {/* Steam */}
                  <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none z-0">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-1.5 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full blur-md animate-steam" style={{ animationDelay: `${i * 0.7}s` }} />
                    ))}
                  </div>

                  {/* Lid */}
                  <div className="relative z-20 mx-auto w-[70%] h-8 bg-neutral-100 dark:bg-neutral-800 rounded-t-[2.5rem] shadow-sm border-b-2 border-neutral-200 dark:border-neutral-700" />
                  <div className="relative z-10 mx-auto w-[85%] h-3 bg-neutral-200 dark:bg-neutral-700 rounded-sm shadow-sm" />

                  {/* Realistically Proportioned Cup */}
                  <div className="relative mx-auto w-full min-h-[20rem] md:min-h-[22rem] paper-texture rounded-b-[4rem] shadow-2xl border-x border-b border-neutral-200 dark:border-neutral-800 cup-taper flex flex-col items-center pt-8 pb-32 px-8 overflow-hidden transition-all duration-500">

                    {/* Tick Boxes */}
                    <div className="absolute left-6 top-8 opacity-20 space-y-1.5 hidden md:block">
                      {['D', 'S', 'S', 'M', 'C', 'D'].map((l, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-4 h-4 border border-neutral-400 dark:border-neutral-600 rounded-sm" />
                          <span className="text-[6px] font-black">{l}</span>
                        </div>
                      ))}
                    </div>

                    <div className="w-14 h-14 rounded-full border-2 border-emerald-600/30 flex items-center justify-center mb-6">
                      <Coffee className="w-7 h-7 text-emerald-600/40" />
                    </div>

                    {/* The Name */}
                    <div className="text-center w-full transform -rotate-1 select-none flex-1 flex flex-col items-center justify-center relative py-4">
                      <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-4 border-b border-neutral-100 dark:border-neutral-800 w-1/2 pb-1">Customer</span>
                      <div className="text-4xl md:text-5xl font-marker text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight w-full uppercase break-words">
                        {prediction.starbucksName}
                      </div>
                    </div>

                    {/* Sleeve - Pinned to bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-[#c4a484] dark:bg-[#3d2b1f] shadow-inner flex flex-col items-center justify-center border-t border-black/5">
                      <div className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-black/5">
                        <div className="text-[8px] font-black text-[#3d2b1f] dark:text-[#c4a484] uppercase tracking-[0.2em] mb-1 opacity-60">Barista Difficulty</div>
                        <div className="text-2xl font-black text-[#3d2b1f] dark:text-[#c4a484]">{prediction.struggleRating}/10</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Unified Analysis Cards */}
              <div className="flex-1 space-y-6 flex flex-col lg:pt-12">
                {/* Rationale Card */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 p-8 rounded-[2rem] bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-4 mb-6 text-emerald-600">
                    <div className="p-3 rounded-2xl bg-emerald-600/10">
                      <Quote className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">The Psychology</h3>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 italic text-xl md:text-2xl leading-relaxed font-medium">
                    &quot;{prediction.rationale}&quot;
                  </p>
                </motion.div>

                {/* Safe Alias Card - Matching height when possible */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 rounded-[2rem] bg-emerald-600 text-white shadow-2xl flex flex-col justify-center items-center py-10 relative overflow-hidden"
                >
                  <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-white/10 blur-[80px] rounded-full rotate-12" />

                  <div className="relative z-10 w-full text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 opacity-60">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">The Barista-Safe Alias</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                        {prediction.safeAlias}
                      </div>
                      <p className="text-sm font-medium opacity-80 max-w-[280px] mx-auto leading-relaxed">
                        Use this one next time to avoid the silent judgment and spelling lessons.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        100% Legit Alias
                      </div>
                    </div>
                  </div>
                </motion.div>

                {prediction.provider && (
                  <div className="text-center md:text-right pt-2">
                    <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-[0.4em]">
                      AI PRO-MODE: {prediction.provider}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Orders Footer */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-16 border-t border-neutral-100 dark:border-neutral-900"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Order Queue</h3>
              <button onClick={() => { setHistory([]); localStorage.removeItem("starbucks_history"); }} className="text-[10px] font-black text-neutral-300 hover:text-red-500 transition-colors uppercase flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" />
                Clear Queue
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleButcher(h.name)}
                  className="px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-500 hover:border-emerald-600 hover:text-emerald-600 transition-all text-center truncate"
                >
                  {h.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
