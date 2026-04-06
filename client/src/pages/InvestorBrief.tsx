/*
 * DIMI Investor Brief — standalone confidential document
 * No nav bar, print-friendly, all DIMI Green #2EE62E
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function InvestorBrief() {
  const [, setLocation] = useLocation();
  const logoEqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logoEqRef.current;
    if (el) {
      el.innerHTML = Array.from({ length: 9 }, () => {
        const max = Math.floor(Math.random() * 16 + 5);
        const dur = (Math.random() * 0.8 + 0.5).toFixed(2);
        const dl = (Math.random() * 0.5).toFixed(2);
        return `<div class="ib-logo-bar" style="--min:${Math.floor(max * 0.2)}px;--max:${max}px;--dur:${dur}s;--dl:${dl}s;"></div>`;
      }).join("");
    }
  }, []);

  return (
    <>
      <style>{`
/* ── INVESTOR BRIEF STYLES (ib- prefixed) ── */
.ib-page {
  --ib-bg: #080806;
  --ib-surface: #0d0d0b;
  --ib-card: #131311;
  --ib-card2: #1a1a17;
  --ib-border: rgba(46,230,46,0.07);
  --ib-border-bright: rgba(46,230,46,0.18);
  --ib-text: #eceae0;
  --ib-muted: #646258;
  --ib-muted2: #3a3930;
  --ib-green: #2EE62E;
  --ib-green-dim: rgba(46,230,46,0.08);
  --ib-red: #FF4D4D;
  --ib-cream: #eceae0;

  background: var(--ib-bg);
  color: var(--ib-text);
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.ib-page *, .ib-page *::before, .ib-page *::after { box-sizing: border-box; }

.ib-doc {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* ── HEADER ── */
.ib-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--ib-border);
  margin-bottom: 48px;
}

.ib-header-left { display: flex; align-items: center; gap: 12px; }

.ib-logo-eq { display: flex; align-items: center; gap: 2px; height: 22px; }

.ib-logo-bar {
  width: 3px;
  border-radius: 1.5px;
  background: linear-gradient(to top, #0D7A0D, #2EE62E);
  box-shadow: 0 0 4px rgba(46,230,46,0.5);
  animation: ibEq var(--dur, 1s) ease-in-out infinite alternate;
  animation-delay: var(--dl, 0s);
}

@keyframes ibEq {
  from { height: var(--min, 3px); }
  to { height: var(--max, 18px); }
}

.ib-logo-text {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 24px;
  color: var(--ib-cream);
  letter-spacing: -0.02em;
}

.ib-header-right { text-align: right; }

.ib-doc-type {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ib-green);
  margin-bottom: 4px;
}

.ib-doc-date {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--ib-muted);
  letter-spacing: 0.08em;
}

.ib-confidential {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ib-muted2);
  margin-top: 4px;
}

/* ── HERO ── */
.ib-hero {
  text-align: center;
  padding: 48px 0 56px;
}

.ib-hero-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 42px;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--ib-cream);
  max-width: 700px;
  margin: 0 auto 16px;
}

.ib-hero-title em { font-style: italic; color: var(--ib-green); }

.ib-hero-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: var(--ib-muted);
  letter-spacing: 0.08em;
  line-height: 1.8;
  max-width: 560px;
  margin: 0 auto;
}

/* ── SECTIONS ── */
.ib-section { margin-bottom: 48px; }

.ib-section-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ib-green);
  margin-bottom: 8px;
}

.ib-section-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: var(--ib-cream);
  margin-bottom: 24px;
}

.ib-section-divider {
  height: 1px;
  background: var(--ib-border);
  margin: 48px 0;
}

/* ── PROBLEM CARDS ── */
.ib-problem-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.ib-problem-card {
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  padding: 24px;
  transition: border-color 0.2s;
}

.ib-problem-card:hover { border-color: var(--ib-border-bright); }

.ib-problem-icon { font-size: 22px; margin-bottom: 14px; }

.ib-problem-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 16px;
  color: var(--ib-cream);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.ib-problem-text {
  font-size: 13px;
  color: var(--ib-muted);
  line-height: 1.6;
}

/* ── SOLUTION STACK ── */
.ib-stack { display: flex; flex-direction: column; gap: 8px; }

.ib-stack-layer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 8px;
  transition: all 0.2s;
}

.ib-stack-layer:hover { border-color: var(--ib-border-bright); transform: translateX(4px); }

.ib-stack-num {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--ib-green);
  letter-spacing: 0.1em;
  width: 24px;
  flex-shrink: 0;
}

