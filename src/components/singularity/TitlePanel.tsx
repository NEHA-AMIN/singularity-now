const TitlePanel = () => (
  <div className="glass-card" style={{ margin: "0 14px", padding: "20px 10px 16px", textAlign: "center" }}>
    {/* Ornate corners */}
    {[0, 1, 2, 3].map(i => (
      <div
        key={i}
        style={{
          position: "absolute", width: 24, height: 24,
          ...(i < 2 ? { top: -1 } : { bottom: -1 }),
          ...(i % 2 === 0 ? { left: -1 } : { right: -1 }),
          borderTop: i < 2 ? "2.5px solid rgba(139,92,246,0.5)" : "none",
          borderBottom: i >= 2 ? "2.5px solid rgba(139,92,246,0.5)" : "none",
          borderLeft: i % 2 === 0 ? "2.5px solid rgba(139,92,246,0.5)" : "none",
          borderRight: i % 2 !== 0 ? "2.5px solid rgba(139,92,246,0.5)" : "none",
          borderRadius: i === 0 ? "14px 0 0 0" : i === 1 ? "0 14px 0 0" : i === 2 ? "0 0 0 14px" : "0 0 14px 0",
        }}
      />
    ))}

    <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 900, lineHeight: 1 }}>
      <div className="flex items-baseline justify-center">
        <span style={{ fontSize: 28, color: "#e8e4f0", letterSpacing: 1 }}>S</span>
        <span style={{ fontSize: 16, color: "#c4b5fd", letterSpacing: 3 }}>OLO</span>
      </div>
      <div
        style={{
          fontSize: 30, letterSpacing: 4, marginTop: 2,
          background: "linear-gradient(180deg, #d4c8f0 0%, #8b5cf6 60%, #6d28d9 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 8px rgba(139,92,246,0.3))",
        }}
      >
        LEVELING SYSTEM
      </div>
    </div>
    <div
      style={{
        fontFamily: "'Cormorant', serif", fontSize: 13, fontWeight: 400,
        color: "rgba(255,255,255,0.35)", letterSpacing: 6,
        textTransform: "uppercase", marginTop: 8,
      }}
    >
      Habit Tracker
    </div>
  </div>
);

export default TitlePanel;
