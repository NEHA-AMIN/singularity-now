import { useState, useEffect, useRef } from 'react';

const Levels = () => {
  const [activeId, setActiveId] = useState(null);
  const [typingText, setTypingText] = useState({});
  const [isTyping, setIsTyping] = useState({});
  const [customBg, setCustomBg] = useState(null);
  const [bgBlur, setBgBlur] = useState(0);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const levels = [
    { id: 1, num: "01", sub: "GROUND·ZERO", hex: "0xFF // 0000", top: 1025, side: "right", zone: "ZONE-J1", difficulty: "COMPLETE", alt: "0 M", eta: "00:00 H" },
    { id: 2, num: "02", sub: "TERMINUS", hex: "0x09 // 5C8B", top: 920, side: "left", zone: "ZONE-I2", difficulty: "MINIMAL", alt: "420 M", eta: "00:30 H" },
    { id: 3, num: "03", sub: "ISLAND·B", hex: "0x08 // D41E", top: 799, side: "right", zone: "ZONE-H3", difficulty: "LOW", alt: "840 M", eta: "00:55 H" },
    { id: 4, num: "04", sub: "BREACH", hex: "0x07 // A2F3", top: 692, side: "left", zone: "ZONE-G4", difficulty: "LOW", alt: "1320 M", eta: "01:20 H" },
    { id: 5, num: "05", sub: "ISLAND·A", hex: "0xF6 // 9E17", top: 567, side: "right", zone: "ZONE-F5", difficulty: "MEDIUM", alt: "1880 M", eta: "01:50 H" },
    { id: 6, num: "06", sub: "MID·ZONE", hex: "0xE5 // 6B0C", top: 446, side: "left", zone: "ZONE-E6", difficulty: "MEDIUM", alt: "2400 M", eta: "02:20 H" },
    { id: 7, num: "07", sub: "NARROWS", hex: "0xD4 // 3F55", top: 325, side: "right", zone: "ZONE-D7", difficulty: "MEDIUM", alt: "3020 M", eta: "03:00 H" },
    { id: 8, num: "08", sub: "SNOW·LINE", hex: "0xC3 // 1D8A", top: 218, side: "left", zone: "ZONE-C8", difficulty: "HARD", alt: "3640 M", eta: "03:45 H" },
    { id: 9, num: "09", sub: "RIDGE·N", hex: "0xB2 // 7C91", top: 121, side: "right", zone: "ZONE-B9", difficulty: "HARD", alt: "4210 M", eta: "04:30 H" },
    { id: 10, num: "10", sub: "APEX", hex: "0xA1 // 4F2E", top: 47, side: "left", zone: "ZONE-A10", difficulty: "EXTREME", alt: "4892 M", eta: "06:00 H" },
  ];

  const tasks = {
    1: "Ground Zero confirmed. All objectives complete. Await extraction. Final debrief transmission encoded and transmitted. Mission clock: stopped.",
    2: "Reach the terminus point and confirm coordinates for the final drop. Radio silence is mandatory. Signal with mirror flash — three bursts, two seconds each.",
    3: "Establish forward base on Island-Bravo. Clear the landing zone of debris. Prepare the comm relay tower for activation at 0300 hours.",
    4: "Breach the sea-level gap. Currents between the island sections run at 12 knots. Time your crossing with precision — one window available every 90 minutes.",
    5: "Secure Island-Alpha before tide rise. The eastern islet floods every 6 hours. Locate the submerged equipment cache and retrieve the encrypted drive.",
    6: "Rendezvous at mid-zone extraction point. Retrieve the data package from the crashed probe. Timer active — you have 18 minutes once you arrive.",
    7: "Navigate the narrows — a 40-metre corridor between two cliff faces. Route is compromised. Find the alternate path and clear the debris blocking descent.",
    8: "Cross the snow line before dawn. Avalanche risk is HIGH on the eastern face. Plant three seismic sensors along the traverse route.",
    9: "Secure the northern ridge outpost. Enemy recon drones patrol this sector. Stay low, use rock formations for cover. Report back on comms channel 7.",
    10: "Reach the summit apex and plant the beacon. Navigate extreme wind shear above 4800m. Oxygen supply critical — move fast, waste nothing."
  };

  const typeText = (id, text) => {
    setTypingText(prev => ({ ...prev, [id]: '' }));
    setIsTyping(prev => ({ ...prev, [id]: true }));
    
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        setTypingText(prev => ({ ...prev, [id]: text.substring(0, i + 1) }));
        i++;
        typingTimeoutRef.current = setTimeout(tick, 22 + Math.random() * 18);
      } else {
        setIsTyping(prev => ({ ...prev, [id]: false }));
      }
    };
    tick();
  };

  const closeActive = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setActiveId(null);
  };

  const openDialogue = (e, id) => {
    e.stopPropagation();
    if (activeId === id) {
      closeActive();
      return;
    }
    closeActive();
    setActiveId(id);
    setTimeout(() => {
      typeText(id, tasks[id]);
    }, 380);
  };

  const handlePlayClick = (e, id) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.textContent = '▶ LOADING...';
    setTimeout(() => { btn.textContent = '▶ PLAY'; }, 1800);
  };

  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBg(event.target?.result);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!activeId) return;
      const dlg = document.getElementById(`dlg-${activeId}`);
      const lvl = document.querySelector(`.level[data-id="${activeId}"]`);
      if (dlg && !dlg.contains(e.target) && (!lvl || !lvl.contains(e.target))) {
        closeActive();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeId]);

  return (
    <div style={{
      background: "#000",
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
        
        .levels-container {
          position: relative;
          width: 1920px;
          min-height: 1080px;
          overflow: hidden;
          font-family: 'Orbitron', monospace;
        }
        
        .levels-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          z-index: 0;
          transition: filter 0.3s ease;
        }
        
        .levels-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%);
          z-index: 1;
          pointer-events: none;
        }
        
        .level {
          position: absolute;
          left: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        
        .level.left {
          transform: translateX(-100%);
          flex-direction: row;
        }
        
        .level.right {
          transform: translateX(0%);
          flex-direction: row;
        }
        
        .level-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e8002d;
          box-shadow: 0 0 5px rgba(232,0,45,0.7), 0 0 10px rgba(232,0,45,0.3);
          flex-shrink: 0;
          cursor: pointer;
          pointer-events: all;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .level-dot:hover {
          transform: scale(1.5);
          box-shadow: 0 0 10px rgba(232,0,45,0.9), 0 0 20px rgba(232,0,45,0.5);
        }
        
        .level-dot.active {
          background: #fff;
          box-shadow: 0 0 8px rgba(232,0,45,1), 0 0 18px rgba(232,0,45,0.6);
        }
        
        .level-line {
          height: 1px;
          width: 44px;
          flex-shrink: 0;
          pointer-events: none;
          transition: opacity 0.25s ease, width 0.3s ease;
        }
        
        .level.left .level-line {
          background: linear-gradient(270deg, rgba(232,0,45,0.9) 0%, rgba(232,0,45,0.4) 100%);
        }
        
        .level.right .level-line {
          background: linear-gradient(90deg, rgba(232,0,45,0.9) 0%, rgba(232,0,45,0.4) 100%);
        }
        
        .level.active-level .level-line {
          opacity: 0;
          width: 0;
        }
        
        .level.active-level .level-tag {
          opacity: 0;
          pointer-events: none;
          transform: scaleX(0.6);
        }
        
        .level-tag {
          padding: 4px 9px;
          background: rgba(5, 0, 1, 0.75);
          border: 0.75px solid rgba(232,0,45,0.55);
          backdrop-filter: blur(1px);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          pointer-events: all;
          transition: background 0.2s, border-color 0.2s, opacity 0.25s ease, transform 0.25s ease;
          transform-origin: right center;
        }
        
        .level.right .level-tag {
          transform-origin: left center;
        }
        
        .level-tag:hover {
          background: rgba(20,0,4,0.88);
          border-color: rgba(232,0,45,0.85);
        }
        
        .level.left .level-tag {
          align-items: flex-end;
          border-right: 2px solid #e8002d;
          border-left: 0.75px solid rgba(232,0,45,0.4);
        }
        
        .level.right .level-tag {
          align-items: flex-start;
          border-left: 2px solid #e8002d;
          border-right: 0.75px solid rgba(232,0,45,0.4);
        }
        
        .level-num {
          font-family: 'Orbitron', monospace;
          font-size: 16px;
          font-weight: 900;
          color: #e8002d;
          letter-spacing: 0.1em;
          line-height: 1;
          text-shadow: 0 0 4px rgba(232,0,45,0.5);
        }
        
        .level-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 7px;
          color: rgba(232,0,45,0.55);
          letter-spacing: 0.16em;
          margin-top: 2px;
          text-transform: uppercase;
        }
        
        .level-hex {
          font-family: 'Share Tech Mono', monospace;
          font-size: 6px;
          color: rgba(200,50,60,0.4);
          letter-spacing: 0.08em;
          margin-top: 1px;
        }
        
        .dialogue {
          position: absolute;
          z-index: 20;
          width: 240px;
          background: rgba(4,0,1,0.93);
          border: 0.75px solid rgba(232,0,45,0.5);
          overflow: hidden;
          pointer-events: all;
          max-height: 0;
          opacity: 0;
          transform: scaleY(0.6);
          transition:
            max-height 0.45s cubic-bezier(0.16,1,0.3,1),
            opacity 0.3s ease,
            transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        
        .dialogue.open {
          max-height: 320px;
          opacity: 1;
          transform: scaleY(1);
        }
        
        .dialogue.side-left {
          right: calc(50% + 150px);
          border-right: 2px solid #e8002d;
          transform-origin: top right;
        }
        
        .dialogue.side-right {
          left: calc(50% + 150px);
          border-left: 2px solid #e8002d;
          transform-origin: top left;
        }
        
        .dlg-connector {
          position: absolute;
          z-index: 15;
          height: 1px;
          width: 148px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s ease 0.1s;
        }
        
        .dlg-connector.visible {
          opacity: 1;
        }
        
        .dlg-connector.conn-left {
          right: calc(50% + 2px);
          background: linear-gradient(90deg, rgba(232,0,45,0.15) 0%, rgba(232,0,45,0.5) 100%);
        }
        
        .dlg-connector.conn-right {
          left: calc(50% + 2px);
          background: linear-gradient(270deg, rgba(232,0,45,0.15) 0%, rgba(232,0,45,0.5) 100%);
        }
        
        .dlg-header {
          background: rgba(232,0,45,0.12);
          border-bottom: 0.75px solid rgba(232,0,45,0.35);
          padding: 7px 10px 5px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        
        .dlg-lvl {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          font-weight: 900;
          color: #e8002d;
          letter-spacing: 0.12em;
          text-shadow: 0 0 3px rgba(232,0,45,0.4);
        }
        
        .dlg-zone {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          color: rgba(232,0,45,0.6);
          letter-spacing: 0.14em;
        }
        
        .dlg-body {
          padding: 9px 10px 6px;
        }
        
        .dlg-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 7px;
          color: rgba(232,0,45,0.45);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .dlg-task {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9.5px;
          color: #c8ccd2;
          line-height: 1.65;
          letter-spacing: 0.04em;
          min-height: 80px;
        }
        
        .dlg-cursor {
          display: inline-block;
          width: 6px;
          height: 11px;
          background: #e8002d;
          margin-left: 1px;
          vertical-align: middle;
          animation: blink 0.75s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .dlg-sep {
          height: 0.75px;
          background: linear-gradient(90deg, rgba(232,0,45,0.5) 0%, rgba(232,0,45,0.1) 100%);
          margin: 8px 10px;
        }
        
        .dlg-meta {
          display: flex;
          justify-content: space-between;
          padding: 0 10px 5px;
        }
        
        .dlg-meta-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        
        .dlg-meta-lbl {
          font-family: 'Share Tech Mono', monospace;
          font-size: 6.5px;
          color: rgba(232,0,45,0.38);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        
        .dlg-meta-val {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          color: rgba(200,210,220,0.7);
          letter-spacing: 0.06em;
        }
        
        .dlg-footer {
          padding: 6px 10px 9px;
          display: flex;
          justify-content: flex-end;
        }
        
        .play-btn {
          font-family: 'Orbitron', monospace;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: #e8002d;
          border: none;
          padding: 6px 18px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, letter-spacing 0.2s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        
        .play-btn:hover {
          background: #ff1a3a;
          letter-spacing: 0.22em;
        }
        
        .play-btn:active {
          background: #b5001e;
        }
        
        .bg-controls {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 30;
          display: flex;
          gap: 12px;
        }
        
        .bg-upload-btn, .bg-blur-btn {
          width: 44px;
          height: 44px;
          background: rgba(4,0,1,0.85);
          border: 1.5px solid rgba(232,0,45,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        
        .bg-upload-btn:hover, .bg-blur-btn:hover {
          background: rgba(232,0,45,0.2);
          border-color: #e8002d;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(232,0,45,0.5);
        }
        
        .bg-upload-btn:hover {
          transform: scale(1.1) rotate(90deg);
        }
        
        .bg-blur-btn.active {
          background: rgba(232,0,45,0.3);
          border-color: #e8002d;
          box-shadow: 0 0 10px rgba(232,0,45,0.4);
        }
        
        .bg-upload-btn svg, .bg-blur-btn svg {
          width: 22px;
          height: 22px;
          stroke: #e8002d;
          transition: stroke 0.3s ease;
        }
        
        .bg-upload-btn:hover svg, .bg-blur-btn:hover svg {
          stroke: #ff1a3a;
        }
        
        .bg-upload-input {
          display: none;
        }
        
        .scanlines::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px
          );
          pointer-events: none;
          z-index: 999;
        }
      `}</style>

      <div className="levels-container scanlines">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBgUpload}
          className="bg-upload-input"
        />
        <div className="bg-controls">
          <button
            className="bg-upload-btn"
            onClick={triggerFileInput}
            title="Upload custom background"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            className={`bg-blur-btn ${bgBlur > 0 ? 'active' : ''}`}
            onClick={toggleBlur}
            title={`Background blur: ${bgBlur === 0 ? 'Off' : bgBlur === 4 ? 'Low' : 'High'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 5v.01M12 18.99v.01M5 12h.01M18.99 12h.01M7.05 7.05l.01.01M16.94 16.94l.01.01M7.05 16.95l.01-.01M16.94 7.06l.01-.01"></path>
            </svg>
          </button>
        </div>
        <img
          className="levels-bg"
          src={customBg || "/mount-range-desktop.png"}
          alt="mountain"
          style={{ filter: `blur(${bgBlur}px)` }}
        />
        <div className="levels-vignette"></div>

        {/* Level Markers */}
        {levels.map((level) => (
          <div
            key={level.id}
            data-id={level.id}
            className={`level ${level.side} ${activeId === level.id ? 'active-level' : ''}`}
            style={{ top: `${level.top}px` }}
          >
            {level.side === "left" ? (
              <>
                <div className="level-tag" onClick={(e) => openDialogue(e, level.id)}>
                  <div className="level-num">{level.num}</div>
                  <div className="level-sub">{level.sub}</div>
                  <div className="level-hex">{level.hex}</div>
                </div>
                <div className="level-line"></div>
                <div
                  className={`level-dot ${activeId === level.id ? 'active' : ''}`}
                  onClick={(e) => openDialogue(e, level.id)}
                ></div>
              </>
            ) : (
              <>
                <div
                  className={`level-dot ${activeId === level.id ? 'active' : ''}`}
                  onClick={(e) => openDialogue(e, level.id)}
                ></div>
                <div className="level-line"></div>
                <div className="level-tag" onClick={(e) => openDialogue(e, level.id)}>
                  <div className="level-num">{level.num}</div>
                  <div className="level-sub">{level.sub}</div>
                  <div className="level-hex">{level.hex}</div>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Dialogue Boxes + Connector Lines */}
        {levels.map((level) => (
          <div key={`dlg-wrap-${level.id}`}>
            {/* Connector line from dot to dialogue */}
            <div
              className={`dlg-connector conn-${level.side} ${activeId === level.id ? 'visible' : ''}`}
              style={{ top: `${level.top + 3}px` }}
            ></div>
            <div
              key={`dlg-${level.id}`}
              id={`dlg-${level.id}`}
              className={`dialogue side-${level.side} ${activeId === level.id ? 'open' : ''}`}
              style={{ top: `${level.top - 20}px` }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="dlg-header">
              <span className="dlg-lvl">{level.num}</span>
              <span className="dlg-zone">{level.sub} // {level.zone}</span>
            </div>
            <div className="dlg-body">
              <div className="dlg-label">// MISSION OBJECTIVE</div>
              <div className="dlg-task">
                {typingText[level.id] || ''}
                {isTyping[level.id] && <span className="dlg-cursor"></span>}
              </div>
            </div>
            <div className="dlg-sep"></div>
            <div className="dlg-meta">
              <div className="dlg-meta-item">
                <div className="dlg-meta-lbl">DIFFICULTY</div>
                <div className="dlg-meta-val">{level.difficulty}</div>
              </div>
              <div className="dlg-meta-item">
                <div className="dlg-meta-lbl">ALT</div>
                <div className="dlg-meta-val">{level.alt}</div>
              </div>
              <div className="dlg-meta-item">
                <div className="dlg-meta-lbl">ETA</div>
                <div className="dlg-meta-val">{level.eta}</div>
              </div>
            </div>
            <div className="dlg-footer">
              <button className="play-btn" onClick={(e) => handlePlayClick(e, level.id)}>
                ▶ PLAY
              </button>
            </div>
          </div>
          </div>
        ))}

        {/* Vertical spine dashed line */}
        <svg 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 5, 
            pointerEvents: "none" 
          }}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="spineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(232,0,45,0.0)" />
              <stop offset="8%" stopColor="rgba(232,0,45,0.5)" />
              <stop offset="50%" stopColor="rgba(232,0,45,0.35)" />
              <stop offset="92%" stopColor="rgba(232,0,45,0.5)" />
              <stop offset="100%" stopColor="rgba(232,0,45,0.0)" />
            </linearGradient>
          </defs>
          <path 
            d="M960,50 Q959,120 958,180 Q957,250 957,310 Q956,380 955,410 Q954,490 953,560 Q951,640 949,715 Q947,790 944,875 Q941,950 937,1010 Q933,1030 928,1050"
            stroke="url(#spineGrad)"
            strokeWidth="0.8"
            fill="none"
            strokeDasharray="5,4"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Levels;