.ib-stack-name {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 15px;
  color: var(--ib-cream);
  width: 180px;
  flex-shrink: 0;
  letter-spacing: -0.01em;
}

.ib-stack-desc {
  font-size: 12px;
  color: var(--ib-muted);
  line-height: 1.5;
  flex: 1;
}

.ib-stack-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 3px;
  background: var(--ib-green-dim);
  color: var(--ib-green);
  border: 1px solid var(--ib-border-bright);
  white-space: nowrap;
}

/* ── MARKET SIZE ── */
.ib-market-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.ib-market-card {
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  padding: 28px 22px;
  text-align: center;
  transition: border-color 0.2s;
}

.ib-market-card:hover { border-color: var(--ib-border-bright); }

.ib-market-num {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--ib-green);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.ib-market-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ib-muted);
  margin-bottom: 4px;
}

.ib-market-source {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  color: var(--ib-muted2);
  letter-spacing: 0.06em;
}

/* ── COMPETITION TABLE ── */
.ib-comp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.ib-comp-table th {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ib-muted);
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ib-border);
}

.ib-comp-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--ib-border);
  color: var(--ib-muted);
}

.ib-comp-table tr:last-child td { border-bottom: none; }

.ib-comp-table tr.ib-highlight td {
  color: var(--ib-cream);
  background: var(--ib-green-dim);
}

.ib-comp-table .ib-check { color: var(--ib-green); font-size: 14px; }
.ib-comp-table .ib-cross { color: var(--ib-muted2); font-size: 14px; }

/* ── BUSINESS MODEL ── */
.ib-biz-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.ib-biz-card {
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  padding: 24px;
  transition: border-color 0.2s;
}

.ib-biz-card:hover { border-color: var(--ib-border-bright); }

.ib-biz-phase {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ib-green);
  margin-bottom: 12px;
}

.ib-biz-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 16px;
  color: var(--ib-cream);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.ib-biz-text {
  font-size: 12px;
  color: var(--ib-muted);
  line-height: 1.6;
}

.ib-biz-tag {
  display: inline-block;
  margin-top: 12px;
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 3px;
  background: var(--ib-green-dim);
  color: var(--ib-green);
  border: 1px solid var(--ib-border-bright);
}

/* ── TRACTION ── */
.ib-traction-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.ib-traction-card {
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  transition: border-color 0.2s;
}

.ib-traction-card:hover { border-color: var(--ib-border-bright); }

.ib-traction-num {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--ib-green);
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.ib-traction-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ib-muted);
}

/* ── THE ASK ── */
.ib-ask-box {
  background: var(--ib-card);
  border: 1px solid var(--ib-border-bright);
  border-radius: 12px;
  padding: 36px;
  text-align: center;
}

.ib-ask-amount {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 48px;
  color: var(--ib-green);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.ib-ask-label {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: var(--ib-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 28px;
}

.ib-ask-use-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  text-align: left;
  margin-top: 20px;
}

.ib-ask-use-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--ib-card2);
  border: 1px solid var(--ib-border);
  border-radius: 8px;
}

.ib-ask-use-pct {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 22px;
  color: var(--ib-green);
  flex-shrink: 0;
  width: 50px;
}

.ib-ask-use-text {
  font-size: 12px;
  color: var(--ib-muted);
  line-height: 1.6;
}

.ib-ask-use-text strong { color: var(--ib-cream); }

/* ── TEAM ── */
.ib-team-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.ib-team-card {
  background: var(--ib-card);
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  padding: 28px;
  text-align: center;
  transition: border-color 0.2s;
}

.ib-team-card:hover { border-color: var(--ib-border-bright); }

.ib-team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2EE62E, #0D7A0D);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Geist Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 auto 14px;
}

.ib-team-name {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 18px;
  color: var(--ib-cream);
  margin-bottom: 4px;
}

.ib-team-role {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ib-green);
  margin-bottom: 12px;
}

.ib-team-bio {
  font-size: 13px;
  color: var(--ib-muted);
  line-height: 1.6;
}

/* ── FOOTER ── */
.ib-doc-footer {
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid var(--ib-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ib-footer-logo {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--ib-cream);
  letter-spacing: -0.02em;
}

.ib-footer-contact {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--ib-muted);
  text-align: right;
  line-height: 1.8;
  letter-spacing: 0.04em;
}

.ib-footer-contact a {
  color: var(--ib-green);
  text-decoration: none;
}

