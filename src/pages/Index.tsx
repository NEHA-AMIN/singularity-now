import { useState, useEffect, useRef } from "react";
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
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [bgBlur, setBgBlur] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().getDate();
  const todayQuote = QUOTES[today % QUOTES.length];

  useEffect(() => {
    const t = setTimeout(() => setShowGod(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleBlur = () => {
    setBgBlur(prev => {
      if (prev === 0) return 4;
      if (prev === 4) return 8;
      return 0;
    });
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ position: "relative", overflow: "hidden" }}>
      {/* Background Image */}
      {customBg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${customBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: `blur(${bgBlur}px)`,
            transition: "filter 0.3s ease"
          }}
        />
      )}
      
      {/* Background Controls */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBgUpload}
        style={{ display: "none" }}
      />
      <div style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        gap: 12
      }}>
        <button
          onClick={triggerFileInput}
          title="Upload custom background"
          style={{
            width: 44,
            height: 44,
            background: "rgba(10,8,20,0.85)",
            border: "1.5px solid rgba(139,92,246,0.6)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(4px)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139,92,246,0.2)";
            e.currentTarget.style.borderColor = "#8b5cf6";
            e.currentTarget.style.transform = "scale(1.1) rotate(90deg)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(139,92,246,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(10,8,20,0.85)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, stroke: "#8b5cf6" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={toggleBlur}
          title={`Background blur: ${bgBlur === 0 ? 'Off' : bgBlur === 4 ? 'Low' : 'High'}`}
          style={{
            width: 44,
            height: 44,
            background: bgBlur > 0 ? "rgba(139,92,246,0.3)" : "rgba(10,8,20,0.85)",
            border: bgBlur > 0 ? "1.5px solid #8b5cf6" : "1.5px solid rgba(139,92,246,0.6)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(4px)",
            boxShadow: bgBlur > 0 ? "0 0 10px rgba(139,92,246,0.4)" : "none"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139,92,246,0.2)";
            e.currentTarget.style.borderColor = "#8b5cf6";
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(139,92,246,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = bgBlur > 0 ? "rgba(139,92,246,0.3)" : "rgba(10,8,20,0.85)";
            e.currentTarget.style.borderColor = bgBlur > 0 ? "#8b5cf6" : "rgba(139,92,246,0.6)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = bgBlur > 0 ? "0 0 10px rgba(139,92,246,0.4)" : "none";
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, stroke: "#8b5cf6" }}>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 5v.01M12 18.99v.01M5 12h.01M18.99 12h.01M7.05 7.05l.01.01M16.94 16.94l.01.01M7.05 16.95l.01-.01M16.94 7.06l.01-.01"></path>
          </svg>
        </button>
      </div>

      {showGod && <GodQuoteOverlay onDismiss={() => setShowGod(false)} quote={todayQuote} />}
      {showSanctuary && <SanctuaryOverlay onDismiss={() => setShowSanctuary(false)} />}

      <div className="w-full relative" style={{ maxWidth: 400, background: customBg ? "rgba(10,8,20,0.85)" : "#0a0814", minHeight: "100vh", zIndex: 1, backdropFilter: customBg ? "blur(2px)" : "none" }}>
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
            onClick={() => navigate("/levels")}
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
