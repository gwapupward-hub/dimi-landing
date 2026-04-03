/*
 * DIMI Discovery Page — Fan session discovery feed
 * Dark theme with green accent, session cards, creator scroll,
 * sidebar filters, now-playing bar
 */

import { useEffect, useRef, useState } from "react";

/* ── DATA ── */
const GENRES = ["All", "Trap", "R&B / Soul", "Afrobeats", "Lo-Fi", "Drill", "Boom Bap", "House"];

const SESSIONS = [
  { id: 1, title: "Midnite Bounce v3", producer: "PapiGwap", genre: "Trap / Soul", viewers: 1247, collaborators: 3, bpm: 142, live: true, color: "#2EE62E" },
  { id: 2, title: "Blue Hours", producer: "KayDee", genre: "R&B / Soul", viewers: 847, collaborators: 2, bpm: 95, live: true, color: "#47D4FF" },
  { id: 3, title: "Lagos Nights", producer: "Ayo Beats", genre: "Afrobeats", viewers: 623, collaborators: 4, bpm: 110, live: true, color: "#FF9F47" },
  { id: 4, title: "Concrete Dreams", producer: "Vex", genre: "Drill", viewers: 412, collaborators: 1, bpm: 140, live: true, color: "#FF4D6D" },
  { id: 5, title: "Sunset Tape", producer: "mellowmind", genre: "Lo-Fi", viewers: 389, collaborators: 2, bpm: 80, live: true, color: "#A47DFF" },
  { id: 6, title: "808 Cathedral", producer: "DRMTK", genre: "Trap", viewers: 298, collaborators: 3, bpm: 150, live: false, color: "#2EE62E" },
  { id: 7, title: "Phantom Keys", producer: "Noire", genre: "R&B / Soul", viewers: 276, collaborators: 1, bpm: 88, live: false, color: "#3DD6C8" },
  { id: 8, title: "Dust & Gold", producer: "SampleKid", genre: "Boom Bap", viewers: 198, collaborators: 2, bpm: 92, live: false, color: "#2EE62E" },
  { id: 9, title: "Neon Drift", producer: "Zephyr", genre: "House", viewers: 167, collaborators: 1, bpm: 124, live: false, color: "#FF4D6D" },
];

const CREATORS = [
  { name: "PapiGwap", genre: "Trap / Soul", followers: "12.4K", live: true },
  { name: "KayDee", genre: "R&B", followers: "8.7K", live: true },
  { name: "Ayo Beats", genre: "Afrobeats", followers: "6.2K", live: true },
  { name: "Vex", genre: "Drill", followers: "5.1K", live: true },
  { name: "mellowmind", genre: "Lo-Fi", followers: "4.8K", live: false },
  { name: "DRMTK", genre: "Trap", followers: "3.9K", live: false },
  { name: "Noire", genre: "R&B", followers: "3.2K", live: false },
  { name: "SampleKid", genre: "Boom Bap", followers: "2.8K", live: false },
];

