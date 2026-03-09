import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  { text: "The universe speaks in numbers. Learn its language, and you command reality.", by: "ARYABHATTA" },
  { text: "I had no training. No resources. Only obsession. That is enough.", by: "RAMANUJAN" },
  { text: "Everyone sees what you appear to be. Few experience what you really are.", by: "MACHIAVELLI" },
  { text: "When something is important enough, you do it even if the odds are against you.", by: "ELON MUSK" },
  { text: "In destruction lies creation. In stillness lies infinite power.", by: "LORD SHIVA" },
];

const SPRINT_LOG: Record<string, number> = {
  "2026-03-01": 3, "2026-03-02": 4, "2026-03-03": 2, "2026-03-04": 5,
  "2026-03-05": 3, "2026-03-06": 1, "2026-03-08": 4, "2026-03-09": 2,
};
const dk = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const INITIAL_NOTES = [
  "Look into LoRA fine-tuning...",
  "TensorTonic ep. on eigenvalues",
  "Baishali email re: conference",
  "New SHAP visualization idea",
  "Chinmay — schedule lock-in",
  "Read RoPE paper by Su et al.",
];

const STATUS_BUTTONS = [
  {
    key: "red", label: "Urgent", textColor: "#FF5555", ring: "#FF4444",
    tint: "rgba(255, 68, 68, 0.12)", glow: "rgba(255, 68, 68, 0.3)",
    border: "rgba(255,60,60,0.3)",
    icon: (c: string) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c} />
        <path d="M8 4.5V9" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="1.1" fill="#0a0a0a" />
      </svg>
    ),
  },
  {
    key: "yellow", label: "Next Imp", textColor: "#FACC15", ring: "#FACC15",
    tint: "rgba(250, 204, 21, 0.1)", glow: "rgba(250, 204, 21, 0.25)",
    border: "rgba(250,204,21,0.3)",
    icon: (c: string) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c} />
        <path d="M8 4v5l3 2" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "green", label: "Have Time", textColor: "#34D399", ring: "#34D399",
    tint: "rgba(52, 211, 153, 0.1)", glow: "rgba(52, 211, 153, 0.25)",
    border: "rgba(52,211,153,0.3)",
    icon: (c: string) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c} />
        <path d="M5 8.2L7.2 10.4L11 5.6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "purple", label: "Leisure", textColor: "#A78BFA", ring: "#A78BFA",
    tint: "rgba(167, 139, 250, 0.11)", glow: "rgba(167, 139, 250, 0.28)",
    border: "rgba(167,139,250,0.3)",
    icon: (c: string) => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={c} />
        <path d="M5.5 6.5C5.5 6.5 6.5 5.5 8 5.5C9.5 5.5 10.5 6.5 10.5 6.5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.5 10C5.5 10 6.5 11.2 8 11.2C9.5 11.2 10.5 10 10.5 10" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const PROJECT_CATEGORIES = [
  { key: "in_progress", s: "WIP", g: "linear-gradient(90deg,#8B5CFF,#39D0FF)", fc: "#8B5CFF", bc: "rgba(139,92,255,0.08)", bb: "rgba(139,92,255,0.2)" },
  { key: "on_track", s: "OT", g: "linear-gradient(90deg,#1FD3C6,#39D0FF)", fc: "#39D0FF", bc: "rgba(57,208,255,0.08)", bb: "rgba(57,208,255,0.2)" },
  { key: "at_risk", s: "RISK", g: "linear-gradient(90deg,#FF8A3D,#FF4FD8)", fc: "#FF8A3D", bc: "rgba(255,138,61,0.08)", bb: "rgba(255,138,61,0.2)" },
  { key: "planning", s: "PLAN", g: "linear-gradient(90deg,#4a5568,#8B5CFF)", fc: "#9AA3B2", bc: "rgba(100,100,120,0.08)", bb: "rgba(100,100,120,0.2)" },
];

const INITIAL_PROJECTS: Record<string, string[]> = {
  in_progress: ["GRL Paper"],
  on_track: ["NeurIPS Paper"],
  at_risk: ["Springer NDE"],
  planning: ["Space Science"],
};

