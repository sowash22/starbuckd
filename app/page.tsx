"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, RefreshCw, AlertCircle, Quote, ArrowRight, History, Trash2, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Prediction {
  starbuckdName: string;
  rationale: string;
  safeAlias: string;
  struggleRating: string | number;
  provider?: string;
}

function StarbuckdContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ name: string, date: string }[]>([]);

  const lastFetchedName = useRef<string | null>(null);

  const performPrediction = useCallback(async (targetName: string) => {
    if (!targetName.trim()) return;

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get prediction");
      }

      setPrediction(data);

      setHistory(prev => {
        const newHistory = [{ name: targetName, date: new Date().toISOString() }, ...prev.filter(h => h.name !== targetName)].slice(0, 10);
        localStorage.setItem("starbuckd_history", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (err: any) {
      setError(err.message || "The barista is confused. Try shouting again?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateUrl = useCallback((targetName: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("name", targetName);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      handleUpdateUrl(name.trim());
    }
  };
  const handleHomeClick = () => {
    router.push('/', { scroll: false });
    setName("");
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("starbuckd_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam && nameParam !== lastFetchedName.current) {
      lastFetchedName.current = nameParam;
      setName(nameParam);
      performPrediction(nameParam);
    } else if (!nameParam) {
      lastFetchedName.current = null;
      setPrediction(null);
    }
  }, [searchParams, performPrediction]);

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-12 px-4 overflow-hidden bg-background font-body">
      {/* SVG Ink Bleed Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <filter id="marker-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </svg>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto space-y-12"
      >

        <h1
          onClick={handleHomeClick}
          className="text-4xl sm:text-6xl md:text-8xl font-sans font-black tracking-tighter text-text leading-none uppercase text-center flex items-center justify-center gap-3 sm:gap-4 cursor-pointer select-none"
        >
          <Coffee className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#00704A] flex-shrink-0" />
          Starbuck<span className="text-[#6F4E37] ml-[-7px]">&apos;d</span>
          {/* Starbuck<span className="text-[#6F4E37] ml-[-7px]">d</span> */}
        </h1>
        <p className="text-center text-sm md:text-base font-bold text-text/60 uppercase tracking-wide max-w-sm mx-auto">
          Spelled it right, they got it wrong. <br /> Find your <span className="text-[#00704A]">barista-safe alias</span>.
        </p>

        <div className="relative max-w-sm mx-auto w-full pt-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's your name?"
              className="w-full pl-6 pr-20 py-4 text-lg rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 focus:border-[#00704A] focus:ring-4 focus:ring-[#00704A]/20 focus:outline-none transition-all font-body font-bold text-text placeholder:text-text/30 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !name}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center hover:bg-[#6F4E37]/90 transition-all active:scale-95 shadow-lg shadow-[#6F4E37]/30 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
            </button>
          </form>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-sm mx-auto w-full px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-200"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">{error}</p>
                <button
                  onClick={() => name && handleUpdateUrl(name)}
                  className="text-[10px] font-black uppercase tracking-widest mt-1 hover:underline underline-offset-4 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        <AnimatePresence mode="wait">
          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col lg:flex-row items-stretch justify-center gap-8"
            >
              {/* Left Column: The Cup */}
              <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Lid */}
                  <div className="relative z-20 mx-auto w-[70%] h-10 bg-white/80 rounded-t-[2.5rem] shadow-md border-b-4 border-white" />
                  <div className="relative z-10 mx-auto w-[85%] h-4 bg-white/90 rounded-sm shadow-sm" />

                  {/* Cup Body */}
                  <div className="relative mx-auto w-full min-h-[24rem] bg-white/70 backdrop-blur-xl rounded-b-[4rem] shadow-2xl shadow-[#00704A]/10 border-2 border-white/20 cup-taper flex flex-col items-center pt-8 pb-32 px-8 overflow-hidden">
                    <div className="w-16 h-16 rounded-full border-4 border-[#00704A]/20 flex items-center justify-center mb-6 bg-[#00704A]/5">
                      <Coffee className="w-8 h-8 text-[#00704A]/40" />
                    </div>

                    <div className="text-center w-full transform -rotate-1 select-none flex-1 flex flex-col items-center justify-center relative py-4">
                      <span className="text-[10px] font-black text-text/40 uppercase tracking-[0.3em] mb-4 border-b border-text/10 w-1/2 pb-1">Customer</span>
                      <div className="text-5xl md:text-6xl font-marker text-text tracking-tight leading-tight w-full uppercase break-words">
                        {prediction.starbuckdName}
                      </div>
                    </div>

                    {/* Sleeve */}
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-[#6F4E37] shadow-inner flex flex-col items-center justify-center border-t-2 border-[#6F4E37]">
                      <div className="px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                        <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">Barista Difficulty</div>
                        <div className="text-3xl font-black text-white">{prediction.struggleRating}/10</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Unified Analysis Cards */}
              <div className="flex-1 space-y-8 flex flex-col">
                {/* Rationale Card */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border-2 border-white/20 flex flex-col justify-center shadow-lg shadow-[#00704A]/10"
                >
                  <div className="flex items-center gap-4 mb-6 text-[#00704A]">
                    <div className="p-4 rounded-2xl bg-[#00704A]/10">
                      <Quote className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text/40">Why Starbuckd</h3>
                  </div>
                  <p className="text-text/80 italic text-xl md:text-2xl leading-relaxed font-body font-medium">
                    &quot;{prediction.rationale}&quot;
                  </p>
                </motion.div>

                {/* Safe Alias Card */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 rounded-[2.5rem] bg-[#6F4E37] text-white shadow-2xl shadow-[#6F4E37]/20 flex flex-col justify-center items-center py-10 relative overflow-hidden"
                >
                  <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-white/10 blur-[80px] rounded-full rotate-12" />

                  <div className="relative z-10 w-full text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 opacity-70">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">The Barista-Safe Alias</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-sans">
                        {prediction.safeAlias}
                      </div>
                      <p className="text-sm font-medium opacity-80 max-w-xs mx-auto leading-relaxed">
                        Your new Starbucks identity, because some battles aren&apos;t worth fighting before coffee.
                      </p>
                    </div>

                    {/* <div className="pt-6 border-t border-white/20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          100% Legit Alias
                        </div>
                      </div> */}
                  </div>
                </motion.div>

                {/* {prediction.provider && (
                  <div className="text-center md:text-right pt-2">
                    <span className="text-[10px] font-bold text-text/30 uppercase tracking-[0.4em]">
                      AI PRO-MODE: {prediction.provider}
                    </span>
                  </div>
                )} */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous Orders Footer */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-16 border-t border-primary/10"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text/40">Order Queue</h3>
              <button onClick={() => { setHistory([]); localStorage.removeItem("starbuckd_history"); }} className="text-[10px] font-black text-text/30 hover:text-[#00704A] transition-colors uppercase flex items-center gap-2 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
                Clear Queue
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleUpdateUrl(h.name)}
                  className="px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-white/20 text-sm font-bold text-text/60 hover:border-[#6F4E37]/50 hover:text-[#6F4E37] transition-all text-center truncate shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <StarbuckdContent />
    </Suspense>
  );
}