/* ── COMPONENT ── */
export default function Discover() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [nowPlaying, setNowPlaying] = useState<typeof SESSIONS[0] | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeGenre === "All"
    ? SESSIONS
    : SESSIONS.filter((s) => s.genre.toLowerCase().includes(activeGenre.toLowerCase()));

  return (
    <div className="discover-page">
      {/* HERO BANNER */}
      <section className="discover-hero">
        <div className="discover-hero-glow" />
        <div className="discover-hero-label">Live Sessions</div>
        <h1 className="discover-hero-h1">
          Watch music<br />get made <em>live.</em>
        </h1>
        <p className="discover-hero-sub">
          Discover producers, join sessions, and tip creators in real time.
        </p>
      </section>

      {/* CREATOR SCROLL ROW */}
      <section className="creator-scroll-section">
        <div className="creator-scroll-header">
          <span className="creator-scroll-label">Trending Creators</span>
          <span className="creator-scroll-count">{CREATORS.filter(c => c.live).length} live now</span>
        </div>
        <div className="creator-scroll">
          {CREATORS.map((c) => (
            <div key={c.name} className="creator-card" onClick={() => {
              const s = SESSIONS.find(s => s.producer === c.name);
              if (s) setNowPlaying(s);
            }}>
              <div className="creator-avatar" style={{ background: c.live ? "linear-gradient(135deg, #0D7A0D, #2EE62E)" : "rgba(255,255,255,0.06)" }}>
                {c.name.slice(0, 2).toUpperCase()}
                {c.live && <span className="creator-live-dot" />}
              </div>
              <div className="creator-name">{c.name}</div>
              <div className="creator-genre">{c.genre}</div>
              <div className="creator-followers">{c.followers}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="discover-main">
        {/* SIDEBAR */}
        <aside className="discover-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Genres</div>
            {GENRES.map((g) => (
              <button
                key={g}
                className={`sidebar-genre-btn ${activeGenre === g ? "active" : ""}`}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Stats</div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-num">{SESSIONS.filter(s => s.live).length}</span>
              <span className="sidebar-stat-label">Live Sessions</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-num">{SESSIONS.reduce((a, s) => a + s.viewers, 0).toLocaleString()}</span>
              <span className="sidebar-stat-label">Total Viewers</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-num">{CREATORS.length}</span>
              <span className="sidebar-stat-label">Active Creators</span>
            </div>
          </div>
        </aside>

        {/* SESSION GRID */}
        <div className="session-grid">
          <div className="session-grid-header">
            <span className="session-grid-title">
              {activeGenre === "All" ? "All Sessions" : activeGenre}
            </span>
            <span className="session-grid-count">{filtered.length} sessions</span>
          </div>
          <div className="session-cards">
            {filtered.map((s) => (
              <SessionCard key={s.id} session={s} onPlay={() => setNowPlaying(s)} />
            ))}
          </div>
        </div>
      </div>

      {/* NOW PLAYING BAR */}
      {nowPlaying && (
        <div className="now-playing-bar">
          <div className="now-playing-eq-container">
            <NowPlayingEQ />
          </div>
          <div className="now-playing-info">
            <span className="now-playing-title">{nowPlaying.title}</span>
            <span className="now-playing-producer">{nowPlaying.producer}</span>
          </div>
          <div className="now-playing-meta">
            <span className="now-playing-genre">{nowPlaying.genre}</span>
            <span className="now-playing-bpm">{nowPlaying.bpm} BPM</span>
            {nowPlaying.live && <span className="now-playing-live"><span className="np-live-dot" />LIVE</span>}
          </div>
          <div className="now-playing-viewers">◉ {nowPlaying.viewers.toLocaleString()}</div>
          <button className="now-playing-close" onClick={() => setNowPlaying(null)}>✕</button>
        </div>
      )}
    </div>
  );
}

/* ── SESSION CARD ── */
function SessionCard({ session, onPlay }: { session: typeof SESSIONS[0]; onPlay: () => void }) {
  const wfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wfRef.current;
    if (!el || el.children.length > 2) return;
    Array.from({ length: 20 }, () => {
      const max = Math.floor(Math.random() * 40 + 8);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.8 + 0.7).toFixed(2);
      const dl = (Math.random() * 0.5).toFixed(2);
      const bar = document.createElement("div");
      bar.className = "sc-wf-bar";
      bar.style.cssText = `flex:1;border-radius:1px;background:linear-gradient(to top,${session.color}66,${session.color});box-shadow:0 0 4px ${session.color}44;animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, [session.color]);

  return (
    <div className="sc-card reveal" onClick={onPlay}>
      <div className="sc-thumb" ref={wfRef}>
        {session.live && (
          <span className="sc-live-badge"><span className="sc-live-dot" />LIVE</span>
        )}
        <span className="sc-viewer-badge">◉ {session.viewers.toLocaleString()}</span>
      </div>
      <div className="sc-body">
        <div className="sc-genre">{session.genre}</div>
        <div className="sc-title">{session.title}</div>
        <div className="sc-producer">
          {session.producer} · {session.collaborators} collaborator{session.collaborators > 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

/* ── NOW PLAYING EQ ── */
function NowPlayingEQ() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 0) return;
    Array.from({ length: 12 }, () => {
      const max = Math.floor(Math.random() * 16 + 4);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.6 + 0.5).toFixed(2);
      const dl = (Math.random() * 0.4).toFixed(2);
      const bar = document.createElement("div");
      bar.style.cssText = `width:2px;border-radius:1px;background:linear-gradient(to top,#0D7A0D,#2EE62E);box-shadow:0 0 3px rgba(46,230,46,0.4);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, []);
  return <div ref={ref} className="np-eq" />;
}