.ib-footer-contact a:hover { text-decoration: underline; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .ib-doc { padding: 32px 20px; }
  .ib-hero-title { font-size: 28px; }
  .ib-problem-grid, .ib-team-grid, .ib-ask-use-grid { grid-template-columns: 1fr; }
  .ib-market-grid, .ib-biz-grid { grid-template-columns: 1fr; }
  .ib-traction-grid { grid-template-columns: 1fr 1fr; }
  .ib-stack-layer { flex-direction: column; align-items: flex-start; gap: 8px; }
  .ib-stack-name { width: auto; }
  .ib-header { flex-direction: column; gap: 16px; text-align: center; }
  .ib-header-right { text-align: center; }
  .ib-comp-table { font-size: 10px; }
  .ib-comp-table th, .ib-comp-table td { padding: 10px 8px; }
}

/* ── PRINT STYLES ── */
@media print {
  .ib-page {
    background: #fff !important;
    color: #111 !important;
  }
  .ib-doc {
    max-width: 100%;
    padding: 20px;
  }
  .ib-logo-bar { animation: none !important; }
  .ib-header, .ib-section, .ib-doc-footer {
    break-inside: avoid;
  }
  .ib-problem-card, .ib-market-card, .ib-biz-card, .ib-traction-card, .ib-team-card, .ib-ask-box, .ib-stack-layer {
    background: #f8f8f6 !important;
    border-color: #ddd !important;
    break-inside: avoid;
  }
  .ib-section-label, .ib-green, .ib-doc-type, .ib-biz-phase, .ib-team-role, .ib-stack-num, .ib-stack-tag, .ib-biz-tag, .ib-ask-use-pct, .ib-market-num, .ib-traction-num, .ib-ask-amount, .ib-proof-chain-badge {
    color: #0a7a0a !important;
  }
  .ib-section-title, .ib-hero-title, .ib-card-title, .ib-problem-title, .ib-biz-title, .ib-team-name, .ib-stack-name, .ib-footer-logo, .ib-logo-text {
    color: #111 !important;
  }
  .ib-hero-title em { color: #0a7a0a !important; }
  .ib-muted, .ib-problem-text, .ib-biz-text, .ib-team-bio, .ib-stack-desc, .ib-hero-sub, .ib-doc-date, .ib-market-label, .ib-traction-label, .ib-ask-label, .ib-ask-use-text, .ib-footer-contact {
    color: #555 !important;
  }
  .ib-comp-table td, .ib-comp-table th { color: #333 !important; }
  .ib-comp-table tr.ib-highlight td { background: #e8f5e8 !important; color: #111 !important; }
  .ib-section-divider { background: #ddd !important; }
  .ib-header { border-bottom-color: #ddd !important; }
  .ib-doc-footer { border-top-color: #ddd !important; }
  .ib-footer-contact a { color: #0a7a0a !important; }
}
      `}</style>

      <div className="ib-page">
        <div className="ib-doc">
          {/* HEADER */}
          <div className="ib-header">
            <div className="ib-header-left">
              <div className="ib-logo-eq" ref={logoEqRef}></div>
              <div className="ib-logo-text">dimi</div>
            </div>
            <div className="ib-header-right">
              <div className="ib-doc-type">Investor Brief</div>
              <div className="ib-doc-date">April 2026</div>
              <div className="ib-confidential">Confidential</div>
            </div>
          </div>

          {/* HERO */}
          <div className="ib-hero">
            <div className="ib-hero-title">
              The operating system for <em>collaborative</em> music creation.
            </div>
            <div className="ib-hero-sub">
              DIMI is the real-time collaboration, streaming, and rights infrastructure layer for music producers. We plug into the tools they already use — and give fans a front-row seat to the creative process.
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* PROBLEM */}
          <div className="ib-section">
            <div className="ib-section-label">Problem</div>
            <div className="ib-section-title">Music creation is broken in four ways.</div>
            <div className="ib-problem-grid">
              <div className="ib-problem-card">
                <div className="ib-problem-icon">🔇</div>
                <div className="ib-problem-title">Invisible Process</div>
                <div className="ib-problem-text">Fans only see the final product. The creative process — the most compelling part — is hidden behind closed studio doors.</div>
              </div>
              <div className="ib-problem-card">
                <div className="ib-problem-icon">📁</div>
                <div className="ib-problem-title">Fragmented Collaboration</div>
                <div className="ib-problem-text">Producers bounce stems over email, WeTransfer, and DMs. No shared workspace. No version control. No real-time sync.</div>
              </div>
              <div className="ib-problem-card">
                <div className="ib-problem-icon">⚖️</div>
                <div className="ib-problem-title">Broken Rights</div>
                <div className="ib-problem-text">Split sheets are handshake deals. Disputes happen after release. No tamper-proof record of who contributed what.</div>
              </div>
              <div className="ib-problem-card">
                <div className="ib-problem-icon">💸</div>
                <div className="ib-problem-title">No Direct Monetization</div>
                <div className="ib-problem-text">Producers can't monetize the creation process itself. Tips, subscriptions, and session access are afterthoughts on existing platforms.</div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* SOLUTION */}
          <div className="ib-section">
            <div className="ib-section-label">Solution</div>
            <div className="ib-section-title">Five layers. One platform.</div>
            <div className="ib-stack">
              <div className="ib-stack-layer">
                <div className="ib-stack-num">01</div>
                <div className="ib-stack-name">DAW Plugin</div>
                <div className="ib-stack-desc">Lightweight VST/AU that streams audio + timeline state from FL Studio, Ableton, Logic, Pro Tools. Zero latency impact.</div>
                <div className="ib-stack-tag">Shipped</div>
              </div>
              <div className="ib-stack-layer">
                <div className="ib-stack-num">02</div>
                <div className="ib-stack-name">Collab Rooms</div>
                <div className="ib-stack-desc">Real-time shared workspace with WebRTC audio, stem isolation, and synchronized playback across contributors.</div>
                <div className="ib-stack-tag">Beta</div>
              </div>
              <div className="ib-stack-layer">
                <div className="ib-stack-num">03</div>
                <div className="ib-stack-name">Live Sessions</div>
                <div className="ib-stack-desc">Public-facing streams where fans watch production happen live. Chat, tip, and interact with creators in real time.</div>
                <div className="ib-stack-tag">Beta</div>
              </div>
              <div className="ib-stack-layer">
                <div className="ib-stack-num">04</div>
                <div className="ib-stack-name">Rights Workspace</div>
                <div className="ib-stack-desc">On-chain split contracts, proof vault, and automated distribution. Solana-backed tamper-proof ownership records.</div>
                <div className="ib-stack-tag">Alpha</div>
              </div>
              <div className="ib-stack-layer">
                <div className="ib-stack-num">05</div>
                <div className="ib-stack-name">Discovery Feed</div>
                <div className="ib-stack-desc">Algorithmic and genre-based session discovery. Fans find new producers through the creative process, not just finished tracks.</div>
                <div className="ib-stack-tag">Shipped</div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* MARKET SIZE */}
          <div className="ib-section">
            <div className="ib-section-label">Market</div>
            <div className="ib-section-title">Where we play.</div>
            <div className="ib-market-grid">
              <div className="ib-market-card">
                <div className="ib-market-num">$4.2B</div>
                <div className="ib-market-label">Music Production Software</div>
                <div className="ib-market-source">Grand View Research, 2025</div>
              </div>
              <div className="ib-market-card">
                <div className="ib-market-num">$8.9B</div>
                <div className="ib-market-label">Creator Economy (Music)</div>
                <div className="ib-market-source">Goldman Sachs, 2025</div>
              </div>
              <div className="ib-market-card">
                <div className="ib-market-num">$1.7B</div>
                <div className="ib-market-label">Live Streaming Tips & Subs</div>
                <div className="ib-market-source">Streamlabs, 2025</div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* COMPETITION */}
          <div className="ib-section">
            <div className="ib-section-label">Competition</div>
            <div className="ib-section-title">Nobody does all four.</div>
            <table className="ib-comp-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Live Streaming</th>
                  <th>Collab</th>
                  <th>Rights</th>
                  <th>DAW Plugin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="ib-highlight">
                  <td><strong>DIMI</strong></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-check">✓</span></td>
                </tr>
                <tr>
                  <td>Splice</td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-cross">✗</span></td>
                </tr>
                <tr>
                  <td>BandLab</td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-cross">✗</span></td>
                </tr>
                <tr>
                  <td>Twitch / Kick</td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-cross">✗</span></td>
                </tr>
                <tr>
                  <td>Stems.io</td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-cross">✗</span></td>
                  <td><span className="ib-check">✓</span></td>
                  <td><span className="ib-cross">✗</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ib-section-divider"></div>

          {/* BUSINESS MODEL */}
          <div className="ib-section">
            <div className="ib-section-label">Business Model</div>
            <div className="ib-section-title">Three revenue phases.</div>
            <div className="ib-biz-grid">
              <div className="ib-biz-card">
                <div className="ib-biz-phase">Phase 1 · Now</div>
                <div className="ib-biz-title">Creator Subscriptions</div>
                <div className="ib-biz-text">Pro tier unlocks unlimited rooms, priority streaming slots, advanced analytics, and early access to rights tools.</div>
                <div className="ib-biz-tag">$12/mo</div>
              </div>
              <div className="ib-biz-card">
                <div className="ib-biz-phase">Phase 2 · Q3 2026</div>
                <div className="ib-biz-title">Platform Fees</div>
                <div className="ib-biz-text">5% on tips, session access fees, and fan subscriptions. Revenue scales with creator monetization success.</div>
                <div className="ib-biz-tag">5% Take Rate</div>
              </div>
              <div className="ib-biz-card">
                <div className="ib-biz-phase">Phase 3 · 2027</div>
                <div className="ib-biz-title">Distribution Rails</div>
                <div className="ib-biz-text">Automated distribution to Spotify, Apple, TikTok directly from the rights workspace. Per-release fee + revenue share.</div>
                <div className="ib-biz-tag">$9.99 + 8%</div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* TRACTION */}
          <div className="ib-section">
            <div className="ib-section-label">Traction</div>
            <div className="ib-section-title">Early signals.</div>
            <div className="ib-traction-grid">
              <div className="ib-traction-card">
                <div className="ib-traction-num">847</div>
                <div className="ib-traction-label">Waitlist Signups</div>
              </div>
              <div className="ib-traction-card">
                <div className="ib-traction-num">3</div>
                <div className="ib-traction-label">DAW Partnerships (LOI)</div>
              </div>
              <div className="ib-traction-card">
                <div className="ib-traction-num">12</div>
                <div className="ib-traction-label">Beta Producers</div>
              </div>
              <div className="ib-traction-card">
                <div className="ib-traction-num">2.1k</div>
                <div className="ib-traction-label">Peak Live Viewers</div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* THE ASK */}
          <div className="ib-section">
            <div className="ib-section-label">The Ask</div>
            <div className="ib-section-title">Pre-seed round.</div>
            <div className="ib-ask-box">
              <div className="ib-ask-amount">$750K</div>
              <div className="ib-ask-label">Pre-Seed · SAFE · $6M Cap</div>
              <div className="ib-ask-use-grid">
                <div className="ib-ask-use-item">
                  <div className="ib-ask-use-pct">40%</div>
                  <div className="ib-ask-use-text"><strong>Product &amp; Engineering</strong><br />DAW plugin, collab rooms, rights workspace</div>
                </div>
                <div className="ib-ask-use-item">
                  <div className="ib-ask-use-pct">25%</div>
                  <div className="ib-ask-use-text"><strong>Creator Acquisition</strong><br />Onboard 100 active producers in 6 months</div>
                </div>
                <div className="ib-ask-use-item">
                  <div className="ib-ask-use-pct">20%</div>
                  <div className="ib-ask-use-text"><strong>Distribution Partnerships</strong><br />Integrate with 2+ distribution rail partners</div>
                </div>
                <div className="ib-ask-use-item">
                  <div className="ib-ask-use-pct">15%</div>
                  <div className="ib-ask-use-text"><strong>Operations &amp; Legal</strong><br />Rights compliance, KYC/AML, payout rails</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ib-section-divider"></div>

          {/* TEAM */}
          <div className="ib-section">
            <div className="ib-section-label">Team</div>
            <div className="ib-section-title">Built by creators, for creators.</div>
            <div className="ib-team-grid">
              <div className="ib-team-card">
                <div className="ib-team-avatar">PG</div>
                <div className="ib-team-name">PapiGwap</div>
                <div className="ib-team-role">Founder &amp; CEO</div>
                <div className="ib-team-bio">Music producer and platform architect. Deep roots in trap and R&amp;B production. Building DIMI from the inside out.</div>
              </div>
              <div className="ib-team-card">
                <div className="ib-team-avatar" style={{ background: "linear-gradient(135deg,#3DD6C8,#1a8a82)" }}>TH</div>
                <div className="ib-team-name">Tech Lead</div>
                <div className="ib-team-role">CTO · Hiring</div>
                <div className="ib-team-bio">WebRTC, Solana, ICP canisters. Looking for a co-founder with real-time audio and distributed systems experience.</div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="ib-doc-footer">
            <div className="ib-footer-logo">dimi</div>
            <div className="ib-footer-contact">
              hello@dimi.app · <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/"); }}>dimi.app</a><br />
              <span style={{ color: "var(--ib-muted2)" }}>© 2026 DIMI · Confidential</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
