import { useState, useEffect } from "react";

const FONT = "'Georgia', 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

const STORIES = [
  {
    id: "factory_pollution",
    headline: "Local Factory Linked to River Contamination",
    summary: "Investigation reveals toxic discharge from Meridian Industries plant has contaminated the Alvar River. Fish populations down 60%, residents report illness.",
    fullText: "Three months of investigative reporting has uncovered evidence that Meridian Industries, the city's largest employer with 4,200 workers, has been illegally dumping chemical waste into the Alvar River since 2019. Water samples tested by three independent labs show chromium levels 40x above safe limits.",
    pressure: { type: "money", actor: "Meridian Industries CEO Harold Voss", offer: "Full-page ad contract worth $240,000/year — quietly dropped if story runs.", icon: "💰" },
    integrityChoice: "Run the story with all evidence intact.",
    censorChoice: "Soften to 'environmental concerns raised' — no named source.",
    suppressChoice: "Spike the story. Awaiting 'more testing.'",
    integrityImpact: { integrity: +15, revenue: -20, trust: +20, heat: +15 },
    censorImpact: { integrity: -10, revenue: +10, trust: -5, heat: +5 },
    suppressImpact: { integrity: -20, revenue: +20, trust: -15, heat: -5 },
  },
  {
    id: "mayor_corruption",
    headline: "Mayor's Office Awarded Contract to Brother-in-Law's Firm",
    summary: "Documents show city contract worth $1.2M bypassed competitive bidding. Mayor Delgado's brother-in-law owns winning company, incorporated 3 weeks before bid.",
    fullText: "A whistleblower inside City Hall has handed over procurement documents showing that a no-bid contract for infrastructure work was awarded to Pinnacle Construction Group — a company with no prior public contracts, incorporated by Marco Salinas, the Mayor's brother-in-law.",
    pressure: { type: "threat", actor: "Mayor Delgado's Chief of Staff", offer: "City press credentials will be reviewed. Parking permits for your delivery vans — at risk.", icon: "⚠️" },
    integrityChoice: "Publish with documents. Let the public judge.",
    censorChoice: "Run a vague piece about 'procurement irregularities.'",
    suppressChoice: "Hold the story pending 'official comment' — indefinitely.",
    integrityImpact: { integrity: +15, revenue: +5, trust: +20, heat: +20 },
    censorImpact: { integrity: -10, revenue: 0, trust: -10, heat: +10 },
    suppressImpact: { integrity: -20, revenue: -5, trust: -20, heat: 0 },
  },
  {
    id: "police_misconduct",
    headline: "Body Cam Footage Contradicts Officer's Arrest Report",
    summary: "Exclusive: video obtained from a source inside the department shows Officer Raines used force AFTER suspect complied. Report claims otherwise.",
    fullText: "A leaked body camera recording, verified by our legal team, directly contradicts the official arrest report filed by Officer Craig Raines. The suspect can be seen with hands raised when force was applied. The Chief has submitted a complaint to our publisher.",
    pressure: { type: "influence", actor: "Police Chief Nakamura", offer: "Embedded ride-alongs and exclusive access to major crime briefings — pulled permanently.", icon: "🛡️" },
    integrityChoice: "Publish the footage description and full account.",
    censorChoice: "Report 'conflicting accounts' without naming the officer.",
    suppressChoice: "Return the footage. Preserve the relationship.",
    integrityImpact: { integrity: +15, revenue: 0, trust: +15, heat: +15 },
    censorImpact: { integrity: -5, revenue: 0, trust: -8, heat: +5 },
    suppressImpact: { integrity: -25, revenue: 0, trust: -20, heat: -10 },
  },
  {
    id: "school_data",
    headline: "District Quietly Altered Test Score Data Before State Review",
    summary: "A statistician at the school board found unexplained upward corrections in scores across 12 schools, timed precisely before state evaluations.",
    fullText: "Dr. Priya Mehta, a data analyst at the school district for 11 years, discovered systematic score alterations in spreadsheets she was asked to overwrite. She kept copies. The corrections benefited schools at risk of state takeover — and principals who received performance bonuses.",
    pressure: { type: "personal", actor: "Superintendent Walsh (your child's school principal calls)", offer: "Your daughter's school may face repercussions in the next funding cycle.", icon: "👨‍👩‍👧" },
    integrityChoice: "Run it. The public's children deserve the truth.",
    censorChoice: "Publish without naming specific schools or individuals.",
    suppressChoice: "Sit on it. Too close to home.",
    integrityImpact: { integrity: +20, revenue: +5, trust: +20, heat: +10 },
    censorImpact: { integrity: -8, revenue: 0, trust: -5, heat: +3 },
    suppressImpact: { integrity: -25, revenue: 0, trust: -20, heat: -5 },
  },
  {
    id: "election_leak",
    headline: "Leaked Memo Shows Campaign Received Foreign Donor Funds",
    summary: "A document from an anonymous source claims Senator Harlow's campaign accepted $400K funneled through shell companies with links to foreign nationals.",
    fullText: "An unsigned memo, accompanied by bank transfer records the source claims are authentic, suggests Senator Harlow's re-election campaign received funds routed through three Delaware LLCs with foreign beneficial owners. The campaign denies all. Authenticity unverified by two of our three expert consultants.",
    pressure: { type: "legal", actor: "Harlow Campaign attorneys (Kettner & Webb LLP)", offer: "Pre-publication injunction threatened. Personal liability for editors named in suit.", icon: "⚖️" },
    integrityChoice: "Publish with full context on source limitations.",
    censorChoice: "Run a story about 'questions raised' with no specifics.",
    suppressChoice: "Hold until legal threat resolved — likely never.",
    integrityImpact: { integrity: +10, revenue: +10, trust: +10, heat: +25 },
    censorImpact: { integrity: -5, revenue: 0, trust: -5, heat: +8 },
    suppressImpact: { integrity: -15, revenue: -5, trust: -10, heat: 0 },
  },
];

