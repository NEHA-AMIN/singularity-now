import { useState } from "react";

const SPRINT_LOG: Record<string, number> = {
  "2026-03-01": 3, "2026-03-02": 4, "2026-03-03": 2, "2026-03-04": 5,
  "2026-03-05": 3, "2026-03-06": 1, "2026-03-08": 4, "2026-03-09": 2,
};

const dk = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const CalendarPanel = () => {
  const [calView, setCalView] = useState<"weekly" | "monthly" | "daily">("monthly");

  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString("default", { month: "long" });

  const currentDayOfWeek = now.getDay();
  const weekStart = today - currentDayOfWeek;
  const weekDays: (number | null)[] = Array.from({ length: 7 }, (_, i) => {
    const d = weekStart + i;
    return d >= 1 && d <= daysInMonth ? d : null;
  });

  const calCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);
  while (calCells.length % 7 !== 0) calCells.push(null);

  const renderCalGrid = (days: (number | null)[]) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
      {days.map((day, i) => {
        if (day === null) return <div key={`e${i}`} style={{ aspectRatio: "1" }} />;
        const key = dk(year, month, day);
        const done = SPRINT_LOG[key] > 0;
        const isToday = day === today;
        return (
          <div key={i} style={{
            aspectRatio: "1", borderRadius: 3, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: done ? "rgba(168,85,247,0.12)" : isToday ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.01)",
            border: done ? "1px solid rgba(168,85,247,0.35)" : isToday ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.03)",
          }}>
            <span style={{
              fontFamily: "'Cormorant', serif", fontSize: calView === "weekly" ? 14 : 11,
              fontWeight: isToday ? 700 : 500,
              color: done ? "#c084fc" : isToday ? "#a78bfa" : "rgba(255,255,255,0.25)",
            }}>{day}</span>
            {done && (
              <span style={{
                fontSize: calView === "weekly" ? 14 : 10, color: "#c084fc",
                textShadow: "0 0 8px rgba(192,132,252,0.8), 0 0 16px rgba(168,85,247,0.5)",
                lineHeight: 1,
              }}>✓</span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        flex: 1.3,
        background: "linear-gradient(180deg, rgba(22,16,40,0.85), rgba(14,10,28,0.9))",
        border: "1.5px solid rgba(100,70,160,0.25)",
        borderRadius: 12, padding: "12px 10px", position: "relative",
      }}
    >
      {/* Mini spikes */}
      <svg viewBox="0 0 200 8" style={{ position: "absolute", top: -5, left: 20, right: 20, width: "calc(100% - 40px)", height: 8 }}>
        <path d="M0,8 L20,8 L25,2 L30,8 L50,8 L55,3 L60,8 L80,8 L85,0 L90,8 L110,8 L115,3 L120,8 L140,8 L145,2 L150,8 L170,8 L175,3 L180,8 L200,8" fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="0.8" />
      </svg>

      {/* Header + View Toggle */}
      <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700, color: "#e8e4f0", letterSpacing: 2 }}>{monthName}</div>
        <div className="flex gap-0.5">
          {(["W", "M", "D"] as const).map((v, i) => {
            const key = (["weekly", "monthly", "daily"] as const)[i];
            return (
              <button key={v} onClick={() => setCalView(key)} style={{
                width: 22, height: 18, borderRadius: 3, border: "none",
                background: calView === key ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.03)",
                color: calView === key ? "#c4b5fd" : "rgba(255,255,255,0.2)",
                fontFamily: "'Cormorant', serif", fontSize: 9, fontWeight: 500,
                cursor: "pointer", letterSpacing: 0.5,
              }}>{v}</button>
            );
          })}
        </div>
      </div>

      {/* Day headers */}
      {calView !== "daily" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontFamily: "'Cormorant', serif", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>{d}</div>
          ))}
        </div>
      )}

      {calView === "monthly" && renderCalGrid(calCells)}
      {calView === "weekly" && renderCalGrid(weekDays)}
      {calView === "daily" && (
        <div className="text-center" style={{ padding: "10px 0" }}>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: 36, fontWeight: 700,
            color: "#c4b5fd", textShadow: "0 0 20px rgba(139,92,246,0.4)",
          }}>{today}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 3, marginTop: 4, textTransform: "uppercase" }}>
            {now.toLocaleString("default", { weekday: "long" })}
          </div>
          <div style={{
            marginTop: 12, padding: "8px 12px",
            background: SPRINT_LOG[dk(year, month, today)] ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${SPRINT_LOG[dk(year, month, today)] ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.05)"}`,
            borderRadius: 6,
          }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, color: SPRINT_LOG[dk(year, month, today)] ? "#c084fc" : "rgba(255,255,255,0.3)" }}>
              {SPRINT_LOG[dk(year, month, today)] ? `${SPRINT_LOG[dk(year, month, today)]} sprints completed` : "No sprints yet"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPanel;
