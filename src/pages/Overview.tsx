import { useState } from "react";
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

const Overview = () => {
  const navigate = useNavigate();
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
              <div className="los-h">Today's Schedule</div>
              {[
                { t: "05:00 AM", n: "MATH SPRINT (45m)", d: "Linear algebra deep focus", ic: "📐", c: "#39D0FF" },
                { t: "06:00 AM", n: "GRL WRITING (45m)", d: "Discussion section draft", ic: "📝", c: "#8B5CFF" },
                { t: "09:00 AM", n: "IBM ISL WORK (2h)", d: "Daily high-visibility output", ic: "💼", c: "#39D0FF" },
                { t: "11:30 AM", n: "NEURIPS EXP. (45m)", d: "Positional encoding tests", ic: "🔬", c: "#8B5CFF" },
                { t: "06:00 PM", n: "GYM SESSION (1h)", d: "Evening training — calisthenics", ic: "🏋", c: "#FF8A3D" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.c}15`, border: `1.5px solid ${s.c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{s.ic}</div>
                    {i < 4 && <div style={{ width: 1.5, height: 16, background: `linear-gradient(180deg,${s.c}44,transparent)` }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 500, color: s.c, letterSpacing: 0.5 }}>{s.t}</div>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 12, fontWeight: 500, color: "#E8ECF4" }}>{s.n}</div>
                    <div style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 400, color: "#9AA3B2", marginTop: 1 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIVE PROJECTS */}
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "16px 14px", position: "relative",
              border: "1px solid rgba(100,140,255,0.15)",
              boxShadow: "0 0 20px rgba(57,208,255,0.06), 0 0 20px rgba(139,92,255,0.06), 0 0 20px rgba(255,79,216,0.06)",
            }}>
              <div className="los-h">Active Projects</div>
              {[
                { n: "GRL Paper", s: "IN PROGRESS", g: "linear-gradient(90deg,#8B5CFF,#39D0FF)", fc: "#8B5CFF", bc: "rgba(139,92,255,0.08)", bb: "rgba(139,92,255,0.2)" },
                { n: "NeurIPS Paper", s: "ON TRACK", g: "linear-gradient(90deg,#1FD3C6,#39D0FF)", fc: "#39D0FF", bc: "rgba(57,208,255,0.08)", bb: "rgba(57,208,255,0.2)" },
                { n: "Springer NDE", s: "AT RISK", g: "linear-gradient(90deg,#FF8A3D,#FF4FD8)", fc: "#FF8A3D", bc: "rgba(255,138,61,0.08)", bb: "rgba(255,138,61,0.2)" },
                { n: "Space Science", s: "PLANNING", g: "linear-gradient(90deg,#4a5568,#8B5CFF)", fc: "#9AA3B2", bc: "rgba(100,100,120,0.08)", bb: "rgba(100,100,120,0.2)" },
              ].map((p, i) => (
                <div key={i} style={{
                  background: p.bc, border: `1px solid ${p.bb}`,
                  borderRadius: 10, padding: "10px 12px", marginBottom: i < 3 ? 8 : 0,
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M1 3V10C1 10.55 1.45 11 2 11H12C12.55 11 13 10.55 13 10V4C13 3.45 12.55 3 12 3H7L5.5 1H2C1.45 1 1 1.45 1 2V3Z" fill={p.fc} opacity="0.8"/>
                    </svg>
                    <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 11, fontWeight: 500, color: "#E8ECF4", letterSpacing: 0.5 }}>{p.n}</span>
                  </div>
                  <div style={{
                    background: p.g, borderRadius: 14,
                    padding: "3px 12px",
                    fontFamily: "'Raleway',sans-serif", fontSize: 8, fontWeight: 700,
                    color: "#fff", letterSpacing: 1.2, textTransform: "uppercase",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}>{p.s}</div>
                </div>
              ))}
            </div>

            {/* QUICK NOTES */}
            <div className="los-card bk" style={{
              backgroundImage: "repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(255,79,216,0.06) 31px, rgba(255,79,216,0.06) 32px)",
              backgroundSize: "100% 32px",
              backgroundPosition: "0 52px",
            }}>
              <div className="los-h">Quick Notes</div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 14, padding: "5px 10px", borderRadius: 16, border: "1px solid rgba(255,79,216,0.15)", background: "rgba(255,79,216,0.03)" }}>
                <span style={{ fontFamily: "'Raleway',sans-serif", fontSize: 9, fontWeight: 600, color: "#9AA3B2", letterSpacing: 1 }}>CAPTURE BOX</span>
              </div>
              {[
                "Look into LoRA fine-tuning...",
                "TensorTonic ep. on eigenvalues",
                "Baishali email re: conference",
                "New SHAP visualization idea",
                "Chinmay — schedule lock-in",
                "Read RoPE paper by Su et al.",
              ].map((note, i) => (
                <div key={i} style={{
                  padding: "8px 0",
                  borderBottom: i < 5 ? "1px solid rgba(255,79,216,0.08)" : "none",
                }}>
                  <div style={{ fontFamily: "'Caveat',cursive", fontSize: 15, fontWeight: 400, color: "#FF4FD8", lineHeight: 1.4, textShadow: "0 0 6px rgba(255,79,216,0.1)" }}>{note}</div>
                </div>
              ))}
            </div>
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