const Overview = () => {
  const [notes, setNotes] = useState<string[]>(INITIAL_NOTES);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [priorities, setPriorities] = useState<Record<number, string>>({});
  const [priorityPopup, setPriorityPopup] = useState<number | null>(null);
  const [hoveredPriority, setHoveredPriority] = useState<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Active Projects state
  const [projects, setProjects] = useState<Record<string, string[]>>(INITIAL_PROJECTS);
  const [addProjectDialog, setAddProjectDialog] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newlyAdded, setNewlyAdded] = useState<string | null>(null);
  const [projectMenu, setProjectMenu] = useState<{ catKey: string; idx: number } | null>(null);
  const [projectAttachments, setProjectAttachments] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Schedule state
  const [scheduleItems, setScheduleItems] = useState([
    { t: "05:00 AM", n: "MATH SPRINT", d: "Linear algebra deep focus", dur: "45m", ic: "📐", c: "#39D0FF", done: false },
    { t: "06:00 AM", n: "GRL WRITING", d: "Discussion section draft", dur: "45m", ic: "📝", c: "#8B5CFF", done: false },
    { t: "09:00 AM", n: "IBM ISL WORK", d: "Daily high-visibility output", dur: "2h", ic: "💼", c: "#39D0FF", done: false },
    { t: "11:30 AM", n: "NEURIPS EXP.", d: "Positional encoding tests", dur: "45m", ic: "🔬", c: "#8B5CFF", done: false },
    { t: "06:00 PM", n: "GYM SESSION", d: "Evening training — calisthenics", dur: "1h", ic: "🏋", c: "#FF8A3D", done: false },
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedForm, setSchedForm] = useState({ time: "", title: "", duration: "", desc: "", emoji: "⭐" });
  const [editingScheduleIdx, setEditingScheduleIdx] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const EMOJI_OPTIONS = ["📐","📝","💼","🔬","🏋","📖","🧘","🏃","💻","🎯","🎨","🎵","🍎","☕","🌙","⚡","🔥","💡","🚀","🎤"];
  const SCHED_COLORS = ["#39D0FF","#8B5CFF","#FF8A3D","#FF4FD8","#4ade80"];
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
  const monthName = now.toLocaleString("default", { month: "long" });
  const dayName = now.toLocaleString("default", { weekday: "short" }).toUpperCase();
  const hours = now.getHours(), mins = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const timeStr = `${h12}:${String(mins).padStart(2, "0")}`;
  const todayQuote = QUOTES[today % QUOTES.length];

  let streak = 0;
  for (let d = today; d >= 1; d--) {
    if (SPRINT_LOG[dk(year, month, d)] > 0) streak++;
    else if (d < today) break;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000000", display: "flex", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&family=Raleway:wght@200;300;400;500;600;700&display=swap');
        .los-wrap {
          background: #000000;
          background-image:
            linear-gradient(rgba(57,208,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57,208,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          border-radius: 12px;
          padding: 16px;
        }
        .los-card {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 18px;
          position: relative;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .los-card:hover { transform: translateY(-2px); }
        .los-card.bc { border: 1px solid rgba(57,208,255,0.25); box-shadow: 0 0 20px rgba(57,208,255,0.12); }
        .los-card.bp { border: 1px solid rgba(139,92,255,0.25); box-shadow: 0 0 20px rgba(139,92,255,0.12); }
        .los-card.bk { border: 1px solid rgba(255,79,216,0.25); box-shadow: 0 0 20px rgba(255,79,216,0.12); }
        .los-card.bcp { border: 1px solid rgba(100,140,255,0.2); box-shadow: 0 0 20px rgba(100,140,255,0.1); }
        .los-h { font-family: 'Raleway', sans-serif; font-weight: 600; font-size: 14px; color: #E8ECF4; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; }
        .los-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .los-pill { display: inline-block; padding: 4px 16px; border-radius: 20px; font-family: 'Raleway', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #fff; }
        @media (max-width: 680px) { .los-grid3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 440px) { .los-grid3 { grid-template-columns: 1fr; } }
        @keyframes flameFlicker { 0%,100% { transform: scale(1) rotate(0deg); } 25% { transform: scale(1.05) rotate(-2deg); } 75% { transform: scale(1.08) rotate(2deg); } }
        @keyframes slideAppend {
          0% { opacity: 0; transform: translateY(-8px) scale(0.95); }
          60% { opacity: 1; transform: translateY(2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .slide-append { animation: slideAppend 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 780 }}>
        <div className="los-wrap">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/")}
            style={{
              fontFamily: "'Raleway', sans-serif", fontSize: 11, fontWeight: 600,
              color: "#39D0FF", letterSpacing: 1.5, textTransform: "uppercase",
              background: "rgba(57,208,255,0.08)", border: "1px solid rgba(57,208,255,0.25)",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer", marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            ← BACK
          </button>

          {/* ━━━ HEADER ROW: Clock | Title | Cycle ━━━ */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div className="los-card bc" style={{ padding: "12px 16px", minWidth: 100, textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 400, color: "#39D0FF", letterSpacing: 2, textAlign: "right", marginBottom: -2 }}>{ampm}</div>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 28, fontWeight: 700, color: "#39D0FF", textShadow: "0 0 12px rgba(57,208,255,0.5),0 0 30px rgba(57,208,255,0.2)", lineHeight: 1.1 }}>{timeStr}</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 500, color: "#9AA3B2", letterSpacing: 1.5, marginTop: 4 }}>{dayName}, {monthName.toUpperCase().slice(0, 3)} {today}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 24, fontWeight: 700, letterSpacing: 3, background: "linear-gradient(90deg,#39D0FF,#8B5CFF,#FF4FD8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 8px rgba(139,92,255,0.3))" }}>SOLO LEVELLING</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, fontWeight: 500, color: "#39D0FF", letterSpacing: 3, marginTop: 2 }}>NEHA AMIN</div>
            </div>
            <div className="los-card bk" style={{ padding: "12px 16px", minWidth: 100, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4, filter: "drop-shadow(0 0 8px rgba(57,208,255,0.4))" }}>🌙</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 500, color: "#E8ECF4", letterSpacing: 0.5 }}>CYCLE DAY 14</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 500, color: "#4ade80", letterSpacing: 1, marginTop: 2 }}>⚡ FOLLICULAR</div>
            </div>
          </div>

          {/* ━━━ ROW 1: Goals | Habits | Monthly XP ━━━ */}
          <div className="los-grid3" style={{ marginBottom: 14 }}>
            {/* GOALS */}
            <div className="los-card bc">
              <div className="los-h">Goals</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <svg width="100" height="100">
                  <defs>
                    <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#39D0FF" /><stop offset="100%" stopColor="#8B5CFF" /></linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#cg1)" strokeWidth="7" strokeDasharray={String(2 * Math.PI * 42)} strokeDashoffset={String(2 * Math.PI * 42 * 0.15)} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: "drop-shadow(0 0 6px rgba(57,208,255,0.5))" }} />
                  <text x="50" y="46" textAnchor="middle" style={{ fontFamily: "'Raleway',sans-serif", fontSize: 24, fontWeight: 700, fill: "#E8ECF4" }}>85%</text>
                  <text x="50" y="60" textAnchor="middle" style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 500, fill: "#9AA3B2", letterSpacing: 1.5 }}>COMPLETED</text>
                </svg>
              </div>
              {[{ t: "GRL Paper", pct: 100, done: true }, { t: "Math Module", pct: 70, done: true }, { t: "Save ₹50k", pct: 30, done: false }].map((g, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${g.done ? "#39D0FF" : "#9AA3B2"}`, background: g.done ? "rgba(57,208,255,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {g.done && <span style={{ fontSize: 8, color: "#39D0FF" }}>✓</span>}
                    </div>
                    <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, fontWeight: 500, color: "#E8ECF4" }}>{g.t}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${g.pct}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#39D0FF,#8B5CFF)", boxShadow: "0 0 8px rgba(57,208,255,0.3)" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* HABITS / STREAK */}
            <div className="los-card bk" style={{ textAlign: "center" }}>
              <div className="los-h">Habits</div>
              <div style={{ fontSize: 56, animation: "flameFlicker 1.5s ease-in-out infinite", filter: "drop-shadow(0 0 15px rgba(255,79,216,0.4)) drop-shadow(0 0 30px rgba(255,138,61,0.2))", marginBottom: 8 }}>🔥</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 18, fontWeight: 500, color: "#E8ECF4", letterSpacing: 1 }}>{streak} DAY STREAK!</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}>
                {["🧘", "🏃", "</>", "📖", "💧"].map((ic, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,79,216,0.1)", border: "1px solid rgba(255,79,216,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#FF4FD8" }}>{ic}</div>
                    {[0, 1, 2, 3].map(j => (
                      <div key={j} style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(57,208,255,0.15)", border: "1px solid rgba(57,208,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 7, color: "#39D0FF" }}>✓</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY XP */}
            <div className="los-card bcp">
              <div className="los-h">Monthly XP</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 28, fontWeight: 500, color: "#E8ECF4" }}>4,533</div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 500, color: "#4ade80", marginBottom: 14 }}>+15% from last week</div>
              <svg width="100%" height="60" viewBox="0 0 200 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lgFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(139,92,255,0.3)" /><stop offset="100%" stopColor="rgba(139,92,255,0)" /></linearGradient>
                  <linearGradient id="lgStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8B5CFF" /><stop offset="100%" stopColor="#FF4FD8" /></linearGradient>
                </defs>
                <path d="M0,50 Q20,45 40,40 T80,30 T120,35 T160,15 T200,10" fill="none" stroke="url(#lgStroke)" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(139,92,255,0.5))" }} />
                <path d="M0,50 Q20,45 40,40 T80,30 T120,35 T160,15 T200,10 L200,60 L0,60 Z" fill="url(#lgFill)" />
              </svg>
            </div>
          </div>

          {/* ━━━ ROW 2: Schedule | Active Projects | Quick Notes ━━━ */}
          <div className="los-grid3" style={{ marginBottom: 14 }}>
            {/* TODAY'S SCHEDULE */}
            <div className="los-card bc">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="los-h" style={{ marginBottom: 0 }}>Today's Schedule</div>
                <button
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(57,208,255,0.12)", border: "1px solid rgba(57,208,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 16, color: "#39D0FF", marginBottom: 14,
                    transition: "box-shadow 0.3s ease, background 0.3s ease",
                    boxShadow: "0 0 8px rgba(57,208,255,0.15)",
                  }}
                  onClick={() => { setEditingScheduleIdx(null); setShowScheduleModal(true); setSchedForm({ time: "", title: "", duration: "", desc: "", emoji: "⭐" }); setShowEmojiPicker(false); }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 8px rgba(57,208,255,0.15)"; e.currentTarget.style.background = "rgba(57,208,255,0.12)"; }}
                >+</button>
              </div>
              {scheduleItems.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setEditingScheduleIdx(i);
                    setSchedForm({ time: s.t, title: s.n, duration: s.dur, desc: s.d, emoji: s.ic });
                    setShowScheduleModal(true);
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start",
                    cursor: "pointer", opacity: s.done ? 0.45 : 1,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.c}15`, border: `1.5px solid ${s.c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{s.ic}</div>
                    {i < scheduleItems.length - 1 && <div style={{ width: 1.5, height: 16, background: `linear-gradient(180deg,${s.c}44,transparent)` }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 500, color: s.c, letterSpacing: 0.5 }}>{s.t}</div>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, fontWeight: 500, color: "#E8ECF4", textDecoration: s.done ? "line-through" : "none" }}>{s.n} ({s.dur})</div>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 400, color: "#9AA3B2", marginTop: 1, textDecoration: s.done ? "line-through" : "none" }}>{s.d}</div>
                  </div>
                  {s.done && <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, color: "#4ade80", fontWeight: 600, letterSpacing: 1 }}>✓ DONE</span>}
                </div>
              ))}

              {/* SCHEDULE ADD MODAL */}
              {showScheduleModal && (
                <div
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: 360, background: "#0a0a14",
                      border: "1px solid rgba(57,208,255,0.3)", borderRadius: 16,
                      padding: 24, boxShadow: "0 0 40px rgba(57,208,255,0.15)",
                      animation: "slideAppend 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
                    }}
                  >
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 14, fontWeight: 600, color: "#E8ECF4", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 18 }}>{editingScheduleIdx !== null ? "Edit Schedule Item" : "Add Schedule Item"}</div>

                    {/* Emoji picker */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600, color: "#9AA3B2", letterSpacing: 1, marginBottom: 6 }}>EMOJI</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          style={{
                            width: 40, height: 40, borderRadius: 10, cursor: "pointer",
                            background: "rgba(57,208,255,0.08)", border: "1px solid rgba(57,208,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                            transition: "border-color 0.2s ease",
                          }}
                        >{schedForm.emoji}</div>
                        <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, color: "#9AA3B2" }}>Click to change</span>
                      </div>
                      {showEmojiPicker && (
                        <div style={{
                          display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8,
                          background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 8,
                          border: "1px solid rgba(57,208,255,0.15)",
                        }}>
                          {EMOJI_OPTIONS.map(em => (
                            <div
                              key={em}
                              onClick={() => { setSchedForm(f => ({ ...f, emoji: em })); setShowEmojiPicker(false); }}
                              style={{
                                width: 32, height: 32, borderRadius: 6, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                                background: schedForm.emoji === em ? "rgba(57,208,255,0.15)" : "transparent",
                                border: schedForm.emoji === em ? "1px solid rgba(57,208,255,0.4)" : "1px solid transparent",
                                transition: "background 0.15s ease",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(57,208,255,0.1)"}
                              onMouseLeave={e => { if (schedForm.emoji !== em) e.currentTarget.style.background = "transparent"; }}
                            >{em}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Time input */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600, color: "#9AA3B2", letterSpacing: 1, marginBottom: 6 }}>TIME</div>
                      <input
                        value={schedForm.time}
                        onChange={e => setSchedForm(f => ({ ...f, time: e.target.value }))}
                        placeholder="e.g. 08:00 AM"
                        style={{
                          width: "100%", height: 40, background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(57,208,255,0.2)", borderRadius: 10,
                          padding: "0 14px", color: "#E8ECF4", fontFamily: "'Raleway',sans-serif", fontSize: 13,
                          outline: "none",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "#39D0FF"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(57,208,255,0.2)"}
                      />
                    </div>

                    {/* Title + Duration row */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 2 }}>
                        <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600, color: "#9AA3B2", letterSpacing: 1, marginBottom: 6 }}>TITLE</div>
                        <input
                          autoFocus
                          value={schedForm.title}
                          onChange={e => setSchedForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. Deep Work"
                          style={{
                            width: "100%", height: 40, background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(57,208,255,0.2)", borderRadius: 10,
                            padding: "0 14px", color: "#E8ECF4", fontFamily: "'Raleway',sans-serif", fontSize: 13,
                            outline: "none",
                          }}
                          onFocus={e => e.currentTarget.style.borderColor = "#39D0FF"}
                          onBlur={e => e.currentTarget.style.borderColor = "rgba(57,208,255,0.2)"}
                          onKeyDown={e => {
                            if (e.key === "Enter" && schedForm.title.trim() && schedForm.time.trim()) {
                              if (editingScheduleIdx !== null) {
                                setScheduleItems(prev => prev.map((item, idx) => idx === editingScheduleIdx ? { ...item, t: schedForm.time.trim(), n: schedForm.title.trim().toUpperCase(), d: schedForm.desc.trim() || "", dur: schedForm.duration.trim() || "—", ic: schedForm.emoji } : item));
                              } else {
                                const color = SCHED_COLORS[scheduleItems.length % SCHED_COLORS.length];
                                setScheduleItems(prev => [...prev, { t: schedForm.time.trim(), n: schedForm.title.trim().toUpperCase(), d: schedForm.desc.trim() || "", dur: schedForm.duration.trim() || "—", ic: schedForm.emoji, c: color, done: false }]);
                              }
                              setShowScheduleModal(false);
                            }
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600, color: "#9AA3B2", letterSpacing: 1, marginBottom: 6 }}>DURATION</div>
                        <input
                          value={schedForm.duration}
                          onChange={e => setSchedForm(f => ({ ...f, duration: e.target.value }))}
                          placeholder="e.g. 1h"
                          style={{
                            width: "100%", height: 40, background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(57,208,255,0.2)", borderRadius: 10,
                            padding: "0 14px", color: "#E8ECF4", fontFamily: "'Raleway',sans-serif", fontSize: 13,
                            outline: "none",
                          }}
                          onFocus={e => e.currentTarget.style.borderColor = "#39D0FF"}
                          onBlur={e => e.currentTarget.style.borderColor = "rgba(57,208,255,0.2)"}
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setShowScheduleModal(false)}
                        style={{
                          fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#9AA3B2", background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                          padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                        }}
                      >CANCEL</button>
                      {editingScheduleIdx !== null && (
                        <button
                          onClick={() => {
                            setScheduleItems(prev => {
                              const newItems = [...prev];
                              newItems[editingScheduleIdx] = { ...newItems[editingScheduleIdx], done: true };
                              const item = newItems.splice(editingScheduleIdx, 1)[0];
                              newItems.push(item);
                              return newItems;
                            });
                            setShowScheduleModal(false);
                          }}
                          style={{
                            fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                            color: "#fff", background: "linear-gradient(90deg,#4ade80,#22c55e)",
                            border: "none", borderRadius: 8,
                            padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                            boxShadow: "0 0 12px rgba(74,222,128,0.3)",
                          }}
                        >DONE</button>
                      )}
                      <button
                        onClick={() => {
                          if (schedForm.title.trim() && schedForm.time.trim()) {
                            if (editingScheduleIdx !== null) {
                              setScheduleItems(prev => prev.map((item, idx) => idx === editingScheduleIdx ? { ...item, t: schedForm.time.trim(), n: schedForm.title.trim().toUpperCase(), d: schedForm.desc.trim() || "", dur: schedForm.duration.trim() || "—", ic: schedForm.emoji } : item));
                            } else {
                              const color = SCHED_COLORS[scheduleItems.length % SCHED_COLORS.length];
                              setScheduleItems(prev => [...prev, { t: schedForm.time.trim(), n: schedForm.title.trim().toUpperCase(), d: schedForm.desc.trim() || "", dur: schedForm.duration.trim() || "—", ic: schedForm.emoji, c: color, done: false }]);
                            }
                            setShowScheduleModal(false);
                          }
                        }}
                        style={{
                          fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#fff", background: "linear-gradient(90deg,#39D0FF,#8B5CFF)",
                          border: "none", borderRadius: 8,
                          padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                          boxShadow: "0 0 12px rgba(57,208,255,0.3)",
                        }}
                      >{editingScheduleIdx !== null ? "SAVE" : "ADD"}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE PROJECTS */}
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "16px 14px 40px", position: "relative",
              border: "1px solid rgba(100,140,255,0.15)",
              boxShadow: "0 0 20px rgba(57,208,255,0.06), 0 0 20px rgba(139,92,255,0.06), 0 0 20px rgba(255,79,216,0.06)",
            }}>
              <div className="los-h">Active Projects</div>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*,application/pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && projectMenu) {
                    const key = `${projectMenu.catKey}-${projectMenu.idx}`;
                    const url = URL.createObjectURL(file);
                    setProjectAttachments(prev => ({
                      ...prev,
                      [key]: [...(prev[key] || []), url],
                    }));
                    setProjectMenu(null);
                  }
                  e.target.value = "";
                }}
              />
              {PROJECT_CATEGORIES.map((cat) => {
                const catProjects = projects[cat.key] || [];
                if (catProjects.length === 0) return null;
                return (
                  <div key={cat.key} style={{
                    background: cat.bc, border: `1px solid ${cat.bb}`,
                    borderRadius: 10, padding: "8px 10px", marginBottom: 8,
                    }}>
                    {catProjects.map((projName, pi) => {
                      const animKey = `${cat.key}-${pi}`;
                      const isNew = newlyAdded === animKey;
                      const attachments = projectAttachments[animKey] || [];
                      const menuOpen = projectMenu?.catKey === cat.key && projectMenu?.idx === pi;
                      return (
                        <div key={animKey} className={isNew ? "slide-append" : ""} onAnimationEnd={() => { if (isNew) setNewlyAdded(null); }} style={{
                          padding: "6px 4px", position: "relative",
                          
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div
                              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer" }}
                              onClick={() => setProjectMenu(menuOpen ? null : { catKey: cat.key, idx: pi })}
                            >
                              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" style={{ flexShrink: 0 }}>
                                <path d="M1 3V10C1 10.55 1.45 11 2 11H12C12.55 11 13 10.55 13 10V4C13 3.45 12.55 3 12 3H7L5.5 1H2C1.45 1 1 1.45 1 2V3Z" fill={cat.fc} opacity="0.8"/>
                              </svg>
                              <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 500, color: "#E8ECF4", letterSpacing: 0.5 }}>{projName}</span>
                            </div>
                            <div style={{
                              background: cat.g, borderRadius: 14, padding: "3px 12px",
                              fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 700,
                              color: "#fff", letterSpacing: 1.2, textTransform: "uppercase",
                              whiteSpace: "nowrap", flexShrink: 0,
                            }}>{cat.s}</div>
                          </div>

                          {/* Attachment thumbnails */}
                          {attachments.length > 0 && (
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", paddingLeft: 22 }}>
                              {attachments.map((url, ai) => (
                                <div key={ai} style={{
                                  width: 32, height: 32, borderRadius: 5, overflow: "hidden",
                                  border: `1px solid ${cat.bb}`, background: "rgba(0,0,0,0.3)",
                                }}>
                                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Context menu popup */}
                          {menuOpen && (
                            <>
                              <div onClick={() => setProjectMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                              <div style={{
                                position: "absolute", left: 14, top: "100%", marginTop: 4, zIndex: 100,
                                background: "rgba(10,10,10,0.94)", border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 10, padding: 4, minWidth: 140,
                                boxShadow: "0 8px 30px rgba(0,0,0,0.7), 0 0 15px rgba(139,92,255,0.06)",
                                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                                animation: "slideAppend 0.25s cubic-bezier(0.22,1,0.36,1) forwards",
                              }}>
                                <div
                                  onClick={() => { fileInputRef.current?.click(); }}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                                    fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 500,
                                    color: "#E8ECF4", letterSpacing: 0.5, transition: "background 0.15s ease",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cat.fc} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                                  </svg>
                                  Attach Media
                                </div>
                                <div
                                  onClick={() => {
                                    setProjects(prev => ({
                                      ...prev,
                                      [cat.key]: (prev[cat.key] || []).filter((_, idx) => idx !== pi),
                                    }));
                                    const key = `${cat.key}-${pi}`;
                                    setProjectAttachments(prev => { const n = { ...prev }; delete n[key]; return n; });
                                    setProjectMenu(null);
                                  }}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                                    fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 500,
                                    color: "#FF5555", letterSpacing: 0.5, transition: "background 0.15s ease",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,85,85,0.08)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                  </svg>
                                  Remove
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Category add dots */}
              <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
                {PROJECT_CATEGORIES.map((cat) => (
                  <div
                    key={cat.key}
                    onClick={() => { setAddProjectDialog(cat.key); setNewProjectName(""); }}
                    title={cat.s}
                    style={{
                      width: 14, height: 14, borderRadius: "50%", cursor: "pointer",
                      background: cat.fc, opacity: 0.7,
                      boxShadow: `0 0 8px ${cat.fc}66`,
                      transition: "opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = `0 0 14px ${cat.fc}aa`; e.currentTarget.style.transform = "scale(1.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.boxShadow = `0 0 8px ${cat.fc}66`; e.currentTarget.style.transform = "scale(1)"; }}
                  />
                ))}
              </div>
            </div>

            {/* ADD PROJECT DIALOG */}
            {addProjectDialog && (() => {
              const cat = PROJECT_CATEGORIES.find(c => c.key === addProjectDialog)!;
              const handleAdd = () => {
                if (newProjectName.trim()) {
                  setProjects(prev => ({
                    ...prev,
                    [cat.key]: [...(prev[cat.key] || []), newProjectName.trim()],
                  }));
                  setNewlyAdded(`${cat.key}-${(projects[cat.key] || []).length}`);
                  setNewProjectName("");
                  setAddProjectDialog(null);
                }
              };
              return (
                <div
                  onClick={() => setAddProjectDialog(null)}
                  style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: 360, background: "#0a0a14",
                      border: `1px solid ${cat.bb}`, borderRadius: 16,
                      padding: 24, boxShadow: `0 0 40px ${cat.fc}22`,
                      animation: "slideAppend 0.35s cubic-bezier(0.22,1,0.36,1) forwards",
                    }}
                  >
                    {/* Status badge */}
                    <div style={{ marginBottom: 18 }}>
                      <div style={{
                        display: "inline-block",
                        background: cat.g, borderRadius: 14,
                        padding: "4px 16px",
                        fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 700,
                        color: "#fff", letterSpacing: 1.2, textTransform: "uppercase",
                      }}>{cat.s}</div>
                    </div>

                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 14, fontWeight: 600, color: "#E8ECF4", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Add Project</div>

                    <input
                      autoFocus
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                      placeholder="Project name..."
                      style={{
                        width: "100%", height: 42, background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${cat.bb}`, borderRadius: 10,
                        padding: "0 14px", color: "#E8ECF4", fontFamily: "'Raleway',sans-serif", fontSize: 13,
                        outline: "none", letterSpacing: 0.5,
                        transition: "border-color 0.2s ease",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = cat.fc}
                      onBlur={e => e.currentTarget.style.borderColor = cat.bb}
                    />

                    <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => { setAddProjectDialog(null); setNewProjectName(""); }}
                        style={{
                          fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#9AA3B2", background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                          padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                        }}
                      >CANCEL</button>
                      <button
                        onClick={handleAdd}
                        style={{
                          fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#fff", background: cat.g,
                          border: "none", borderRadius: 8,
                          padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                          boxShadow: `0 0 12px ${cat.fc}44`,
                        }}
                      >ADD</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* QUICK NOTES */}
            <div className="los-card bk" style={{
              backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(255,79,216,0.06) 31px, rgba(255,79,216,0.06) 32px)",
              backgroundSize: "100% 32px",
              backgroundPosition: "0 52px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="los-h" style={{ marginBottom: 0 }}>Capture Thoughts</div>
                <button
                  onClick={() => setShowNoteModal(true)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,79,216,0.12)", border: "1px solid rgba(255,79,216,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 14, color: "#FF4FD8",
                    transition: "box-shadow 0.3s ease, background 0.3s ease",
                    boxShadow: "0 0 8px rgba(255,79,216,0.15)",
                    marginBottom: 14,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 16px rgba(255,79,216,0.4)"; e.currentTarget.style.background = "rgba(255,79,216,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 8px rgba(255,79,216,0.15)"; e.currentTarget.style.background = "rgba(255,79,216,0.12)"; }}
                >
                  ✎
                </button>
              </div>
              {notes.map((note, i) => (
                <div
                  key={`note-${i}`}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }}
                  onDragEnd={() => {
                    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
                      setNotes(prev => {
                        const updated = [...prev];
                        const [moved] = updated.splice(dragIdx, 1);
                        updated.splice(dragOverIdx, 0, moved);
                        return updated;
                      });
                      // Reindex priorities
                      setPriorities(prev => {
                        const reindexed: Record<number, string> = {};
                        const entries = Object.entries(prev).map(([k, v]) => [Number(k), v] as [number, string]);
                        const ordered = entries.sort((a, b) => a[0] - b[0]);
                        const idxMap: number[] = Array.from({ length: notes.length }, (_, x) => x);
                        const [movedIdx] = idxMap.splice(dragIdx, 1);
                        idxMap.splice(dragOverIdx, 0, movedIdx);
                        idxMap.forEach((origIdx, newIdx) => {
                          const p = prev[origIdx];
                          if (p) reindexed[newIdx] = p;
                        });
                        return reindexed;
                      });
                    }
                    setDragIdx(null);
                    setDragOverIdx(null);
                  }}
                  style={{
                    padding: "8px 4px",
                    borderBottom: i < notes.length - 1 ? "1px solid rgba(255,79,216,0.08)" : "none",
                    display: "flex", alignItems: "center", gap: 8,
                    opacity: dragIdx === i ? 0.4 : 1,
                    background: dragOverIdx === i && dragIdx !== i
                      ? "rgba(255,79,216,0.06)"
                      : priorities[i]
                        ? (STATUS_BUTTONS.find(b => b.key === priorities[i])?.tint ?? "transparent")
                        : "transparent",
                    border: priorities[i] ? `1px solid ${STATUS_BUTTONS.find(b => b.key === priorities[i])?.border ?? "transparent"}` : "1px solid transparent",
                    borderRadius: 6,
                    transition: "background 0.15s ease, opacity 0.15s ease, border-color 0.15s ease",
                    position: "relative",
                  }}
                >
                  {/* Drag handle — double-click for priority */}
                  <div
                    style={{
                      cursor: "grab", flexShrink: 0, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 2, padding: "4px 4px",
                      borderRadius: 4,
                    }}
                    onDoubleClick={(e) => { e.preventDefault(); setPriorityPopup(i); }}
                  >
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,79,216,0.35)" }} />
                    ))}
                  </div>

                  {/* Priority popup — glass pill buttons */}
                  {priorityPopup === i && (
                    <>
                      <div onClick={() => { setPriorityPopup(null); setHoveredPriority(null); }} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                      <div style={{
                        position: "absolute", left: 28, top: -8, zIndex: 100,
                        background: "rgba(10,10,10,0.92)", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 6,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(139,92,255,0.08)",
                        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                        minWidth: 172,
                      }}>
                        {STATUS_BUTTONS.map((btn, idx) => {
                          const isHover = hoveredPriority === idx;
                          const isActive = priorities[i] === btn.key;
                          return (
                            <div
                              key={btn.key}
                              style={{ position: "relative", borderRadius: 100, cursor: "pointer" }}
                              onMouseEnter={() => setHoveredPriority(idx)}
                              onMouseLeave={() => setHoveredPriority(null)}
                              onClick={() => {
                                setPriorities(prev => ({ ...prev, [i]: btn.key }));
                                setPriorityPopup(null);
                                setHoveredPriority(null);
                              }}
                            >
                              {/* Border ring — contained inside pill */}
                              <div style={{
                                position: "absolute", inset: 0, borderRadius: 100, pointerEvents: "none", zIndex: 1,
                                border: `1px solid ${isHover ? btn.ring + "44" : "rgba(255,255,255,0.08)"}`,
                                transition: "border-color 0.3s ease",
                              }} />
                              {/* Glass pill */}
                              <div style={{
                                position: "relative", display: "flex", alignItems: "center", gap: 10,
                                padding: "8px 18px 8px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500,
                                letterSpacing: "0.02em", color: btn.textColor, overflow: "hidden", zIndex: 2, width: "100%",
                                fontFamily: "'Raleway', sans-serif",
                                background: isHover || isActive ? btn.tint : "rgba(255,255,255,0.04)",
                                backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                              }}>
                                {/* Top refraction */}
                                <div style={{
                                  position: "absolute", top: 0, left: "8%", right: "8%", height: "50%",
                                  borderRadius: "100px 100px 50% 50%", pointerEvents: "none",
                                  background: `linear-gradient(180deg, rgba(255,255,255,${isHover ? 0.06 : 0.04}) 0%, transparent 100%)`,
                                  transition: "all 0.35s ease",
                                }} />
                                <span style={{
                                  position: "relative", zIndex: 2, display: "flex", alignItems: "center", flexShrink: 0,
                                  filter: isHover ? `drop-shadow(0 0 5px ${btn.ring}66)` : "none",
                                  transition: "filter 0.35s ease",
                                }}>
                                  {btn.icon(btn.textColor)}
                                </span>
                                <span style={{
                                  position: "relative", zIndex: 2, whiteSpace: "nowrap",
                                  textShadow: isHover ? `0 0 8px ${btn.ring}44` : "none",
                                  transition: "text-shadow 0.35s ease",
                                }}>
                                  {btn.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {priorities[i] && (
                          <div
                            onClick={() => {
                              setPriorities(prev => { const n = { ...prev }; delete n[i]; return n; });
                              setPriorityPopup(null); setHoveredPriority(null);
                            }}
                            style={{
                              textAlign: "center", padding: "6px 10px", cursor: "pointer",
                              fontFamily: "'Raleway',sans-serif", fontSize: 10, fontWeight: 500,
                              color: "rgba(255,255,255,0.3)", letterSpacing: 1,
                              borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 2,
                              transition: "color 0.2s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                          >
                            ✕ CLEAR
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Checkbox */}
                  <div
                    onClick={() => {
                      setNotes(prev => prev.filter((_, idx) => idx !== i));
                      setReviewed(prev => [...prev, note]);
                      // Shift priority keys
                      setPriorities(prev => {
                        const updated: Record<number, string> = {};
                        Object.entries(prev).forEach(([k, v]) => {
                          const idx = Number(k);
                          if (idx < i) updated[idx] = v;
                          else if (idx > i) updated[idx - 1] = v;
                        });
                        return updated;
                      });
                    }}
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
                      border: "1.5px solid rgba(255,79,216,0.4)", background: "transparent",
                      transition: "background 0.2s ease, border-color 0.2s ease",
                    }}
                  />
                  <div style={{ fontFamily: "'Caveat',cursive", fontSize: 15, fontWeight: 400, color: "#FF4FD8", lineHeight: 1.4, textShadow: "0 0 6px rgba(255,79,216,0.1)", flex: 1 }}>{note}</div>
                </div>
              ))}

              {/* REVIEWED SECTION */}
              {reviewed.length > 0 && (
                <>
                  <div style={{
                    marginTop: 14, paddingTop: 10,
                    borderTop: "1px solid rgba(255,79,216,0.15)",
                    fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600,
                    color: "rgba(255,79,216,0.4)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8,
                  }}>Reviewed</div>
                  {reviewed.map((note, i) => (
                    <div key={`rev-${i}`} style={{
                      padding: "5px 0", display: "flex", alignItems: "center", gap: 8,
                      borderBottom: i < reviewed.length - 1 ? "1px solid rgba(255,79,216,0.04)" : "none",
                    }}>
                      <div
                        onClick={() => {
                          setReviewed(prev => prev.filter((_, idx) => idx !== i));
                          setNotes(prev => [...prev, note]);
                        }}
                        style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
                          border: "1.5px solid rgba(57,208,255,0.3)", background: "rgba(57,208,255,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 0.2s ease",
                        }}
                      >
                        <span style={{ fontSize: 9, color: "#39D0FF" }}>✓</span>
                      </div>
                      <div style={{
                        fontFamily: "'Caveat',cursive", fontSize: 14, fontWeight: 400,
                        color: "rgba(255,79,216,0.3)", lineHeight: 1.4, textDecoration: "line-through",
                      }}>{note}</div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* NOTE MODAL */}
            {showNoteModal && (
              <div
                onClick={() => setShowNoteModal(false)}
                style={{
                  position: "fixed", inset: 0, zIndex: 9999,
                  background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: 340, background: "#0a0a14",
                    border: "1px solid rgba(255,79,216,0.3)", borderRadius: 16,
                    padding: 24, boxShadow: "0 0 40px rgba(255,79,216,0.15)",
                  }}
                >
                  <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 14, fontWeight: 600, color: "#E8ECF4", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Add a Note</div>
                  <textarea
                    autoFocus
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Type your note..."
                    style={{
                      width: "100%", minHeight: 80, background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,79,216,0.2)", borderRadius: 10,
                      padding: 12, color: "#FF4FD8", fontFamily: "'Caveat',cursive", fontSize: 16,
                      resize: "vertical", outline: "none",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(255,79,216,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,79,216,0.2)"}
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => { setShowNoteModal(false); setNewNote(""); }}
                      style={{
                        fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                        color: "#9AA3B2", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                        padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                      }}
                    >CANCEL</button>
                    <button
                      onClick={() => {
                        if (newNote.trim()) {
                          setNotes(prev => [...prev, newNote.trim()]);
                          setNewNote("");
                          setShowNoteModal(false);
                        }
                      }}
                      style={{
                        fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 600,
                        color: "#fff", background: "linear-gradient(90deg,#FF4FD8,#8B5CFF)",
                        border: "none", borderRadius: 8,
                        padding: "8px 18px", cursor: "pointer", letterSpacing: 1,
                        boxShadow: "0 0 12px rgba(255,79,216,0.3)",
                      }}
                    >ADD</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ━━━ ROW 3: Finance | Health | Reading ━━━ */}
          <div className="los-grid3" style={{ marginBottom: 14 }}>
            {/* FINANCE */}
            <div className="los-card bcp">
              <div className="los-h">Finance Overview</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, height: 80, marginBottom: 12, padding: "0 10px" }}>
                {[
                  { l: "INCOME", h: 70, c: "#39D0FF" },
                  { l: "EXPENSES", h: 35, c: "#FF4FD8" },
                  { l: "SAVINGS", h: 50, c: "#8B5CFF" },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                    <div style={{ width: "100%", maxWidth: 28, height: b.h, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg,${b.c},${b.c}88)`, boxShadow: `0 0 8px ${b.c}33` }} />
                    <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 7, fontWeight: 600, color: "#9AA3B2", letterSpacing: 0.5 }}>{b.l}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 500, color: "#9AA3B2" }}>BALANCE:</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 400, color: "#E8ECF4", letterSpacing: 1 }}>₹1,00,000</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 500, color: "#9AA3B2" }}>MONTHLY:</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 400, color: "#E8ECF4", letterSpacing: 1 }}>₹25,000</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 500, color: "#FF4FD8" }}>SAVINGS GOAL: Room Revamp (35%)</div>
            </div>

            {/* HEALTH METRICS */}
            <div className="los-card bcp" style={{ padding: "16px 14px" }}>
              <div className="los-h">Health Metrics</div>
              {[
                { l: "SLEEP", v: "6h 00m", sub: "Target: 7h", c: "#8B5CFF", pct: 86 },
                { l: "STEPS", v: "4,200", sub: "Target: 8,000", c: "#FF4FD8", pct: 52 },
                { l: "MEALS", v: "2 / 4", sub: "cooked + salad + juice + snack", c: "#39D0FF", pct: 50 },
                { l: "WATER", v: "5 / 8 glasses", sub: "Target: 8 glasses", c: "#1FD3C6", pct: 62 },
              ].map((h, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 16 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 600, color: h.c, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>{h.l}</div>
                      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 400, color: "#E8ECF4", lineHeight: 1, letterSpacing: 1 }}>{h.v}</div>
                    </div>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 400, color: "#9AA3B2", textAlign: "right" }}>{h.sub}</div>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "visible", marginTop: 8, position: "relative" }}>
                    <div style={{ width: `${h.pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${h.c}, ${h.c}cc)`, boxShadow: `0 0 10px ${h.c}55, 0 0 20px ${h.c}22`, position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 2, right: 2, height: "50%", borderRadius: "3px 3px 1px 1px", background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* READING LIST */}
            <div className="los-card bcp">
              <div className="los-h">Reading List</div>
              {[
                { t: "ATOMIC HABITS", pct: 50, c: "#FF4FD8" },
                { t: "3B1B LINEAR ALG.", pct: 80, c: "#39D0FF" },
                { t: "DEEP WORK", pct: 80, c: "#8B5CFF" },
                { t: "ATTENTION PAPER", pct: 20, c: "#FF4FD8" },
                { t: "TRANSFORMERS BOOK", pct: 20, c: "#39D0FF" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 28, borderRadius: 3, background: `linear-gradient(180deg,${r.c},${r.c}44)`, boxShadow: `0 0 6px ${r.c}44`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, fontWeight: 600, color: "#E8ECF4", letterSpacing: 0.3 }}>{r.t}</span>
                      <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 10, fontWeight: 500, color: "#9AA3B2" }}>{r.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${r.pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${r.c},${r.c}66)`, boxShadow: `0 0 6px ${r.c}33` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ BOTTOM QUOTE ━━━ */}
          <div className="los-card bk" style={{ textAlign: "center", padding: "16px 20px" }}>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 20, fontWeight: 400, color: "#FF4FD8", lineHeight: 1.6, textShadow: "0 0 10px rgba(255,79,216,0.2)" }}>
              "{todayQuote.text}"<br />
              <span style={{ fontSize: 16, color: "rgba(255,79,216,0.7)" }}>— {todayQuote.by}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