const ENDINGS = [
  {
    id: "pillar",
    condition: (s) => s.integrity >= 80 && s.trust >= 70,
    title: "A Pillar of Democracy",
    text: "The Alvar Courier is cited in journalism school curricula. You face three lawsuits, two of which you win. A Pulitzer nomination arrives for your investigative team. Your staff doubles. You are invited to speak at the National Press Foundation. The pressure was real. You chose the story anyway.",
    color: "#1a5c2a",
    bg: "#eaf3de",
    symbol: "✦",
  },
  {
    id: "survivor",
    condition: (s) => s.integrity >= 55 && s.trust >= 40,
    title: "The Careful Survivor",
    text: "You kept the paper alive. Some stories got through. Others didn't. Three of your best reporters left for larger outlets, citing 'editorial timidity.' But you're still here — and that's not nothing. The community still reads you. Mostly.",
    color: "#185fa5",
    bg: "#e6f1fb",
    symbol: "◈",
  },
  {
    id: "managed",
    condition: (s) => s.integrity >= 35 && s.revenue >= 50,
    title: "Managed Decline",
    text: "The Alvar Courier is financially stable. Advertisers are happy. The mayor attends your anniversary gala. But three investigative reporters have left without replacements. Your readership is aging. Younger readers call you 'the paper that never breaks anything.' They're not wrong.",
    color: "#854f0b",
    bg: "#faeeda",
    symbol: "◇",
  },
  {
    id: "captured",
    condition: (s) => s.integrity < 35 && s.revenue >= 50,
    title: "Captured",
    text: "The paper exists. The building exists. The masthead still reads 'The Alvar Courier — Est. 1952 — Truth Without Fear.' The fear is gone, alright. So is the truth. You have become a press release service for the powerful. No one stormed the building. It happened slowly, one suppressed story at a time.",
    color: "#a32d2d",
    bg: "#fcebeb",
    symbol: "▣",
  },
  {
    id: "shutdown",
    condition: (s) => s.revenue < 20,
    title: "The Final Edition",
    text: "The Alvar Courier printed its last edition on a Thursday. Advertisers had pulled out. The building lease expired. You ran every story you believed in. The public noticed — for about two weeks. Then they moved on. Integrity without sustainability is a monument, not a newspaper. But those stories are permanent.",
    color: "#533ab7",
    bg: "#eeedfe",
    symbol: "◉",
  },
  {
    id: "default",
    condition: () => true,
    title: "The Long Gray Middle",
    text: "Not a triumph. Not a collapse. Five days of decisions that compounded into a paper that reflects you — compromised in parts, principled in others, surviving but not thriving. This is where most newspapers live. The question is where they go from here.",
    color: "#5f5e5a",
    bg: "#f1efe8",
    symbol: "○",
  },
];

