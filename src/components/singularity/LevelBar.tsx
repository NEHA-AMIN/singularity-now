const LevelBar = () => (
  <div style={{ padding: "14px 14px 0" }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{
        fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
        color: "#e8e4f0", letterSpacing: 2, marginBottom: 5,
      }}>
        Level 1
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: "37%" }}>
          <div className="bar-gloss" />
          <div className="bar-spec" />
        </div>
      </div>
    </div>

    {/* DPS + COINS badge */}
    <div
      className="flex justify-between items-center relative"
      style={{
        background: "linear-gradient(135deg, rgba(22,16,40,0.9), rgba(16,12,30,0.95))",
        border: "1.5px solid rgba(100,70,160,0.3)",
        borderRadius: 10, padding: "8px 16px",
      }}
    >
      {[0, 1].map(i => (
        <div
          key={i}
          style={{
            position: "absolute", top: -1, width: 12, height: 12,
            ...(i === 0
              ? { left: -1, borderLeft: "2px solid rgba(139,92,246,0.4)", borderTop: "2px solid rgba(139,92,246,0.4)", borderTopLeftRadius: 10 }
              : { right: -1, borderRight: "2px solid rgba(139,92,246,0.4)", borderTop: "2px solid rgba(139,92,246,0.4)", borderTopRightRadius: 10 }),
          }}
        />
      ))}
      <div style={{ fontFamily: "'Cormorant', serif", fontSize: 14, fontWeight: 500, color: "#c4b5fd", letterSpacing: 1 }}>
        GYM<span style={{ color: "rgba(255,255,255,0.3)", margin: "0 4px" }}>—</span>
        <span style={{ color: "#e8e4f0" }}>1 Hour</span>
      </div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#fbbf24", letterSpacing: 3 }}>MICRON</div>
    </div>
  </div>
);

export default LevelBar;
