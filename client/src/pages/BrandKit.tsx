/*
 * DIMI Brand Kit Page — Brand guidelines
 * Uses Fraunces, Geist Mono, DM Sans fonts
 * Green accent (#2EE62E) on dark background (#080806)
 */

import { useEffect, useRef } from "react";

const LOGO_A = "https://d2xsxph8kpxj0f.cloudfront.net/310519663267369814/NRkmTJ8GEcJfdTrHZf8aiP/dimi-logo-variant-a_c16ccb29.png";
const LOGO_B = "https://d2xsxph8kpxj0f.cloudfront.net/310519663267369814/NRkmTJ8GEcJfdTrHZf8aiP/dimi-logo-variant-b_7b72b96d.png";
const LOGO_C = "https://d2xsxph8kpxj0f.cloudfront.net/310519663267369814/NRkmTJ8GEcJfdTrHZf8aiP/dimi-logo-variant-c_7528db6e.png";

function EqBars({ id, count, minH, maxH, barW, className }: { id: string; count: number; minH: number; maxH: number; barW: number; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 0) return;
    Array.from({ length: count }, () => {
      const max = Math.floor(Math.random() * (maxH - minH) + minH);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.7 + 0.6).toFixed(2);
      const dl = (Math.random() * 0.5).toFixed(2);
      const bar = document.createElement("div");
      bar.className = "bk-eq-bar";
      bar.style.cssText = `width:${barW}px;border-radius:1px;background:linear-gradient(to top,#0D7A0D,#2EE62E,#7BFF8F);box-shadow:0 0 4px rgba(46,230,46,0.5);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, [count, minH, maxH, barW]);
  return <div ref={ref} id={id} className={className} />;
}

function EqBarsLarge() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 0) return;
    Array.from({ length: 18 }, () => {
      const max = Math.floor(Math.random() * 36 + 8);
      const min = Math.floor(max * 0.1);
      const dur = (Math.random() * 0.8 + 0.6).toFixed(2);
      const dl = (Math.random() * 0.6).toFixed(2);
      const bar = document.createElement("div");
      bar.className = "bk-eq-large-bar";
      bar.style.cssText = `width:6px;border-radius:2px;background:linear-gradient(to top,var(--bk-green-deep),var(--bk-green),#9FFF9F);box-shadow:0 0 6px rgba(46,230,46,0.4);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, []);
  return <div ref={ref} className="bk-eq-large" />;
}

function CardThumbWaveform() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length > 2) return;
    Array.from({ length: 24 }, () => {
      const max = Math.floor(Math.random() * 48 + 8);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.8 + 0.7).toFixed(2);
      const dl = (Math.random() * 0.5).toFixed(2);
      const bar = document.createElement("div");
      bar.className = "bk-mini-wf-bar";
      bar.style.cssText = `flex:1;border-radius:1px;background:linear-gradient(to top,#0D7A0D,#2EE62E);box-shadow:0 0 4px rgba(46,230,46,0.3);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, []);
  return (
    <div ref={ref} className="bk-card-thumb-mini">
      <span className="bk-badge bk-badge-live" style={{ position: "absolute", top: 6, left: 6, fontSize: "8px", padding: "2px 7px" }}>
        <span className="bk-badge-live-dot" />Live
      </span>
      <span style={{ position: "absolute", top: 6, right: 6, fontFamily: "'Geist Mono',monospace", fontSize: "9px", color: "#3DD6C8", background: "rgba(10,8,5,0.8)", padding: "2px 7px", borderRadius: "4px" }}>◉ 847</span>
    </div>
  );
}

export default function BrandKit() {
  return (
    <div className="bk-page">
      {/* HERO */}
      <div className="bk-hero">
        <div className="bk-hero-glow" />
        <div className="bk-hero-label">Official Brand Guidelines</div>
        <h1 className="bk-hero-h1">DIMI <em>Identity</em></h1>
        <p className="bk-hero-sub">Where Music Gets Made Live — Design System &amp; Brand Standards</p>
      </div>

      <div className="bk-wrap">
        {/* 01. LOGO SYSTEM */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">01</span>
            <h2 className="bk-section-title">Logo System</h2>
            <span className="bk-section-desc">3 approved variants</span>
          </div>

          <div className="bk-logo-grid">
            <div className="bk-logo-cell bk-bg-dark">
              <img src={LOGO_A} className="bk-logo-cell-img" alt="DIMI Logo Variant A" />
              <div className="bk-logo-cell-label">Variant A<br />3D Lockup · Crosshair</div>
              <span className="bk-logo-cell-tag">Primary</span>
            </div>
            <div className="bk-logo-cell bk-bg-surface">
              <img src={LOGO_B} className="bk-logo-cell-img" alt="DIMI Logo Variant B" />
              <div className="bk-logo-cell-label">Variant B<br />3D Lockup · Clean</div>
              <span className="bk-logo-cell-tag">Secondary</span>
            </div>
            <div className="bk-logo-cell bk-bg-dark">
              <img src={LOGO_C} className="bk-logo-cell-img" alt="DIMI Logo Variant C" />
              <div className="bk-logo-cell-label">Variant C<br />Wordmark · Separated</div>
              <span className="bk-logo-cell-tag">Horizontal</span>
            </div>
          </div>

          {/* Logo on backgrounds */}
          <div className="bk-logo-usage-grid">
            <div className="bk-logo-usage-cell" style={{ background: "#080806", border: "1px solid rgba(46,230,46,0.1)" }}>
              <img src={LOGO_C} style={{ width: 110, objectFit: "contain" }} alt="Logo on black" />
              <div className="bk-logo-usage-label" style={{ color: "#5a5e50" }}>On Black ✓</div>
            </div>
            <div className="bk-logo-usage-cell" style={{ background: "#141410", border: "1px solid rgba(46,230,46,0.1)" }}>
              <img src={LOGO_B} style={{ width: 110, objectFit: "contain" }} alt="Logo on dark" />
              <div className="bk-logo-usage-label" style={{ color: "#5a5e50" }}>On Dark ✓</div>
            </div>
            <div className="bk-logo-usage-cell" style={{ background: "#1a2e1a", border: "1px solid rgba(46,230,46,0.15)" }}>
              <img src={LOGO_A} style={{ width: 110, objectFit: "contain" }} alt="Logo on dark green" />
              <div className="bk-logo-usage-label" style={{ color: "#5a5e50" }}>On Green Tint ✓</div>
            </div>
            <div className="bk-logo-usage-cell" style={{ background: "#e8ece8", border: "1px solid #ccc" }}>
              <img src={LOGO_C} style={{ width: 110, objectFit: "contain" }} alt="Logo on light" />
              <div className="bk-logo-usage-label" style={{ color: "#888" }}>On Light ✓</div>
            </div>
          </div>

          {/* Animated wordmark */}
          <div className="bk-animated-lockup-row">
            <div>
              <div className="bk-lockup-label">Digital / Animated Lockup</div>
              <div className="bk-logomark">
                <EqBars id="bkNavEq" count={10} minH={6} maxH={24} barW={3} className="bk-eq" />
                <div className="bk-wordmark bk-crosshair">dimi</div>
              </div>
            </div>
            <div>
              <div className="bk-lockup-label">Clearspace — Minimum</div>
              <div style={{ border: "1px dashed rgba(46,230,46,0.2)", padding: 20, borderRadius: 4, display: "inline-flex" }}>
                <div className="bk-logomark">
                  <EqBars id="bkNavEq2" count={10} minH={6} maxH={24} barW={3} className="bk-eq" />
                  <div className="bk-wordmark">dimi</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: "#3a3d33", marginTop: 8, letterSpacing: "0.06em" }}>Maintain 1× logo height on all sides</div>
            </div>
            <div>
              <div className="bk-lockup-label">Minimum Size</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div>
                  <div className="bk-logomark" style={{ transform: "scale(0.7)", transformOrigin: "left center" }}>
                    <EqBars id="bkNavEq3" count={8} minH={4} maxH={20} barW={2.5} className="bk-eq" />
                    <div className="bk-wordmark">dimi</div>
                  </div>
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: "#3a3d33", marginTop: 8 }}>120px digital</div>
                </div>
                <div>
                  <div className="bk-logomark" style={{ transform: "scale(0.5)", transformOrigin: "left center" }}>
                    <EqBars id="bkNavEq4" count={6} minH={3} maxH={16} barW={2} className="bk-eq" />
                    <div className="bk-wordmark">dimi</div>
                  </div>
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: "#3a3d33", marginTop: 8 }}>32px favicon</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 02. COLOR PALETTE */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">02</span>
            <h2 className="bk-section-title">Color Palette</h2>
            <span className="bk-section-desc">Extracted from logo identity</span>
          </div>
          <div className="bk-color-grid">
            {[
              { name: "DIMI Green", hex: "#2EE62E", role: "Primary Accent", bg: "linear-gradient(135deg,#0D7A0D,#2EE62E)" },
              { name: "Green Mid", hex: "#1DB81D", role: "Active States", bg: "#1DB81D" },
              { name: "Green Deep", hex: "#0D7A0D", role: "Shadows / Depth", bg: "#0D7A0D" },
              { name: "Chrome", hex: "#E8EDE8", role: "Logo Text / UI", bg: "linear-gradient(135deg,#b0b8b0,#E8EDE8,#d0d8d0)" },
              { name: "DIMI Black", hex: "#080806", role: "Background", bg: "#080806" },
              { name: "Iridescent", hex: "Gradient", role: "EQ Icon Shimmer", bg: "linear-gradient(135deg,#4A5FFF 0%,#9B5FFF 35%,#2EE62E 70%,#1DB81D 100%)" },
            ].map((c) => (
              <div key={c.name} className="bk-color-swatch">
                <div className="bk-color-swatch-block" style={{ background: c.bg }} />
                <div className="bk-color-swatch-info">
                  <div className="bk-color-name">{c.name}</div>
                  <div className="bk-color-hex">{c.hex}</div>
                  <div className="bk-color-role">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bk-lockup-label" style={{ marginBottom: 14, marginTop: 24 }}>Secondary UI Palette</div>
          <div className="bk-color-grid">
            {[
              { name: "Live Red", hex: "#FF4D4D", role: "Live Indicators", bg: "#FF4D4D" },
              { name: "Teal", hex: "#3DD6C8", role: "Viewer Count", bg: "#3DD6C8" },
              { name: "Surface", hex: "#141410", role: "Cards / Panels", bg: "#141410" },
              { name: "Card", hex: "#1A1A15", role: "Card BG", bg: "#1a1a15" },
              { name: "Muted", hex: "#5A5E50", role: "Body / Labels", bg: "#5a5e50" },
              { name: "Green Dim", hex: "rgba(46,230,46,0.1)", role: "Tinted BGs", bg: "rgba(46,230,46,0.1)" },
            ].map((c) => (
              <div key={c.name} className="bk-color-swatch">
                <div className="bk-color-swatch-block" style={{ background: c.bg, ...(c.name === "Green Dim" ? { border: "1px solid rgba(46,230,46,0.2)" } : {}) }} />
                <div className="bk-color-swatch-info">
                  <div className="bk-color-name">{c.name}</div>
                  <div className="bk-color-hex">{c.hex}</div>
                  <div className="bk-color-role">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 03. TYPOGRAPHY */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">03</span>
            <h2 className="bk-section-title">Typography</h2>
            <span className="bk-section-desc">3-font system</span>
          </div>
          <div className="bk-type-samples">
            <div className="bk-type-row">
              <div className="bk-type-meta">
                <div className="bk-type-meta-name">Fraunces</div>
                <div className="bk-type-meta-detail">Display &amp; Headlines<br />Weight: 900 / 300 italic<br />Use: Hero text, titles</div>
              </div>
              <div className="bk-type-sample-display">
                <div className="bk-type-display">Where Music Gets Made</div>
                <div className="bk-type-display-italic">Live, Together.</div>
              </div>
            </div>
            <div className="bk-type-row">
              <div className="bk-type-meta">
                <div className="bk-type-meta-name">Fraunces</div>
                <div className="bk-type-meta-detail">Section Headings<br />Weight: 400<br />Use: Section titles, cards</div>
              </div>
              <div className="bk-type-sample-display">
                <div className="bk-type-heading">Live Sessions · Discover Creators</div>
              </div>
            </div>
            <div className="bk-type-row">
              <div className="bk-type-meta">
                <div className="bk-type-meta-name">Geist Mono</div>
                <div className="bk-type-meta-detail">UI / Labels / Data<br />Weight: 300–700<br />Use: Tags, stats, nav, code</div>
              </div>
              <div className="bk-type-sample-display">
                <div className="bk-type-mono">LIVE · 1,247 WATCHING · TRAP / SOUL</div>
                <div className="bk-type-mono-small" style={{ marginTop: 8 }}>Session Started · 2h 14m ago · 3 Collaborators</div>
              </div>
            </div>
            <div className="bk-type-row">
              <div className="bk-type-meta">
                <div className="bk-type-meta-name">DM Sans</div>
                <div className="bk-type-meta-detail">Body Copy<br />Weight: 300–500<br />Use: Descriptions, UI copy</div>
              </div>
              <div className="bk-type-sample-display">
                <div className="bk-type-body">Watch songs being made before anyone else hears them. Discover producers, join sessions, and tip creators in real time.</div>
              </div>
            </div>
          </div>
        </div>

        {/* 04. UI COMPONENTS */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">04</span>
            <h2 className="bk-section-title">UI Components</h2>
            <span className="bk-section-desc">Reusable design elements</span>
          </div>
          <div className="bk-components-grid">
            <div className="bk-comp-cell">
              <div className="bk-comp-cell-title">Buttons</div>
              <div className="bk-btn-showcase">
                <button className="bk-btn-primary">▶ Watch Session</button>
                <button className="bk-btn-secondary">+ Follow</button>
                <button className="bk-btn-ghost">Browse All</button>
              </div>
              <div className="bk-btn-showcase" style={{ marginTop: 10 }}>
                <button className="bk-btn-primary" style={{ fontSize: 10, padding: "8px 16px" }}>💸 Tip Creator</button>
                <button className="bk-btn-secondary" style={{ fontSize: 10, padding: "8px 16px" }}>Get Early Access →</button>
              </div>
            </div>
            <div className="bk-comp-cell">
              <div className="bk-comp-cell-title">Badges &amp; Tags</div>
              <div className="bk-badge-showcase">
                <span className="bk-badge bk-badge-live"><span className="bk-badge-live-dot" />Live</span>
                <span className="bk-badge bk-badge-green">Session Active</span>
                <span className="bk-badge bk-badge-chrome">Phase 1</span>
                <span className="bk-badge bk-badge-genre">Trap / Soul</span>
                <span className="bk-badge bk-badge-genre">Afrobeats</span>
                <span className="bk-badge" style={{ background: "rgba(61,214,200,0.1)", color: "#3DD6C8", border: "1px solid rgba(61,214,200,0.2)" }}>◉ 1,247 Watching</span>
              </div>
            </div>
            <div className="bk-comp-cell">
              <div className="bk-comp-cell-title">Form Inputs</div>
              <div className="bk-input-showcase">
                <div>
                  <div className="bk-input-label">Email Address</div>
                  <input className="bk-input" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <div className="bk-input-label">Search Sessions</div>
                  <input className="bk-input" type="text" placeholder="Search producers, genres..." />
                </div>
              </div>
            </div>
            <div className="bk-comp-cell">
              <div className="bk-comp-cell-title">Session Card</div>
              <div className="bk-card-preview">
                <CardThumbWaveform />
                <div className="bk-card-body-mini">
                  <div className="bk-card-genre-mini">R&amp;B / Soul</div>
                  <div className="bk-card-title-mini">Blue Hours — <em style={{ color: "#2EE62E" }}>Collab</em></div>
                  <div className="bk-card-producer-mini">KayDee · 3 collaborators</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 05. MOTION LANGUAGE */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">05</span>
            <h2 className="bk-section-title">Motion Language</h2>
            <span className="bk-section-desc">Animation patterns</span>
          </div>
          <div className="bk-motion-row">
            <div className="bk-motion-label">EQ Waveform Bars<br /><span style={{ fontSize: 10, color: "#3a3d33" }}>Core brand motion</span></div>
            <div className="bk-motion-demo"><EqBarsLarge /></div>
          </div>
          <div className="bk-motion-row">
            <div className="bk-motion-label">Crosshair Pulse<br /><span style={{ fontSize: 10, color: "#3a3d33" }}>Logo accent / targeting</span></div>
            <div className="bk-motion-demo">
              <div className="bk-crosshair-demo">
                <div className="bk-ch-h" />
                <div className="bk-ch-v" />
                <div className="bk-ch-dot" />
              </div>
            </div>
          </div>
          <div className="bk-motion-row">
            <div className="bk-motion-label">Glow Pulse<br /><span style={{ fontSize: 10, color: "#3a3d33" }}>Live indicators</span></div>
            <div className="bk-motion-demo">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className="bk-glow-demo" />
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, color: "#2EE62E" }}>Session Live</span>
              </div>
            </div>
          </div>
          <div className="bk-motion-row" style={{ border: "none" }}>
            <div className="bk-motion-label">Easing Curve<br /><span style={{ fontSize: 10, color: "#3a3d33" }}>All transitions</span></div>
            <div className="bk-motion-demo">
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, color: "#B8C4B8" }}>
                ease-in-out · 0.2s → hover states<br />
                ease · 0.5–0.8s → page reveals<br />
                ease-in-out · infinite → waveform loops
              </div>
            </div>
          </div>
        </div>

        {/* 06. ICON SYSTEM */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">06</span>
            <h2 className="bk-section-title">Icon System</h2>
            <span className="bk-section-desc">Platform iconography</span>
          </div>
          <div className="bk-icons-grid">
            {[
              { glyph: "▶", name: "Play" }, { glyph: "◉", name: "Live" }, { glyph: "💸", name: "Tip" },
              { glyph: "⬡", name: "Session" }, { glyph: "⌕", name: "Search" }, { glyph: "◈", name: "DIMI Mark" },
              { glyph: "↺", name: "Replay" }, { glyph: "⊠", name: "Close" }, { glyph: "+", name: "Follow" },
              { glyph: "⋯", name: "More" }, { glyph: "↗", name: "Share" }, { glyph: "♪", name: "Audio" },
            ].map((i) => (
              <div key={i.name} className="bk-icon-cell">
                <span className="bk-icon-glyph">{i.glyph}</span>
                <div className="bk-icon-name">{i.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 07. SPACING SCALE */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">07</span>
            <h2 className="bk-section-title">Spacing Scale</h2>
            <span className="bk-section-desc">4px base unit</span>
          </div>
          <div className="bk-spacing-wrap">
            {[
              { token: "--space-1", val: "4px", w: 4 },
              { token: "--space-2", val: "8px", w: 8 },
              { token: "--space-3", val: "12px", w: 12 },
              { token: "--space-4", val: "16px", w: 16 },
              { token: "--space-6", val: "24px", w: 24 },
              { token: "--space-8", val: "32px", w: 32 },
              { token: "--space-12", val: "48px", w: 48 },
              { token: "--space-16", val: "64px", w: 64 },
            ].map((s) => (
              <div key={s.token} className="bk-spacing-row">
                <div className="bk-spacing-token">{s.token}</div>
                <div className="bk-spacing-bar-wrap"><div className="bk-spacing-bar" style={{ width: s.w }} /></div>
                <div className="bk-spacing-val">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 08. BRAND RULES */}
        <div className="bk-section">
          <div className="bk-section-header">
            <span className="bk-section-num">08</span>
            <h2 className="bk-section-title">Brand Rules</h2>
            <span className="bk-section-desc">Do's and don'ts</span>
          </div>
          <div className="bk-usage-grid">
            <div className="bk-usage-card bk-do">
              <div className="bk-usage-card-header">✓ Do</div>
              <div className="bk-usage-card-body">
                {[
                  "Use the logo on dark or near-black backgrounds",
                  "Use DIMI Green (#2EE62E) as the primary accent color",
                  "Keep the EQ waveform icon paired with the wordmark",
                  "Use Fraunces for all display and headline text",
                  "Maintain the crosshair accent as a brand signature",
                  "Write brand name as \"DIMI\" in all caps in body copy",
                ].map((t) => (
                  <div key={t} className="bk-usage-item">
                    <span className="bk-usage-item-icon" style={{ color: "#2EE62E" }}>✓</span> {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="bk-usage-card bk-dont">
              <div className="bk-usage-card-header">✗ Don't</div>
              <div className="bk-usage-card-body">
                {[
                  "Don't place logo on busy photographic backgrounds",
                  "Don't use purple gradients — that's the competitor aesthetic",
                  "Don't stretch, rotate, or distort the logo",
                  "Don't use Inter, Roboto, or Arial anywhere in DIMI UI",
                  "Don't refer to DIMI as a \"DAW\" or \"social media app\"",
                  "Don't use the green on white — insufficient contrast",
                ].map((t) => (
                  <div key={t} className="bk-usage-item">
                    <span className="bk-usage-item-icon" style={{ color: "#FF4D4D" }}>✗</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bk-brand-footer">
          <div className="bk-brand-footer-logo">
            <EqBars id="bkFooterEq" count={8} minH={4} maxH={18} barW={2.5} className="bk-footer-eq" />
            <span className="bk-brand-footer-name">dimi</span>
          </div>
          <div className="bk-brand-footer-tagline">Where Music Gets Made Live</div>
          <div className="bk-brand-footer-right">
            DIMI Brand Kit v1.0<br />
            © 2026 DIMI. All rights reserved.<br />
            <span style={{ color: "#2EE62E" }}>Internal Use Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