const PRESSURE_COLORS = {
  money: { bg: "#faeeda", text: "#854f0b", border: "#ba7517" },
  threat: { bg: "#fcebeb", text: "#a32d2d", border: "#e24b4a" },
  influence: { bg: "#eeedfe", text: "#533ab7", border: "#7f77dd" },
  personal: { bg: "#fbeaf0", text: "#993556", border: "#d4537e" },
  legal: { bg: "#e6f1fb", text: "#185fa5", border: "#378add" },
};

const PRESSURE_LABELS = {
  money: "FINANCIAL PRESSURE",
  threat: "VEILED THREAT",
  influence: "ACCESS LEVERAGE",
  personal: "PERSONAL PRESSURE",
  legal: "LEGAL THREAT",
};

function StatBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: MONO, color: "#888", marginBottom: 3 }}>
        <span>{label.toUpperCase()}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div style={{ height: 6, background: "#e8e4db", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, value))}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function Masthead({ day }) {
  const date = new Date(2024, 2, 18 + day);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{ textAlign: "center", borderBottom: "3px double #1a1a1a", paddingBottom: 12, marginBottom: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 3, color: "#666", marginBottom: 4 }}>THE ALVAR COURIER</div>
      <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: "bold", letterSpacing: -1, lineHeight: 1 }}>The Alvar Courier</div>
      <div style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 11, color: "#555", marginTop: 3 }}>Est. 1952 — Truth Without Fear</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: MONO, fontSize: 10, color: "#555", borderTop: "1px solid #ccc", paddingTop: 6 }}>
        <span>VOL. LXXII  NO. {180 + day}</span>
        <span>{dateStr}</span>
        <span>DAY {day + 1} OF 5</span>
      </div>
    </div>
  );
}

function ImpactTag({ label, value }) {
  const positive = value > 0;
  const color = positive ? "#1a5c2a" : value < 0 ? "#a32d2d" : "#5f5e5a";
  const bg = positive ? "#eaf3de" : value < 0 ? "#fcebeb" : "#f1efe8";
  return (
    <span style={{ fontFamily: MONO, fontSize: 10, background: bg, color, border: `1px solid ${color}33`, borderRadius: 3, padding: "2px 6px", marginRight: 4 }}>
      {positive ? "+" : ""}{value} {label}
    </span>
  );
}

