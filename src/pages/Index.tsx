import { useState, useEffect } from "react";
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
      {/* GOD QUOTE OVERLAY */}
      {showGod && <GodQuoteOverlay onDismiss={() => setShowGod(false)} quote={todayQuote} />}

      {/* SANCTUARY OVERLAY */}
      {showSanctuary && <SanctuaryOverlay onDismiss={() => setShowSanctuary(false)} />}

      {/* MAIN FRAME */}
      <div className="w-full relative" style={{ maxWidth: 400, background: "#0a0814", minHeight: "100vh" }}>
        <GothicTopBorder />

        {/* SHIVA BUTTON */}
        <button
          onClick={() => setShowSanctuary(true)}
          className="absolute z-10 flex items-center"
          style={{
            top: 48, right: 12,
            background: "rgba(125,211,252,0.04)", border: "1px solid rgba(125,211,252,0.12)",
            borderRadius: 8, padding: "5px 8px", cursor: "pointer",
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
        <div className="flex justify-end" style={{ padding: "16px 14px 8px" }}>
          <button
            style={{
              fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 800,
              color: "#c4b5fd", letterSpacing: 5,
              background: "linear-gradient(135deg, rgba(22,16,40,0.9), rgba(14,10,28,0.95))",
              border: "1.5px solid rgba(100,70,160,0.35)",
              borderRadius: 10, padding: "12px 32px",
              cursor: "pointer", animation: "playGlow 3s infinite",
              textTransform: "uppercase", position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderTop: "2px solid rgba(139,92,246,0.5)", borderRight: "2px solid rgba(139,92,246,0.5)", borderTopRightRadius: 10 }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 10, height: 10, borderBottom: "2px solid rgba(139,92,246,0.5)", borderLeft: "2px solid rgba(139,92,246,0.5)", borderBottomLeftRadius: 10 }} />
            GOAL
          </button>
        </div>

        <GothicBottomBorder />

        {/* Footer */}
        <div
          className="text-center"
          style={{
            padding: "4px 0 16px",
            fontFamily: "'Rajdhani', sans-serif", fontSize: 8,
            color: "rgba(255,255,255,0.06)", letterSpacing: 4, textTransform: "uppercase",
          }}
        >
          Project Singularity · v1.0
        </div>
      </div>
    </div>
  );
};

export default Index;
