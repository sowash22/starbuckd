"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
  ReactNode,
  FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  ArrowUp,
  RotateCcw,
  Mic,
  MicOff,
} from "lucide-react";

const G = "#00704A";
const B = "#1E3932";
const BROWN = "#6F4E37";
const CREAM = "#F2EFE9";

interface Prediction {
  starbuckdName: string;
  struggleRating: number | string;
  rationale: string;
  safeAlias: string;
}

interface HistoryItem {
  name: string;
  date: string;
}

const TOP_BUTCHERED_NAMES = [
  { original: "Srinivasan", cup: "Serena Vision" },
  { original: "Lakshmi", cup: "Lush Me" },
  { original: "Xochitl", cup: "So Chill" },
  { original: "Bhargavi", cup: "Barbie" },
  { original: "Yasodha", cup: "Yasoda" },
  { original: "Nguyen", cup: "Win" },
  { original: "Karthikeyan", cup: "Car Ticket Ian" },
  { original: "Saoirse", cup: "Sersha" },
  { original: "Prudhvi", cup: "Broody" },
  { original: "Siobhan", cup: "Chevon" },
];

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

function AnimNum({ to }: { to: number }) {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 0.4;
      setCur(Math.min(Math.round(start * 10) / 10, to));
      if (start < to) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);

  return <>{cur}</>;
}

function getCupTextLines(rawName: string) {
  const name = (rawName || "").trim();
  if (!name) return ["?"];
  if (name.length <= 8) return [name];

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0];
    const second = parts.slice(1).join(" ");
    if (first.length <= 10 && second.length <= 10) return [first, second];
  }

  const mid = Math.ceil(name.length / 2);
  return [name.slice(0, mid), name.slice(mid)];
}

