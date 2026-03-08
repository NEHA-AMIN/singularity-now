const QUOTES = [
  { text: "The universe speaks in numbers. Learn its language, and you command reality.", by: "ARYABHATTA" },
  { text: "I had no training. No resources. Only obsession. That is enough.", by: "RAMANUJAN" },
  { text: "Everyone sees what you appear to be. Few experience what you really are.", by: "MACHIAVELLI" },
  { text: "When something is important enough, you do it even if the odds are against you.", by: "ELON MUSK" },
  { text: "In destruction lies creation. In stillness lies infinite power.", by: "LORD SHIVA" },
];

const QuoteWall = () => {
  const today = new Date().getDate();
  const todayQuote = QUOTES[today % QUOTES.length];

  return (
    <div
      className="glass-card"
      style={{
        flex: 0.7, padding: "12px 10px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}
    >
      <svg viewBox="0 0 120 8" style={{ position: "absolute", top: -5, left: 15, right: 15, width: "calc(100% - 30px)", height: 8 }}>
        <path d="M0,8 L15,8 L20,2 L25,8 L45,8 L50,0 L55,8 L75,8 L80,2 L85,8 L105,8 L110,3 L115,8 L120,8" fill="none" stroke="rgba(139,92,246,0.25)" strokeWidth="0.8" />
      </svg>

      <div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: 10, fontWeight: 700,
          color: "rgba(255,255,255,0.5)", letterSpacing: 2,
          textAlign: "center", marginBottom: 12, textTransform: "uppercase",
        }}>
          Quote Wall
        </div>
        <div style={{
          fontFamily: "'Cormorant', serif", fontSize: 13, fontStyle: "italic",
          color: "rgba(255,255,255,0.4)", lineHeight: 1.7,
          textAlign: "center", letterSpacing: 0.3, fontWeight: 300,
        }}>
          "{todayQuote.text}"
        </div>
      </div>

      <div style={{
        fontFamily: "'Cormorant', serif", fontSize: 10, fontWeight: 500,
        color: "#a78bfa", letterSpacing: 2, textAlign: "center",
        marginTop: 10, textTransform: "uppercase",
      }}>
        — {todayQuote.by}
      </div>
    </div>
  );
};

export default QuoteWall;
