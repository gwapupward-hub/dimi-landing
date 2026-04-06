/*
 * DIMI Browse Rooms — /rooms
 * Lists all active and upcoming sessions from the database.
 * Session cards match the exact design from /discover (waveform animation,
 * live badge, viewer count, tip button on hover).
 * Filter row: All · Live Now · Upcoming · Following
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type FilterTab = "all" | "live" | "upcoming" | "following";

export default function Rooms() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const { data: sessions, isLoading } = trpc.dimi.sessions.list.useQuery();
  const { data: creators } = trpc.dimi.creators.list.useQuery();
  const { isAuthenticated } = useAuth();
  const [nowPlaying, setNowPlaying] = useState<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sessions]);

  // Build a producer name map from creators
  const creatorMap = new Map<number, string>();
  if (creators) {
    creators.forEach((c) => {
      creatorMap.set(c.id, c.name);
    });
  }

  const allSessions = sessions ?? [];

  const filtered = (() => {
    switch (activeFilter) {
      case "live":
        return allSessions.filter((s) => s.isLive === 1);
      case "upcoming":
        return allSessions.filter((s) => s.isLive === 0);
      case "following":
        // Placeholder — would filter by followed creators when social features exist
        return isAuthenticated ? allSessions.slice(0, 3) : [];
      default:
        return allSessions;
    }
  })();

  const FILTERS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "live", label: "Live Now" },
    { key: "upcoming", label: "Upcoming" },
    { key: "following", label: "Following" },
  ];

  return (
    <div className="rooms-page">
      {/* HERO */}
      <section className="rooms-hero">
        <div className="rooms-hero-glow" />
        <div className="rooms-hero-label">Browse Rooms</div>
        <h1 className="rooms-hero-h1">
          Find your next<br />
          <em>session.</em>
        </h1>
        <p className="rooms-hero-sub">
          Join active rooms, watch upcoming sessions, and collaborate with
          producers in real time.
        </p>
      </section>

      {/* FILTER ROW */}
      <div className="rooms-filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`rooms-filter-btn ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.key === "live" && <span className="rooms-filter-live-dot" />}
            {f.label}
            {f.key === "live" && (
              <span className="rooms-filter-count">
                {allSessions.filter((s) => s.isLive === 1).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SESSION GRID */}
      <div className="rooms-grid-container">
        {isLoading ? (
          <div className="rooms-loading">
            <div className="rooms-loading-spinner" />
            <span>Loading rooms...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rooms-empty">
            <span className="rooms-empty-icon">⬡</span>
            <h3>
              {activeFilter === "following" && !isAuthenticated
                ? "Log in to see rooms from creators you follow"
                : activeFilter === "following"
                  ? "Follow some creators to see their rooms here"
                  : "No rooms found"}
            </h3>
            <p>
              {activeFilter === "live"
                ? "No sessions are live right now. Check back soon."
                : activeFilter === "upcoming"
                  ? "No upcoming sessions scheduled."
                  : "Try a different filter."}
            </p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filtered.map((s) => (
              <RoomCard
                key={s.id}
                session={s}
                producerName={creatorMap.get(s.producerId) ?? `Producer #${s.producerId}`}
                onPlay={() => setNowPlaying(s)}
              />
            ))}
          </div>
        )}
      </div>

      {/* NOW PLAYING BAR */}
      {nowPlaying && (
        <div className="now-playing-bar">
          <div className="now-playing-eq-container">
            <NowPlayingEQ />
          </div>
          <div className="now-playing-info">
            <span className="now-playing-title">{nowPlaying.title}</span>
            <span className="now-playing-producer">
              {creatorMap.get(nowPlaying.producerId) ?? "Unknown"}
            </span>
          </div>
          <div className="now-playing-meta">
            <span className="now-playing-genre">{nowPlaying.genre}</span>
            <span className="now-playing-bpm">{nowPlaying.bpm} BPM</span>
            {nowPlaying.isLive === 1 && (
              <span className="now-playing-live">
                <span className="np-live-dot" />
                LIVE
              </span>
            )}
          </div>
          <div className="now-playing-viewers">
            ◉ {nowPlaying.viewers?.toLocaleString()}
          </div>
          <button
            className="now-playing-close"
            onClick={() => setNowPlaying(null)}
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        /* ── ROOMS PAGE ── */
        .rooms-page {
          min-height: 100vh;
          background: var(--black);
          padding-top: 60px;
        }

        /* ── HERO ── */
        .rooms-hero {
          position: relative;
          padding: 100px 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
          overflow: hidden;
        }
        .rooms-hero-glow {
          position: absolute;
          top: -60%;
          left: -20%;
          width: 60%;
          height: 200%;
          background: radial-gradient(ellipse at center, rgba(46,230,46,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .rooms-hero-label {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2EE62E;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rooms-hero-label::before {
          content: '';
          width: 32px;
          height: 1px;
          background: #2EE62E;
        }
        .rooms-hero-h1 {
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: clamp(48px, 8vw, 80px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #e8e8e8;
          margin-bottom: 24px;
        }
        .rooms-hero-h1 em {
          font-weight: 300;
          color: #2EE62E;
        }
        .rooms-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          line-height: 1.6;
        }

        /* ── FILTER ROW ── */
        .rooms-filter-row {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 32px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .rooms-filter-btn {
          font-family: 'Geist Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rooms-filter-btn:hover {
          border-color: rgba(46,230,46,0.3);
          color: var(--text);
        }
        .rooms-filter-btn.active {
          border-color: #2EE62E;
          color: #2EE62E;
          background: rgba(46,230,46,0.08);
        }
        .rooms-filter-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF4D4D;
          animation: pulse 2s ease-in-out infinite;
        }
        .rooms-filter-count {
          font-size: 10px;
          background: rgba(255,77,77,0.15);
          color: #FF4D4D;
          padding: 1px 6px;
          border-radius: 8px;
        }

        /* ── GRID ── */
        .rooms-grid-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        /* ── LOADING / EMPTY ── */
        .rooms-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 80px 0;
          color: var(--muted);
          font-family: 'Geist Mono', monospace;
          font-size: 13px;
        }
        .rooms-loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid var(--border);
          border-top-color: #2EE62E;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rooms-empty {
          text-align: center;
          padding: 80px 0;
        }
        .rooms-empty-icon {
          font-size: 48px;
          color: var(--muted);
          display: block;
          margin-bottom: 16px;
        }
        .rooms-empty h3 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          color: var(--text);
          margin-bottom: 8px;
        }
        .rooms-empty p {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--muted);
        }

        /* ── ROOM CARD (reuses sc-* classes from Discover) ── */
        .room-card-tip {
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          background: rgba(46,230,46,0.15);
          color: #2EE62E;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(46,230,46,0.25);
          opacity: 0;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .sc-card:hover .room-card-tip {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .rooms-hero { padding: 80px 20px 40px; }
          .rooms-filter-row { padding: 0 20px 24px; }
          .rooms-grid-container { padding: 0 20px 60px; }
          .rooms-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ── ROOM CARD — exact same design as Discover SessionCard ── */
function RoomCard({
  session,
  producerName,
  onPlay,
}: {
  session: any;
  producerName: string;
  onPlay: () => void;
}) {
  const [, setLocation] = useLocation();
  const wfRef = useRef<HTMLDivElement>(null);
  const color = session.color || "#2EE62E";

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
      bar.style.cssText = `flex:1;border-radius:1px;background:linear-gradient(to top,${color}66,${color});box-shadow:0 0 4px ${color}44;animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, [color]);

  return (
    <div className="sc-card reveal">
      <div className="sc-thumb" ref={wfRef} onClick={onPlay}>
        {session.isLive === 1 && (
          <span className="sc-live-badge">
            <span className="sc-live-dot" />
            LIVE
          </span>
        )}
        <span className="sc-viewer-badge">
          ◉ {(session.viewers ?? 0).toLocaleString()}
        </span>
        <span className="room-card-tip">💸 Tip</span>
      </div>
      <div className="sc-body">
        <div className="sc-genre">{session.genre ?? "Music"}</div>
        <div className="sc-title">{session.title}</div>
        <div className="sc-producer">
          {producerName} · {session.collaborators}{" "}
          collaborator{session.collaborators !== 1 ? "s" : ""}
        </div>
        <button
          onClick={() => setLocation(`/session?room=${session.id}`)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "8px 12px",
            background: "rgba(46,230,46,0.1)",
            border: "1px solid rgba(46,230,46,0.3)",
            borderRadius: "4px",
            color: "#2EE62E",
            fontFamily: "Geist Mono, monospace",
            fontSize: "11px",
            fontWeight: 500,
            cursor: "pointer",
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(46,230,46,0.2)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(46,230,46,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(46,230,46,0.1)";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          ▶ Watch Session
        </button>
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
