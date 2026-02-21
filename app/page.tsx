"use client";

import { useState, useEffect, useCallback, useRef, Suspense, ReactNode, CSSProperties, FormEvent, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { RefreshCw, ArrowUp, RotateCcw, Mic, MicOff } from "lucide-react";

// ─── Theme ───────────────────────────────────────────────────────────────────
const G = "#00704A";
const B = "#1E3932";
const BROWN = "#6F4E37";
const CREAM = "#F2EFE9";

// ─── Utility ─────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

// ─── Tilt Card wrapper ────────────────────────────────────────────────────────
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

function TiltCard({ children, className, style, delay = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 30 });
  const sry = useSpring(ry, { stiffness: 200, damping: 30 });

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    rx.set(y * -10);
    ry.set(x * 10);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", perspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated number ──────────────────────────────────────────────────────────
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

// ─── Cup illustration ─────────────────────────────────────────────────────────
function Cup({ starbuckdName }: { starbuckdName: string }) {
  const lines = getCupTextLines(starbuckdName);
  const maxLen = Math.max(...lines.map((line) => line.length));
  const fontSize = maxLen > 10 ? 15 : maxLen > 8 ? 17 : 20;
  const startY = lines.length === 1 ? 88 : 80;

  return (
    <svg viewBox="0 0 160 250" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 200, margin: "0 auto", display: "block", filter: "drop-shadow(0 24px 45px rgba(0,0,0,0.22))" }}>
      <defs>
        <linearGradient id="cupMain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5F2EE" />
          <stop offset="35%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F0ECE4" />
          <stop offset="100%" stopColor="#D9D3C7" />
        </linearGradient>
        <linearGradient id="sleeveMain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="50%" stopColor={BROWN} />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
        <linearGradient id="lidMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DED8D0" />
          <stop offset="40%" stopColor="#CFC8BF" />
          <stop offset="100%" stopColor="#BDB5AA" />
        </linearGradient>
        <filter id="innerShadow">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="black" floodOpacity="0.2" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComponentTransfer in="shadow" result="shadow">
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
        <clipPath id="cupClipNew">
          <path d="M22 35 L138 35 L126 230 Q120 242 80 242 Q40 242 34 230 Z" />
        </clipPath>
      </defs>

      {/* Shadow under lid */}
      <ellipse cx="80" cy="38" rx="60" ry="8" fill="black" opacity="0.1" />

      {/* Cup body */}
      <path d="M22 35 L138 35 L126 230 Q120 242 80 242 Q40 242 34 230 Z" fill="url(#cupMain)" />

      {/* Subtle vertical texture on cup */}
      <g opacity="0.05">
        <line x1="40" y1="40" x2="48" y2="230" stroke="#000" strokeWidth="0.5" />
        <line x1="120" y1="40" x2="112" y2="230" stroke="#000" strokeWidth="0.5" />
      </g>

      {/* Sleeve */}
      <path d="M28 135 L34 230 Q40 242 80 242 Q120 242 126 230 L132 135 Z" fill="url(#sleeveMain)" clipPath="url(#cupClipNew)" />

      {/* Sleeve texture lines */}
      <g clipPath="url(#cupClipNew)" opacity="0.1">
        {[145, 160, 175, 190, 205, 220].map((y) => (
          <path key={y} d={`M20 ${y} Q80 ${y + 5} 140 ${y}`} stroke="white" strokeWidth="0.8" fill="none" />
        ))}
      </g>

      {/* Emblem on sleeve */}
      <g transform="translate(80, 192)">
        <circle r="26" fill="#F8F4F0" opacity="0.95" />
        <circle r="24" fill="none" stroke="#D7CCC8" strokeWidth="1" />
        {/* Simplified mountain logo */}
        <path d="M-14 8 L-6 -8 L2 4 L10 -4 L18 8 Z" fill={BROWN} opacity="0.85" />
        <path d="M-15 12 C-8 10, 8 10, 15 12" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Lid */}
      <g filter="url(#innerShadow)">
        <ellipse cx="80" cy="28" rx="64" ry="12" fill="url(#lidMain)" />
        <path d="M16 28 Q16 12 28 10 L132 10 Q144 12 144 28" stroke="#A8A09A" strokeWidth="1" fill="url(#lidMain)" />
        {/* Recessed top part */}
        <ellipse cx="80" cy="24" rx="45" ry="6" fill="none" stroke="#A8A09A" strokeWidth="0.5" opacity="0.5" />
        {/* Sip hole */}
        <rect x="58" y="8" width="44" height="10" rx="5" fill="#9E948A" />
        <rect x="62" y="10" width="36" height="6" rx="3" fill="#B0A69C" />
      </g>

      {/* Highlights and glares */}
      <path d="M38 45 L48 40 L52 220 L42 225 Z" fill="white" opacity="0.12" clipPath="url(#cupClipNew)" />
      <path d="M110 40 L120 45 L110 225 L100 220 Z" fill="white" opacity="0.06" clipPath="url(#cupClipNew)" />

      {/* Name text */}
      <text
        x="80"
        y={startY}
        textAnchor="middle"
        fill="#1A110A"
        fontFamily="'Caveat', 'Permanent Marker', cursive"
        fontSize={fontSize}
        fontWeight="700"
        style={{ transform: "rotate(-1.5deg)", transformOrigin: "80px 84px", filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0,0,0,0.1))" }}
      >
        {lines.map((line, i) => (
          <tspan key={`${line}-${i}`} x="80" dy={i === 0 ? 0 : 20}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

// ─── Steam ────────────────────────────────────────────────────────────────────
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
      style={{
        display: "block",
        width: compact ? 88 : 160,
        height: compact ? 34 : 56,
        margin: compact ? "0 auto -2px" : "0 auto -6px",
        pointerEvents: "none",
      }}
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
          transition={{
            duration: w.duration,
            delay: w.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "blur(0.2px)" }}
        />
      ))}
    </motion.svg>
  );
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children, color = G }: { children: ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      background: color + "18", color: color, border: `1px solid ${color}30`,
    }}>{children}</span>
  );
}