function ChoiceCard({ label, choice, impact, onSelect, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1.5px solid ${hovered && !disabled ? "#1a1a1a" : "#ccc"}`,
        borderRadius: 6,
        padding: "14px 16px",
        marginBottom: 10,
        cursor: disabled ? "default" : "pointer",
        background: hovered && !disabled ? "#f9f6f0" : "#fff",
        transition: "all 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.5, color: "#1a1a1a", marginBottom: 10 }}>{choice}</div>
      <div>
        {Object.entries(impact).map(([k, v]) => (
          <ImpactTag key={k} label={k.toUpperCase()} value={v} />
        ))}
      </div>
    </div>
  );
}

function PressureBadge({ pressure }) {
  const style = PRESSURE_COLORS[pressure.type];
  return (
    <div style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: style.text, marginBottom: 5 }}>
        {pressure.icon} {PRESSURE_LABELS[pressure.type]}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: "#333", marginBottom: 3 }}>
        <strong>{pressure.actor}</strong>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: "#444", lineHeight: 1.5, fontStyle: "italic" }}>
        "{pressure.offer}"
      </div>
    </div>
  );
}

function NewsroomSounds() {
  return (
    <div style={{ fontFamily: MONO, fontSize: 9, color: "#bbb", letterSpacing: 2, marginBottom: 16 }}>
      ◦ ◦ ◦ NEWSROOM ACTIVE — DEADLINE IN 4 HOURS ◦ ◦ ◦
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [day, setDay] = useState(0);
  const [stats, setStats] = useState({ integrity: 50, revenue: 60, trust: 50, heat: 20 });
  const [decisions, setDecisions] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [ending, setEnding] = useState(null);
  const [notification, setNotification] = useState(null);

  const story = STORIES[day];

  function applyImpact(impact) {
    setStats(prev => ({
      integrity: Math.min(100, Math.max(0, prev.integrity + impact.integrity)),
      revenue: Math.min(100, Math.max(0, prev.revenue + impact.revenue)),
      trust: Math.min(100, Math.max(0, prev.trust + impact.trust)),
      heat: Math.min(100, Math.max(0, prev.heat + impact.heat)),
    }));
  }

  function showNotif(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2200);
  }

  function handleChoice(type) {
    if (animating) return;
    setAnimating(true);
    let impact, label;
    if (type === "integrity") { impact = story.integrityImpact; label = "PUBLISHED"; }
    else if (type === "censor") { impact = story.censorImpact; label = "SOFTENED"; }
    else { impact = story.suppressImpact; label = "SPIKED"; }

    applyImpact(impact);
    setDecisions(prev => [...prev, { day: day + 1, headline: story.headline, choice: type, label }]);
    showNotif(`Story ${label}. Consequences to follow.`);

    setTimeout(() => {
      setAnimating(false);
      if (day >= 4) {
        resolveEnding();
        setPhase("ending");
      } else {
        setDay(d => d + 1);
        setPhase("story");
      }
    }, 1200);
  }

  function resolveEnding() {
    const newStats = stats;
    for (const e of ENDINGS) {
      if (e.condition(newStats)) { setEnding(e); return; }
    }
    setEnding(ENDINGS[ENDINGS.length - 1]);
  }

  useEffect(() => {
    if (phase === "ending" && !ending) resolveEnding();
  }, [phase]);

  const bgStyle = {
    minHeight: "100vh",
    background: "#f5f1e8",
    backgroundImage: "radial-gradient(#d4cebf 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    fontFamily: FONT,
    color: "#1a1a1a",
  };

  if (phase === "intro") return (
    <div style={bgStyle}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: "#888", marginBottom: 12 }}>A SIMULATION</div>
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: "bold", lineHeight: 1, letterSpacing: -2, marginBottom: 8 }}>The Editor</div>
          <div style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 16, color: "#555" }}>Five days. Five stories. One newsroom. No easy answers.</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 12 }}>YOUR SITUATION</div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#333", margin: "0 0 12px" }}>
            You are the editor-in-chief of <em>The Alvar Courier</em>, a mid-sized regional daily with a 72-year history. 
            You have 34 staff, a shrinking print run, and a digital presence that's growing but not profitable yet.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#333", margin: "0 0 12px" }}>
            Over the next five days, your investigative desk will surface stories that matter — stories that will attract pressure from corporations, politicians, lawyers, and people you know personally.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#333", margin: 0 }}>
            Each day you make one editorial decision. At the end of five days, you'll see what kind of paper — and what kind of editor — you've chosen to be.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {[["Editorial Integrity", "#1a5c2a", "Your credibility as a truth-teller."],
            ["Revenue", "#854f0b", "Financial health. Below 20 — closure."],
            ["Public Trust", "#185fa5", "How readers perceive you."],
            ["Political Heat", "#a32d2d", "Scrutiny from the powerful. High = risk."]
          ].map(([n, c, d]) => (
            <div key={n} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "12px 14px" }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: c, marginBottom: 4 }}>{n.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPhase("story")}
          style={{ width: "100%", padding: "14px 0", background: "#1a1a1a", color: "#f5f1e8", border: "none", borderRadius: 6, fontFamily: MONO, fontSize: 13, letterSpacing: 2, cursor: "pointer" }}
        >
          TAKE THE CHAIR →
        </button>
      </div>
    </div>
  );

  if (phase === "story") return (
    <div style={bgStyle}>
      {notification && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#f5f1e8", fontFamily: MONO, fontSize: 12, padding: "10px 20px", borderRadius: 6, zIndex: 100, letterSpacing: 1 }}>
          {notification}
        </div>
      )}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20 }}>
          <div>
            <Masthead day={day} />
            <NewsroomSounds />
            <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: "20px 22px", marginBottom: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 8 }}>INVESTIGATIVE DESK — LEAD STORY</div>
              <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: "bold", lineHeight: 1.3, marginBottom: 10 }}>{story.headline}</h2>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, borderLeft: "3px solid #ccc", paddingLeft: 12, marginBottom: 12, fontStyle: "italic" }}>{story.summary}</p>
              <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7 }}>{story.fullText}</p>
            </div>
            <PressureBadge pressure={story.pressure} />
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#555", marginBottom: 10, letterSpacing: 1 }}>YOUR DECISION:</div>
            <ChoiceCard label="OPTION A — PUBLISH" choice={story.integrityChoice} impact={story.integrityImpact} onSelect={() => handleChoice("integrity")} disabled={animating} />
            <ChoiceCard label="OPTION B — SOFTEN" choice={story.censorChoice} impact={story.censorImpact} onSelect={() => handleChoice("censor")} disabled={animating} />
            <ChoiceCard label="OPTION C — SPIKE" choice={story.suppressChoice} impact={story.suppressImpact} onSelect={() => handleChoice("suppress")} disabled={animating} />
          </div>
          <div>
            <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: "16px", position: "sticky", top: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 14 }}>NEWSROOM STATUS</div>
              <StatBar label="Integrity" value={stats.integrity} color="#1a5c2a" />
              <StatBar label="Revenue" value={stats.revenue} color="#854f0b" />
              <StatBar label="Trust" value={stats.trust} color="#185fa5" />
              <StatBar label="Heat" value={stats.heat} color="#a32d2d" />
              {decisions.length > 0 && (
                <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 12 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 8 }}>DECISIONS LOG</div>
                  {decisions.map((d, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "#bbb" }}>DAY {d.day}</div>
                      <div style={{ fontSize: 11, color: "#333", lineHeight: 1.4 }}>{d.headline.slice(0, 40)}...</div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: d.choice === "integrity" ? "#1a5c2a" : d.choice === "censor" ? "#854f0b" : "#a32d2d" }}>{d.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "ending" && ending) {
    const published = decisions.filter(d => d.choice === "integrity").length;
    const softened = decisions.filter(d => d.choice === "censor").length;
    const spiked = decisions.filter(d => d.choice === "suppress").length;
    return (
      <div style={bgStyle}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
          <Masthead day={4} />
          <div style={{ background: ending.bg, border: `2px solid ${ending.color}`, borderRadius: 8, padding: "28px 32px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 40, color: ending.color, marginBottom: 8 }}>{ending.symbol}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: ending.color, letterSpacing: 3, marginBottom: 10 }}>YOUR VERDICT</div>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: "bold", color: ending.color, marginBottom: 16 }}>{ending.title}</div>
            <p style={{ fontFamily: FONT, fontSize: 15, color: "#333", lineHeight: 1.8 }}>{ending.text}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
            {[["Integrity", stats.integrity, "#1a5c2a"], ["Revenue", stats.revenue, "#854f0b"], ["Trust", stats.trust, "#185fa5"], ["Heat", stats.heat, "#a32d2d"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "12px", textAlign: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: "#888", marginBottom: 6 }}>{l.toUpperCase()}</div>
                <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: "bold", color: c }}>{Math.round(v)}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: "#888", marginBottom: 14 }}>EDITORIAL RECORD</div>
            <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: "bold", color: "#1a5c2a" }}>{published}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: "#888" }}>PUBLISHED</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: "bold", color: "#854f0b" }}>{softened}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: "#888" }}>SOFTENED</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: "bold", color: "#a32d2d" }}>{spiked}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: "#888" }}>SPIKED</div>
              </div>
            </div>
            {decisions.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 10, marginBottom: 10, borderBottom: i < decisions.length - 1 ? "1px solid #eee" : "none" }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: "#bbb", minWidth: 40 }}>DAY {d.day}</div>
                <div style={{ flex: 1, fontSize: 13, color: "#333" }}>{d.headline}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: d.choice === "integrity" ? "#1a5c2a" : d.choice === "censor" ? "#854f0b" : "#a32d2d", minWidth: 60, textAlign: "right" }}>{d.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setPhase("intro"); setDay(0); setStats({ integrity: 50, revenue: 60, trust: 50, heat: 20 }); setDecisions([]); setEnding(null); }}
            style={{ width: "100%", padding: "14px 0", background: "#1a1a1a", color: "#f5f1e8", border: "none", borderRadius: 6, fontFamily: MONO, fontSize: 13, letterSpacing: 2, cursor: "pointer" }}
          >
            ← RUN THE PAPER AGAIN
          </button>
        </div>
      </div>
    );
  }

  return <div style={bgStyle}><div style={{ textAlign: "center", padding: 60, fontFamily: MONO, color: "#888" }}>LOADING NEWSROOM...</div></div>;
}
