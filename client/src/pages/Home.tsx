/*
 * DIMI Landing Page — exact reproduction of user-provided HTML
 * Dark theme, waveform animations, session preview, pillars, DAW integration,
 * how-it-works, positioning, CTA, footer
 * NO design changes from the original.
 */

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleEmailSubmit = () => {
    const input = emailInputRef.current;
    const btn = emailBtnRef.current;
    if (!input || !btn) return;

    if (input.value.includes("@")) {
      setEmailSubmitted(true);
      input.value = "";
      input.disabled = true;
      btn.disabled = true;
    } else {
      input.style.border = "1px solid var(--accent2)";
      input.placeholder = "Enter a valid email";
      setTimeout(() => {
        input.style.border = "";
        input.placeholder = "your@email.com";
      }, 2000);
    }
  };

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="logo">
          DIMI<span>.</span>
        </div>
        <ul>
          <li>
            <a href="#pillars">Platform</a>
          </li>
          <li>
            <a href="#daw">Integration</a>
          </li>
          <li>
            <a href="#how">How It Works</a>
          </li>
          <li>
            <a href="#cta" className="nav-cta">
              Get Early Access
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>

        <div className="hero-eyebrow">Music Creation Infrastructure</div>

        <h1>
          Where music
          <br />
          gets made <em>live,</em>
          <br />
          together.
        </h1>

        <p className="hero-sub">
          Not another DAW. Not a social app. DIMI is the collaboration and
          streaming layer that plugs into the tools producers already trust.
        </p>

        <div className="hero-actions">
          <a href="#cta" className="btn-primary">
            Request Access
          </a>
          <a href="#how" className="btn-ghost">
            See How It Works
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="stat-num">3</div>
            <div className="stat-label">DAW Integrations</div>
          </div>
          <div>
            <div className="stat-num">Real-time</div>
            <div className="stat-label">Session Sync</div>
          </div>
          <div>
            <div className="stat-num">On-chain</div>
            <div className="stat-label">Ownership Proofs</div>
          </div>
          <div>
            <div className="stat-num">1-click</div>
            <div className="stat-label">Session Start</div>
          </div>
        </div>

        {/* Waveform decoration */}
        <div className="waveform-bar-container">
          {[
            { h: "40px", dur: "0.9s", delay: "0s" },
            { h: "80px", dur: "1.1s", delay: "0.1s" },
            { h: "55px", dur: "0.8s", delay: "0.2s" },
            { h: "120px", dur: "1.3s", delay: "0.15s" },
            { h: "70px", dur: "1.0s", delay: "0.05s" },
            { h: "90px", dur: "1.2s", delay: "0.3s" },
            { h: "45px", dur: "0.85s", delay: "0.25s" },
            { h: "100px", dur: "1.15s", delay: "0.1s" },
            { h: "60px", dur: "0.95s", delay: "0.35s" },
            { h: "75px", dur: "1.05s", delay: "0.2s" },
            { h: "110px", dur: "1.25s", delay: "0.05s" },
            { h: "50px", dur: "0.88s", delay: "0.4s" },
            { h: "85px", dur: "1.1s", delay: "0.15s" },
            { h: "35px", dur: "0.78s", delay: "0.28s" },
            { h: "95px", dur: "1.18s", delay: "0s" },
          ].map((bar, i) => (
            <div
              key={i}
              className="wf-bar"
              style={
                {
                  "--h": bar.h,
                  "--dur": bar.dur,
                  "--delay": bar.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </section>

      {/* SESSION PREVIEW */}
      <div className="session-preview reveal">
        <div className="session-header">
          <div className="session-title-bar">
            <div className="session-dot"></div>
            <span>Session: "Midnite Bounce v3" — FL Studio</span>
            <span className="live-badge">LIVE</span>
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            2:34:17
          </div>
        </div>

        <div className="session-body">
          <div className="track-list">
            <div className="track-item active">
              <div
                className="track-color"
                style={{ background: "#E8FF47" }}
              ></div>
              <span>Drums</span>
            </div>
            <div className="track-item">
              <div
                className="track-color"
                style={{ background: "#47D4FF" }}
              ></div>
              <span>Bass</span>
            </div>
            <div className="track-item">
              <div
                className="track-color"
                style={{ background: "#FF4D6D" }}
              ></div>
              <span>Keys</span>
            </div>
            <div className="track-item">
              <div
                className="track-color"
                style={{ background: "#A47DFF" }}
              ></div>
              <span>Melody</span>
            </div>
            <div className="track-item">
              <div
                className="track-color"
                style={{ background: "#FF9F47" }}
              ></div>
              <span>Vocals</span>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-row">
              <div className="timeline-label">Drums</div>
              <div className="timeline-track">
                <div
                  className="timeline-block"
                  style={{
                    left: "0%",
                    width: "30%",
                    background: "#E8FF47",
                  }}
                >
                  Kick Pattern
                </div>
                <div
                  className="timeline-block"
                  style={{
                    left: "32%",
                    width: "22%",
                    background: "rgba(232,255,71,0.6)",
                  }}
                >
                  Fill
                </div>
                <div
                  className="timeline-block"
                  style={{
                    left: "56%",
                    width: "40%",
                    background: "#E8FF47",
                  }}
                >
                  Loop A
                </div>
              </div>
            </div>
            <div className="timeline-row">
              <div className="timeline-label">Bass</div>
              <div className="timeline-track">
                <div
                  className="timeline-block"
                  style={{
                    left: "0%",
                    width: "50%",
                    background: "#47D4FF",
                  }}
                >
                  Bass Line
                </div>
                <div
                  className="timeline-block"
                  style={{
                    left: "52%",
                    width: "44%",
                    background: "rgba(71,212,255,0.6)",
                  }}
                >
                  Variation
                </div>
              </div>
            </div>
            <div className="timeline-row">
              <div className="timeline-label">Keys</div>
              <div className="timeline-track">
                <div
                  className="timeline-block"
                  style={{
                    left: "18%",
                    width: "38%",
                    background: "#FF4D6D",
                  }}
                >
                  Chord Stabs
                </div>
                <div
                  className="timeline-block"
                  style={{
                    left: "60%",
                    width: "30%",
                    background: "rgba(255,77,109,0.6)",
                  }}
                >
                  Bridge
                </div>
              </div>
            </div>
            <div className="timeline-row">
              <div className="timeline-label">Melody</div>
              <div className="timeline-track">
                <div
                  className="timeline-block"
                  style={{
                    left: "5%",
                    width: "25%",
                    background: "#A47DFF",
                  }}
                >
                  Intro Hook
                </div>
                <div
                  className="timeline-block"
                  style={{
                    left: "34%",
                    width: "55%",
                    background: "rgba(164,125,255,0.7)",
                  }}
                >
                  Main Melody
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="session-footer">
          <div className="avatar-stack">
            <div className="avatar" style={{ background: "#E8FF47" }}>
              PG
            </div>
            <div className="avatar" style={{ background: "#47D4FF" }}>
              MK
            </div>
            <div className="avatar" style={{ background: "#FF4D6D" }}>
              SL
            </div>
          </div>
          <div className="session-meta">3 collaborators · Host: PapiGwap</div>
          <div className="viewers">247 watching</div>
        </div>
      </div>

      {/* PILLARS */}
      <section className="pillars" id="pillars">
        <div className="pillars-header reveal">
          <div className="section-label">Platform</div>
          <h2 className="section-h2">
            Five pillars.
            <br />
            One infrastructure.
          </h2>
          <p className="section-sub">
            Everything needed to create, collaborate, stream, and own music —
            without leaving your workflow.
          </p>
        </div>

        <div className="pillars-grid reveal">
          <div className="pillar-card">
            <span className="pillar-icon">⬡</span>
            <div className="pillar-num">01</div>
            <div className="pillar-title">Collab Rooms</div>
            <p className="pillar-desc">
              Real-time sessions with role-based access. Hosts, collaborators,
              and spectators. Live playback sync, chat, and session recording
              baked in.
            </p>
            <span className="pillar-tag">Core Engine</span>
          </div>
          <div className="pillar-card">
            <span className="pillar-icon">⬡</span>
            <div className="pillar-num">02</div>
            <div className="pillar-title">DAW Integration</div>
            <p className="pillar-desc">
              VST/AU/AAX plugins for FL Studio, Ableton, and Pro Tools. One
              "Start Session" button syncs audio, metadata, and stems directly
              to DIMI.
            </p>
            <span className="pillar-tag">Your Moat</span>
          </div>
          <div className="pillar-card">
            <span className="pillar-icon">⬡</span>
            <div className="pillar-num">03</div>
            <div className="pillar-title">Creation Streaming</div>
            <p className="pillar-desc">
              Stream the process, not just the product. Fans watch songs being
              built live, tip creators mid-session, and save memorable moments as
              clips.
            </p>
            <span className="pillar-tag">Differentiator</span>
          </div>
          <div className="pillar-card">
            <span className="pillar-icon">⬡</span>
            <div className="pillar-num">04</div>
            <div className="pillar-title">Ownership Layer</div>
            <p className="pillar-desc">
              Hash audio and session contribution data. Store on IPFS/Arweave.
              Optional Solana NFT minting for proof of ownership and
              contribution records.
            </p>
            <span className="pillar-tag">Web3 Optional</span>
          </div>
          <div className="pillar-card">
            <span className="pillar-icon">⬡</span>
            <div className="pillar-num">05</div>
            <div className="pillar-title">Distribution Pipeline</div>
            <p className="pillar-desc">
              After a session ends, publish to DIMI feed or streaming platforms.
              Auto-generate credits, splits, and metadata — no manual entry
              needed.
            </p>
            <span className="pillar-tag">Post-Session</span>
          </div>
        </div>
      </section>

      {/* DAW INTEGRATION */}
      <section id="daw">
        <div className="daw-section">
          <div className="reveal">
            <div className="section-label">DAW Integration</div>
            <h2 className="section-h2">
              Inside the tools
              <br />
              you already use.
            </h2>
            <p className="section-sub">
              DIMI doesn't replace your DAW — it becomes the collaboration layer
              sitting on top of it. One plugin, any session, zero workflow
              disruption.
            </p>

            <ul className="daw-list">
              <div className="daw-item">
                <span className="daw-name">FL Studio</span>
                <span className="daw-status status-ready">Phase 1</span>
              </div>
              <div className="daw-item">
                <span className="daw-name">Ableton Live</span>
                <span className="daw-status status-soon">Phase 2</span>
              </div>
              <div className="daw-item">
                <span className="daw-name">Avid Pro Tools</span>
                <span className="daw-status status-soon">Phase 2</span>
              </div>
            </ul>
          </div>

          <div className="plugin-mockup reveal">
            <div className="plugin-topbar">
              <div
                className="plugin-topbar-dot"
                style={{ background: "#FF4D6D" }}
              ></div>
              <div
                className="plugin-topbar-dot"
                style={{ background: "#E8FF47" }}
              ></div>
              <div
                className="plugin-topbar-dot"
                style={{ background: "#47D4FF" }}
              ></div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginLeft: "8px",
                }}
              >
                DIMI Plugin — FL Studio
              </span>
            </div>
            <div className="plugin-body">
              <div className="plugin-label">Current Session</div>
              <div className="plugin-session-name">Midnite Bounce v3</div>
              <button className="plugin-btn">
                ▶ &nbsp; Start DIMI Session
              </button>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Push Stems
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Sync Audio
                </button>
              </div>
              <div className="plugin-info-row">
                <span>BPM</span>
                <span className="plugin-info-val">142</span>
              </div>
              <div className="plugin-info-row">
                <span>Collaborators</span>
                <span className="plugin-info-val">3 connected</span>
              </div>
              <div className="plugin-info-row">
                <span>Spectators</span>
                <span
                  className="plugin-info-val"
                  style={{ color: "var(--accent3)" }}
                >
                  247 watching
                </span>
              </div>
              <div className="plugin-info-row">
                <span>Session Length</span>
                <span className="plugin-info-val">2:34:17</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="reveal">
          <div className="section-label">How It Works</div>
          <h2 className="section-h2">
            From DAW to drop
            <br />
            in four steps.
          </h2>
          <p className="section-sub">
            Zero setup. Zero friction. DIMI sits inside your existing workflow
            and handles the rest.
          </p>
        </div>

        <div className="steps reveal">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-title">Open Your DAW</div>
            <p className="step-desc">
              Load the DIMI plugin in FL Studio, Ableton, or Pro Tools. No new
              software to learn — just your existing session.
            </p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Start a Room</div>
            <p className="step-desc">
              Hit "Start Session." DIMI syncs your audio output and project
              metadata instantly. Invite collaborators or go public for
              spectators.
            </p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">Create Together</div>
            <p className="step-desc">
              Collaborators join with role-based access. Fans watch live.
              Everyone hears the same session in real time via WebRTC.
            </p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-title">Own &amp; Distribute</div>
            <p className="step-desc">
              Session ends → contribution records hashed on-chain.
              Auto-generated credits and splits. Publish directly to DIMI feed
              or streaming platforms.
            </p>
          </div>
        </div>
      </section>

      {/* POSITIONING */}
      <section className="positioning" id="positioning">
        <div className="reveal">
          <div className="section-label">Positioning</div>
          <h2 className="section-h2">
            Not a DAW.
            <br />
            The layer above it.
          </h2>
          <p className="section-sub">
            Every competitor failed by trying to rebuild tools that already work.
            DIMI owns what they ignored.
          </p>
        </div>

        <div className="compare-grid reveal">
          <div className="compare-card good">
            <span className="compare-badge badge-yes">DIMI Wins</span>
            <ul className="compare-list">
              <li data-icon="✓">
                Integrates with existing DAWs — no workflow change
              </li>
              <li data-icon="✓">
                Owns the collaboration layer, not the creation tool
              </li>
              <li data-icon="✓">
                Streams the process, not just the output
              </li>
              <li data-icon="✓">
                Attribution and splits auto-generated on-chain
              </li>
              <li data-icon="✓">
                Works for producers, artists, and fans simultaneously
              </li>
            </ul>
          </div>
          <div className="compare-card bad">
            <span className="compare-badge badge-no">Competitors Fail</span>
            <ul className="compare-list">
              <li data-icon="✗">
                Try to rebuild DAWs nobody wants to switch from
              </li>
              <li data-icon="✗">
                Ignore real production workflows entirely
              </li>
              <li data-icon="✗">Separate creation from distribution</li>
              <li data-icon="✗">
                No ownership or attribution infrastructure
              </li>
              <li data-icon="✗">
                Fans have no way to participate in the process
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-eyebrow">Early Access · Limited Spots</div>
        <h2 className="cta-h2">
          Build music.
          <br />
          <span>Live. Together.</span>
        </h2>
        <p className="cta-sub">
          Join the waitlist and be first to get DIMI when the FL Studio plugin
          drops.
        </p>

        <div className="email-row">
          <input
            ref={emailInputRef}
            type="email"
            placeholder="your@email.com"
          />
          <button ref={emailBtnRef} onClick={handleEmailSubmit}>
            {emailSubmitted ? "✓ You're in" : "Get Access →"}
          </button>
        </div>

        <p
          style={{
            marginTop: "16px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "var(--muted)",
          }}
        >
          No spam. We ship, then we notify.
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">DIMI</div>
        <ul className="footer-links">
          <li>
            <a href="#">Platform</a>
          </li>
          <li>
            <a href="#">Developers</a>
          </li>
          <li>
            <a href="#">Discord</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
        </ul>
        <div className="footer-copy">© 2026 DIMI. All rights reserved.</div>
      </footer>
    </>
  );
}