function Cup({ starbuckdName }: { starbuckdName: string }) {
  const lines = getCupTextLines(starbuckdName);
  const maxLen = Math.max(...lines.map((line) => line.length));
  const fontSize = maxLen > 10 ? 15 : maxLen > 8 ? 17 : 20;
  const startY = lines.length === 1 ? 86 : 78;

  return (
    <svg
      viewBox="0 0 160 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto block w-full max-w-[200px] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
    >
      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EDE8E0" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D8D0C4" />
        </linearGradient>
        <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4A3828" />
          <stop offset="50%" stopColor={BROWN} />
          <stop offset="100%" stopColor="#3A2A1A" />
        </linearGradient>
        <linearGradient id="lid1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CEC6BC" />
          <stop offset="100%" stopColor="#B8B0A4" />
        </linearGradient>
        <clipPath id="cup-clip">
          <path d="M22 28 L138 28 L126 220 Q120 232 80 232 Q40 232 34 220 Z" />
        </clipPath>
      </defs>

      <ellipse cx="80" cy="22" rx="62" ry="10" fill="url(#lid1)" />
      <path
        d="M18 22 Q18 10 28 8 L132 8 Q142 10 142 22"
        stroke="#A8A09A"
        strokeWidth="1.5"
        fill="url(#lid1)"
      />
      <rect x="60" y="6" width="40" height="9" rx="4.5" fill="#AAA29A" />
      <rect x="64" y="8" width="32" height="5" rx="2.5" fill="#B8B0A8" />

      <path d="M22 28 L138 28 L126 220 Q120 232 80 232 Q40 232 34 220 Z" fill="url(#cg1)" />
      <path d="M28 128 L34 220 Q40 232 80 232 Q120 232 126 220 L132 128 Z" fill="url(#sg1)" clipPath="url(#cup-clip)" />

      <circle cx="80" cy="182" r="23" fill="#E8DDD1" opacity="0.96" />
      <circle cx="80" cy="182" r="22" fill="none" stroke="#B89F8A" strokeWidth="1" />
      <path d="M64 185 L72 174 L78.5 182 L84.5 176.5 L96 185 Z" fill="#6F4E37" opacity="0.9" />
      <path
        d="M64 188.5 C70 186.8, 76 186.9, 82 188.2 C88.5 189.5, 92.5 189.4, 96 188.5"
        stroke="#6F4E37"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.88"
      />
      <path
        d="M66 192 C72 190.6, 78 190.8, 84 192.1 C89 193.1, 93 193.2, 95 192.6"
        stroke="#8C6A4F"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />

      <path d="M38 32 L48 28 L52 180 L40 175 Z" fill="white" opacity="0.14" clipPath="url(#cup-clip)" />

      <text
        x="80"
        y={startY}
        textAnchor="middle"
        fill="#2C1A0E"
        fontFamily="'Caveat', 'Permanent Marker', cursive"
        fontSize={fontSize}
        fontWeight="700"
        style={{ transform: "rotate(-2deg)", transformOrigin: "80px 84px" }}
      >
        {lines.map((line, i) => (
          <tspan key={`${line}-${i}`} x="80" dy={i === 0 ? 0 : 18}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

function Steam({ active, compact = false }: { active: boolean; compact?: boolean }) {
  if (!active) return null;

  const waves = [
    { path: "M54 50 C42 40, 66 34, 54 24 C44 16, 62 10, 54 2", delay: 0, duration: 3.2 },
    { path: "M80 50 C68 40, 92 34, 80 24 C70 16, 88 10, 80 2", delay: 0.3, duration: 3.0 },
    { path: "M106 50 C94 40, 118 34, 106 24 C96 16, 114 10, 106 2", delay: 0.6, duration: 3.3 },
  ];

  return (
    <motion.svg
      viewBox="0 0 160 56"
      className={compact ? "mx-auto -mb-0.5 block h-[34px] w-[88px]" : "mx-auto -mb-1.5 block h-[56px] w-[160px]"}
      aria-hidden="true"
    >
      {waves.map((w, i) => (
        <motion.path
          key={i}
          d={w.path}
          fill="none"
          stroke="rgba(244, 238, 230, 0.86)"
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            y: [0, -7, -14],
            x: [0, 1.2, -1.2, 0],
            opacity: [0, 0.62, 0.18, 0],
            pathLength: [0.2, 1, 1],
          }}
          transition={{ duration: w.duration, delay: w.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(0.2px)" }}
        />
      ))}
    </motion.svg>
  );
}

function DifficultyMeter({ rating }: { rating: number }) {
  const color = rating >= 8 ? "#E53935" : rating >= 5 ? BROWN : G;
  const label = rating >= 8 ? "Brutal" : rating >= 6 ? "Rough" : rating >= 4 ? "Meh" : "Easy";

  return (
    <div className="w-full">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9B8E85]">
          How hard is your name?
        </span>
        <span className="text-[13px] font-extrabold" style={{ color }}>
          <AnimNum to={Number(rating)} />
          <span className="text-[10px] opacity-60">/10 — {label}</span>
        </span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-[#E8E2DA]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(rating / 10) * 100}%` }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${color}90, ${color})` }}
        />
      </div>
    </div>
  );
}

function HistoryStrip({
  history,
  onSelect,
  onClear,
}: {
  history: HistoryItem[];
  onSelect: (name: string) => void;
  onClear: () => void;
}) {
  if (!history.length) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#B0A89E]">
          Recent cups
        </span>
        <button
          onClick={onClear}
          className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.06em] text-[#C0B8B0]"
        >
          Clear queue
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((h, i) => (
          <motion.button
            key={`${h.name}-${i}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(h.name)}
            className="cursor-pointer rounded-full border border-[#E4DDD5] bg-white px-4 py-1.5 text-[13px] font-semibold text-[#6F4E37] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-colors hover:border-[#00704A]"
          >
            {h.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function TopButcheredList() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.28 }}
      className="mt-3 rounded-3xl border border-[#DCD2C7] bg-[#F2EFE9] px-3.5 pb-2.5 pt-3 shadow-[0_1px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#B0A89E]">
          Barista&apos;s wall of shame
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#9D8F84]">Top 10</span>
      </div>

      <div className="grid gap-[5px]">
        {TOP_BUTCHERED_NAMES.map((entry, i) => (
          <div key={`${entry.original}-${entry.cup}`} className="flex w-full items-center gap-[5px] py-0.5">
            <span className="min-w-[14px] text-[10px] font-bold text-[#B3A497]">{i + 1}.</span>
            <span className="whitespace-nowrap text-[13px] font-semibold text-[#1E3932]">{entry.original}</span>
            <span className="text-[11px] font-bold text-[#B9AB9E]">→</span>
            <span className="mt-[1px] whitespace-nowrap text-[20px] leading-none text-[#6F4E37] [font-family:'Caveat','Permanent_Marker',cursive]">
              {entry.cup}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Card({ children, delay = 0.05, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-3xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [stage, setStage] = useState<"idle" | "loading" | "result">("idle");
  const [inputVal, setInputVal] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<any>(null);

  const loadingLines = [
    "Hold up, the grinder is louder than your name...",
    "I'm 60% sure I heard that correctly.",
    "Writing with confidence, accuracy TBD...",
    "The marker is moving. No promises.",
    "Brewing you a safer cup identity...",
  ];

  useEffect(() => {
    try {
      const s = localStorage.getItem("sbhist");
      if (s) setHistory(JSON.parse(s));
    } catch {
      // ignore parse errors
    }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const heard = event?.results?.[0]?.[0]?.transcript?.trim();
      if (heard) setInputVal(heard);
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    speechRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // noop
      }
    };
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    setLoadingLineIndex(0);
    const id = window.setInterval(() => {
      setLoadingLineIndex((prev) => (prev + 1) % loadingLines.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [stage, loadingLines.length]);

  const predict = useCallback(async (name: string) => {
    if (!name.trim()) return;

    setStage("loading");
    setError("");
    setPrediction(null);
    setSubmittedName(name);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setPrediction(data);
      setStage("result");

      setHistory((prev) => {
        const next = [{ name, date: new Date().toISOString() }, ...prev.filter((h) => h.name !== name)].slice(0, 8);
        localStorage.setItem("sbhist", JSON.stringify(next));
        return next;
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStage("idle");
    }
  }, []);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (inputVal.trim()) predict(inputVal.trim());
  };

  const reset = () => {
    setStage("idle");
    setPrediction(null);
    setInputVal("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 120);
    setTimeout(() => inputRef.current?.focus(), 420);
  };

  const toggleListening = () => {
    const recognition = speechRef.current;
    if (!recognition) return;

    try {
      if (isListening) recognition.stop();
      else {
        setError("");
        recognition.start();
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1E3932] px-5 py-8 [font-family:'Inter',sans-serif] antialiased">
      <div className="relative z-[1] mx-auto w-full max-w-[480px]">
        <motion.div
          onClick={stage === "result" ? reset : undefined}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 select-none text-center"
        >
          <div className="text-[clamp(58px,15vw,86px)] font-bold leading-[0.92] tracking-[0.2px] text-[#E6D5C6] [font-family:'Caveat','Comic_Sans_MS','Trebuchet_MS',cursive] [text-shadow:0_1px_5px_rgba(0,0,0,0.12)]">
            Starbuck<span className="ml-[-4px] text-[#B58963]">&apos;d</span>
          </div>
          <p className="mt-2.5 text-[13px] font-semibold tracking-[0.02em] text-[#C9C0B7]">
            I&apos;ll butcher your name, hand you a safer alias, and we&apos;ll never speak of this again.
          </p>
        </motion.div>

        <AnimatePresence>
          {stage !== "result" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {error && (
                <div className="mb-4 rounded-[14px] border border-[#FFD0D0] bg-[#FFF2F2] px-[18px] py-3 text-[13px] font-semibold text-[#C0392B]">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={submit} className="relative mb-4">
                <input
                  ref={inputRef}
                  className="w-full rounded-[20px] border-2 border-transparent bg-white px-6 py-5 pr-32 text-lg font-semibold text-[#1E3932] shadow-[0_2px_20px_rgba(0,0,0,0.08),0_0_0_1px_#E4DDD5] outline-none transition placeholder:font-normal placeholder:text-[#C0B8B0] focus:border-[#00704A] focus:shadow-[0_2px_20px_rgba(0,0,0,0.08),0_0_0_4px_rgba(0,112,74,0.12)]"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Drop your name. I’ll do my worst."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {speechSupported && (
                  <button
                    type="button"
                    className={`absolute right-[66px] top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-xl border border-[#DDD3C8] bg-[#F4F0EA] text-[#8D7A6A] transition hover:border-[#00704A] hover:bg-[#F6FBF9] hover:text-[#00704A] active:scale-95 ${isListening ? "border-[#00704A] bg-[#00704A] text-white shadow-[0_4px_14px_rgba(0,112,74,0.25)]" : ""}`}
                    onClick={toggleListening}
                    aria-label={isListening ? "Stop listening" : "Speak your name"}
                    title={isListening ? "Stop listening" : "Speak your name"}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}

                <button
                  className="absolute right-2.5 top-1/2 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#00704A] text-white shadow-[0_4px_14px_rgba(0,112,74,0.35)] transition hover:bg-[#005C3B] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#D0C8C0] disabled:shadow-none"
                  type="submit"
                  disabled={!inputVal.trim() || stage === "loading"}
                >
                  {stage === "loading" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <ArrowUp size={18} />
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "loading" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <Steam active={true} />
              <div className="animate-[float_1.5s_ease-in-out_infinite]">
                <Cup starbuckdName="???" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-[#A89E94]">
                {loadingLines[loadingLineIndex]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage === "result" && prediction && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              <Card delay={0.05} className="border-[#DCD2C7] bg-[#F2EFE9] px-7 py-6 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
                <div className="mb-4 grid grid-cols-[1fr_52px_1fr] items-start gap-x-10">
                  <div className="min-w-0">
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#B0A89E]">
                      You said
                    </div>
                    <div className="whitespace-nowrap text-left font-serif text-[clamp(24px,6vw,32px)] font-black leading-[1.05] text-[#1E3932] sm:whitespace-nowrap">
                      {submittedName}
                    </div>
                  </div>

                  <div className="flex translate-y-[24px] items-center justify-center text-2xl text-[#D0C8C0]">→</div>

                  <div className="min-w-0">
                    <div className="mb-1.5 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-[#B0A89E]">
                      I heard
                    </div>
                    <div className="whitespace-nowrap text-left text-[clamp(24px,6vw,32px)] font-extrabold leading-[1.05] text-[#6F4E37] [font-family:'Caveat','Permanent_Marker',cursive] sm:whitespace-nowrap">
                      {prediction.starbuckdName}
                    </div>
                  </div>
                </div>

                <DifficultyMeter rating={Number(prediction.struggleRating)} />
              </Card>

              <Card delay={0.12} className="border-[#0C5F41] bg-gradient-to-br from-[#00704A] via-[#006241] to-[#005236] p-0 shadow-[0_6px_24px_rgba(0,67,45,0.35)]">
                <div className="relative overflow-hidden rounded-[20px] px-7 py-1">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="max-w-[68%]">
                      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/60">
                        ✦ Your coffee safe alias
                      </div>
                      <div className="font-serif text-[clamp(34px,9vw,50px)] font-black leading-none tracking-[-1px] text-white">
                        {prediction.safeAlias}
                      </div>
                      <div className="mt-4 text-xs font-medium text-white/70">
                        Because some battles are not worth fighting over coffee.
                      </div>
                    </div>
                    <div className="relative z-10 flex w-[90px] shrink-0 flex-col items-center justify-center sm:w-[118px]">
                      <Steam active={true} compact={true} />
                      <Cup starbuckdName={prediction.safeAlias} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card delay={0.2} className="border-[#DCD2C7] bg-[#F2EFE9] px-[26px] py-[22px] shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
                <span className="inline-flex items-center gap-[5px] rounded-full border border-[#6F4E3730] bg-[#6F4E3718] px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.08em] text-[#6F4E37]">
                  ☕ why I butchered
                </span>
                <p className="mt-3 text-[15px] font-normal leading-[1.7] text-[#5A4E46]">
                  {prediction.rationale}
                </p>
              </Card>

              <div className="mt-2 flex items-center justify-center">
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-[#E4DDD5] bg-white px-[22px] py-[11px] text-[13px] font-semibold text-[#8A8078] shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:border-[#00704A] hover:text-[#00704A] hover:shadow-[0_2px_10px_rgba(0,112,74,0.12)]"
                  onClick={reset}
                >
                  <RotateCcw size={13} />
                  Ruin another name
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center pb-3 pt-8 text-center"
            >
              <div className="opacity-35">
                <Cup starbuckdName="your name?" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage !== "loading" && (
          <motion.div className="mt-8">
            <HistoryStrip
              history={history}
              onSelect={(name) => {
                setInputVal(name);
                predict(name);
              }}
              onClear={() => {
                setHistory([]);
                localStorage.removeItem("sbhist");
              }}
            />
            <TopButcheredList />
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#1E3932]">
          <RefreshCw size={24} className="animate-spin text-[#00704A]" />
        </div>
      }
    >
      <App />
    </Suspense>
  );
}