// ─── Difficulty meter ─────────────────────────────────────────────────────────
function DifficultyMeter({ rating }: { rating: number }) {
  const color = rating >= 8 ? "#E53935" : rating >= 5 ? BROWN : G;
  const label = rating >= 8 ? "Brutal" : rating >= 6 ? "Rough" : rating >= 4 ? "Meh" : "Easy";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#9B8E85", letterSpacing: "0.08em", textTransform: "uppercase" }}>How hard this is to hear</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>
          <AnimNum to={Number(rating)} />
          <span style={{ fontSize: 10, opacity: 0.6 }}>/10 — {label}</span>
        </span>
      </div>
      <div style={{ height: 5, background: "#E8E2DA", borderRadius: 99, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(rating / 10) * 100}%` }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", background: `linear-gradient(to right, ${color}90, ${color})`, borderRadius: 99 }}
        />
      </div>
    </div>
  );
}

// ─── History strip ────────────────────────────────────────────────────────────
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

interface HistoryStripProps {
  history: HistoryItem[];
  onSelect: (name: string) => void;
  onClear: () => void;
}

function HistoryStrip({ history, onSelect, onClear }: HistoryStripProps) {
  if (!history.length) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#B0A89E", letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent cups</span>
        <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#C0B8B0", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "inherit" }}>
          Clear queue
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {history.map((h, i) => (
          <motion.button key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(h.name)}
            style={{
              padding: "7px 16px", borderRadius: 99,
              background: "white", border: "1.5px solid #E4DDD5",
              fontSize: 13, fontWeight: 600, color: BROWN,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => e.currentTarget.style.borderColor = G}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => e.currentTarget.style.borderColor = "#E4DDD5"}
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
      className="card"
      style={{ marginTop: 12, padding: "12px 14px 11px", borderColor: "#DCD2C7", background: CREAM, boxShadow: "0 1px 10px rgba(0,0,0,0.03)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#B0A89E", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Barista&apos;s wall of shame
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9D8F84", letterSpacing: "0.06em", textTransform: "uppercase" }}>Top 10</span>
      </div>

      <div style={{ display: "grid", gap: 5 }}>
        {TOP_BUTCHERED_NAMES.map((entry, i) => (
          <div
            key={`${entry.original}-${entry.cup}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "2px 0",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: "#B3A497", minWidth: 14 }}>{i + 1}.</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: B, whiteSpace: "nowrap" }}>
              {entry.original}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#B9AB9E" }}>→</span>
            <span style={{
              fontFamily: "'Caveat', 'Permanent Marker', cursive",
              fontSize: 20,
              lineHeight: 1,
              color: BROWN,
              transform: "rotate(-2deg)",
              whiteSpace: "nowrap",
              marginTop: 1,
            }}>{entry.cup}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Prediction {
  starbuckdName: string;
  struggleRating: number | string;
  rationale: string;
  safeAlias: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
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
    try { const s = localStorage.getItem("sbhist"); if (s) setHistory(JSON.parse(s)); } catch { }
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
      try { recognition.stop(); } catch { }
    };
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    setLoadingLineIndex(0);
    const id = window.setInterval(() => {
      setLoadingLineIndex(prev => (prev + 1) % loadingLines.length);
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
      setHistory(prev => {
        const next = [{ name, date: new Date().toISOString() }, ...prev.filter(h => h.name !== name)].slice(0, 8);
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
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const toggleListening = () => {
    const recognition = speechRef.current;
    if (!recognition) return;

    try {
      if (isListening) {
        recognition.stop();
      } else {
        setError("");
        recognition.start();
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Caveat:wght@700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: ${CREAM};
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }
        ::selection { background: ${G}30; }

        .root {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 20px;
          position: relative;
          overflow: hidden;
        }
        /* Background blobs */
        .root::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 85% 10%, rgba(0,112,74,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 10% 90%, rgba(111,78,55,0.07) 0%, transparent 70%);
        }

        .wrap {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Logo */
        .logo {
          text-align: center;
          margin-bottom: 40px;
          cursor: pointer;
          user-select: none;
        }
        .logo-text {
          font-family: 'Caveat', 'Comic Sans MS', 'Trebuchet MS', cursive;
          font-size: clamp(58px, 15vw, 86px);
          font-weight: 700;
          color: #E6D5C6;
          line-height: 0.92;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.12);
        }
        .logo-accent { color: ${G}; }
        .logo-sub {
          margin-top: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #C9C0B7;
          letter-spacing: 0.02em;
        }

        /* Input area */
        .input-wrap {
          position: relative;
          margin-bottom: 16px;
        }
        .main-input {
          width: 100%;
          padding: 20px 128px 20px 24px;
          font-size: 18px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          color: ${B};
          background: white;
          border: 2px solid transparent;
          border-radius: 20px;
          outline: none;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px #E4DDD5;
          transition: box-shadow 0.2s, border-color 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .main-input::placeholder { color: #C0B8B0; font-weight: 400; }
        .main-input:focus {
          border-color: ${G};
          box-shadow: 0 2px 20px rgba(0,0,0,0.08), 0 0 0 4px rgba(0,112,74,0.12);
        }
        .go-btn {
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          width: 50px; height: 50px;
          border-radius: 14px;
          background: ${G};
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: white;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 4px 14px rgba(0,112,74,0.35);
        }
        .go-btn:hover { background: #005C3B; }
        .go-btn:active { transform: translateY(-50%) scale(0.92); }
        .go-btn:disabled { background: #D0C8C0; box-shadow: none; cursor: not-allowed; }
        .mic-btn {
          position: absolute;
          right: 66px; top: 50%;
          transform: translateY(-50%);
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #F4F0EA;
          border: 1.5px solid #DDD3C8;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #8D7A6A;
          transition: all 0.15s;
        }
        .mic-btn:hover { border-color: ${G}; color: ${G}; background: #F6FBF9; }
        .mic-btn:active { transform: translateY(-50%) scale(0.95); }
        .mic-btn.active {
          border-color: ${G};
          color: white;
          background: ${G};
          box-shadow: 0 4px 14px rgba(0,112,74,0.25);
        }

        /* Error */
        .error-bar {
          padding: 12px 18px;
          background: #FFF2F2;
          border: 1.5px solid #FFD0D0;
          border-radius: 14px;
          color: #C0392B;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        /* Card base */
        .card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid rgba(0,0,0,0.06);
          box-shadow: 0 4px 32px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Result section */
        .result-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Name reveal card */
        .name-card {
          padding: 28px;
          position: relative;
          background: ${CREAM};
          border-color: #DCD2C7;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
        }
        .names-row {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 24px;
        }
        .name-block {
          flex: 1;
          min-width: 0;
        }
        .name-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B0A89E;
          margin-bottom: 4px;
        }
        .name-val {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px, 6vw, 32px);
          font-weight: 900;
          line-height: 1.05;
          color: ${B};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name-val.butchered {
          color: ${BROWN};
          font-style: italic;
        }
        .arrow-div {
          padding: 0 16px;
          font-size: 22px;
          color: #D0C8C0;
          flex-shrink: 0;
        }

        /* Alias banner */
        .alias-banner {
          background: ${G};
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }
        .alias-banner::after {
          content: '';
          position: absolute;
          top: -50%; right: -10%;
          width: 50%; height: 200%;
          background: rgba(255,255,255,0.07);
          border-radius: 50%;
          pointer-events: none;
        }
        .alias-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(34px, 9vw, 50px);
          font-weight: 900;
          color: white;
          line-height: 1;
          letter-spacing: -1px;
        }
        .alias-cup { flex-shrink: 0; width: 90px; }

        /* Rationale */
        .rationale-card {
          padding: 22px 26px;
          background: ${CREAM};
          border-color: #DCD2C7;
          box-shadow: 0 2px 14px rgba(0,0,0,0.04);
        }
        .rationale-text {
          font-size: 15px;
          line-height: 1.7;
          color: #5A4E46;
          font-weight: 400;
        }

        /* Bottom row */
        .bottom-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }
        .retry-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px;
          border-radius: 99px;
          background: white;
          border: 1.5px solid #E4DDD5;
          font-size: 13px;
          font-weight: 600;
          color: #8A8078;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .retry-btn:hover {
          border-color: ${G};
          color: ${G};
          box-shadow: 0 2px 10px rgba(0,112,74,0.12);
        }

        /* Loading cup bounce */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float { animation: float 1.5s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 420px) {
          .alias-banner { flex-direction: column; text-align: center; }
          .alias-cup { display: none; }
          .logo-text { font-size: 52px; }
        }
      `}</style>

      <div className="root">
        <div className="wrap">
          {/* Logo */}
          <motion.div
            className="logo"
            onClick={stage === "result" ? reset : undefined}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="logo-text">
              {/* <Coffee className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#00704A] flex-shrink-0" /> */}
              Starbuck<span className="text-[#B58963] ml-[-4px]">&apos;d</span>
            </div>
            <p className="logo-sub">I&apos;ll butcher your name, hand you a safer alias, and we&apos;ll never speak of this again.</p>
          </motion.div>

          {/* Input */}
          <AnimatePresence>
            {stage !== "result" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {error && <div className="error-bar">⚠ {error}</div>}
                <form onSubmit={submit} className="input-wrap">
                  <input
                    ref={inputRef}
                    className="main-input"
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Drop your name. I’ll do my worst."
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      className={`mic-btn ${isListening ? "active" : ""}`}
                      onClick={toggleListening}
                      aria-label={isListening ? "Stop listening" : "Speak your name"}
                      title={isListening ? "Stop listening" : "Speak your name"}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  )}
                  <button className="go-btn" type="submit" disabled={!inputVal.trim() || stage === "loading"}>
                    {stage === "loading"
                      ? <RefreshCw size={18} style={{ animation: "spin 0.7s linear infinite" }} />
                      : <ArrowUp size={18} />
                    }
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {stage === "loading" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                style={{ textAlign: "center", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <Steam active={true} />
                <div className="float" style={{ display: "inline-block" }}>
                  <Cup starbuckdName="???" />
                </div>
                <p style={{ marginTop: 16, fontSize: 13, color: "#A89E94", fontWeight: 500 }}>
                  {loadingLines[loadingLineIndex]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence mode="wait">
            {stage === "result" && prediction && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="result-grid"
              >
                {/* Name comparison + difficulty */}
                <TiltCard className="card name-card" delay={0.05}>
                  <div className="names-row">
                    <div className="name-block">
                      <div className="name-label">You said</div>
                      <div className="name-val">{submittedName}</div>
                    </div>
                    <div className="arrow-div">→</div>
                    <div className="name-block">
                      <div className="name-label">I heard</div>
                      <div className="name-val butchered">{prediction.starbuckdName}</div>
                    </div>
                  </div>
                  <DifficultyMeter rating={Number(prediction.struggleRating)} />
                </TiltCard>

                {/* Alias banner with mini cup */}
                <TiltCard delay={0.12}>
                  <div className="alias-banner">
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                        ✦ Your coffee safe alias
                      </div>
                      <div className="alias-text">{prediction.safeAlias}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                        Because some battles are not worth fighting over coffee.
                      </div>
                    </div>
                    <div className="alias-cup">
                      <Steam active={true} compact={true} />
                      <Cup starbuckdName={prediction.safeAlias} />
                    </div>
                  </div>
                </TiltCard>

                {/* Rationale */}
                <TiltCard className="card rationale-card" delay={0.2}>
                  <Tag color={BROWN}>☕ My excuse</Tag>
                  <p className="rationale-text" style={{ marginTop: 12 }}>
                    {prediction.rationale}
                  </p>
                </TiltCard>

                {/* Action row */}
                <div className="bottom-row">
                  <button className="retry-btn" onClick={reset}>
                    <RotateCcw size={13} />
                    Ruin another name
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle empty state */}
          <AnimatePresence>
            {stage === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: "center", padding: "32px 0 12px", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <Steam active={false} />
                <div style={{ opacity: 0.35 }}>
                  <Cup starbuckdName="your name?" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History */}
          {stage !== "loading" && (
            <motion.div style={{ marginTop: 32 }}>
              <HistoryStrip
                history={history}
                onSelect={name => { setInputVal(name); predict(name); }}
                onClear={() => { setHistory([]); localStorage.removeItem("sbhist"); }}
              />
              <TopButcheredList />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: CREAM }}>
        <RefreshCw size={24} style={{ color: G, animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <App />
    </Suspense>
  );
}
