import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GothicTopBorder, GothicBottomBorder } from "@/components/singularity/GothicBorder";
import { GodQuoteOverlay, SanctuaryOverlay } from "@/components/singularity/Overlays";
import TitlePanel from "@/components/singularity/TitlePanel";
import AvatarSkillRow from "@/components/singularity/AvatarSkillRow";
import LevelBar from "@/components/singularity/LevelBar";
import CalendarPanel from "@/components/singularity/CalendarPanel";
import QuoteWall from "@/components/singularity/QuoteWall";

const QUOTES = [
  { text: "The universe speaks in numbers. Learn its language, and you command reality.", by: "ARYABHATTA" },
  { text: "I had no training. No resources. Only obsession. That is enough.", by: "RAMANUJAN" },
  { text: "Everyone sees what you appear to be. Few experience what you really are.", by: "MACHIAVELLI" },
  { text: "When something is important enough, you do it even if the odds are against you.", by: "ELON MUSK" },
  { text: "In destruction lies creation. In stillness lies infinite power.", by: "LORD SHIVA" },
];

const Index = () => {
  const navigate = useNavigate();
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [showGod, setShowGod] = useState(true);

  const today = new Date().getDate();
  const todayQuote = QUOTES[today % QUOTES.length];

  useEffect(() => {
    const t = setTimeout(() => setShowGod(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#08060c" }}>
      {showGod && <GodQuoteOverlay onDismiss={() => setShowGod(false)} quote={todayQuote} />}
      {showSanctuary && <SanctuaryOverlay onDismiss={() => setShowSanctuary(false)} />}

      <div className="w-full relative" style={{ maxWidth: 400, background: "#0a0814", minHeight: "100vh" }}>
        <GothicTopBorder />

        {/* SHIVA BUTTON */}
        <button
          onClick={() => setShowSanctuary(true)}
          className="absolute z-10 flex items-center glass-icon"
          style={{
            top: 48, right: 12,
            padding: "5px 8px", cursor: "pointer",
            animation: "shivaGlow 3s infinite",
          }}
        >
          <span style={{ fontSize: 16 }}>🔱</span>
        </button>

        <TitlePanel />
        <AvatarSkillRow />
        <LevelBar />

        {/* CALENDAR + QUOTE WALL */}
        <div className="flex gap-2.5" style={{ padding: "14px 14px 0" }}>
          <CalendarPanel />
          <QuoteWall />
        </div>

        {/* GOAL BUTTON */}
        <div className="flex justify-center gap-3" style={{ padding: "16px 14px 8px" }}>
          <button
            className="glass-button"
            style={{
              fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
              color: "#c4b5fd", letterSpacing: 5,
              padding: "12px 32px",
              cursor: "pointer", animation: "playGlow 3s infinite",
              textTransform: "uppercase", position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderTop: "2px solid rgba(139,92,246,0.5)", borderRight: "2px solid rgba(139,92,246,0.5)", borderTopRightRadius: 10 }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 10, height: 10, borderBottom: "2px solid rgba(139,92,246,0.5)", borderLeft: "2px solid rgba(139,92,246,0.5)", borderBottomLeftRadius: 10 }} />
            PLAY
          </button>
          <button
            className="glass-button"
            onClick={() => navigate("/overview")}
            style={{
              fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
              color: "#c4b5fd", letterSpacing: 5,
              padding: "12px 32px",
              cursor: "pointer", animation: "playGlow 3s infinite",
              textTransform: "uppercase", position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderTop: "2px solid rgba(139,92,246,0.5)", borderRight: "2px solid rgba(139,92,246,0.5)", borderTopRightRadius: 10 }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 10, height: 10, borderBottom: "2px solid rgba(139,92,246,0.5)", borderLeft: "2px solid rgba(139,92,246,0.5)", borderBottomLeftRadius: 10 }} />
            OVERVIEW
          </button>
        </div>

        <GothicBottomBorder />
      </div>
    </div>
  );
};

export default Index;
