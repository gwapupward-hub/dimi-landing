/*
 * DIMI Rights Workspace — exact reproduction of user-provided HTML
 * 3-column layout, split calculator, lock modal, all interactive JS
 * NO design changes from the original.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function Rights() {
  const [, setLocation] = useLocation();
  const logoEqRef = useRef<HTMLDivElement>(null);
  const lockOverlayRef = useRef<HTMLDivElement>(null);
  const modalHashRef = useRef<HTMLDivElement>(null);
  const splitBarFillRef = useRef<HTMLDivElement>(null);
  const splitTotalValRef = useRef<HTMLDivElement>(null);
  const lockBannerBtnRef = useRef<HTMLButtonElement>(null);
  const lockBtnRef = useRef<HTMLButtonElement>(null);
  const confirmLockRef = useRef<HTMLButtonElement>(null);
  const cancelLockRef = useRef<HTMLButtonElement>(null);
  const recoupToggleRef = useRef<HTMLDivElement>(null);
  const pct0Ref = useRef<HTMLInputElement>(null);
  const pct1Ref = useRef<HTMLInputElement>(null);
  const pct2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Logo EQ bars
    const logoEq = logoEqRef.current;
    if (logoEq) {
      logoEq.innerHTML = Array.from({ length: 8 }, () => {
        const max = Math.floor(Math.random() * 13 + 4);
        const dur = (Math.random() * 0.7 + 0.5).toFixed(2);
        const dl = (Math.random() * 0.4).toFixed(2);
        return `<div class="rw-logo-bar" style="--min:${Math.floor(max * 0.2)}px;--max:${max}px;--dur:${dur}s;--dl:${dl}s;"></div>`;
      }).join("");
    }
  }, []);

  useEffect(() => {
    const inputs = [pct0Ref.current, pct1Ref.current, pct2Ref.current];
    const splitBarFill = splitBarFillRef.current;
    const splitTotalVal = splitTotalValRef.current;

    function updateSplitTotal() {
      const total = inputs.reduce((sum, inp) => sum + (parseFloat(inp?.value || "0") || 0), 0);
      const pct = Math.min(total, 100);
      if (splitBarFill) splitBarFill.style.width = pct + "%";
      if (splitTotalVal) splitTotalVal.textContent = total + "%";

      if (total === 100) {
        splitBarFill?.classList.remove("rw-over");
        if (splitTotalVal) splitTotalVal.className = "rw-split-total-val rw-good";
      } else if (total > 100) {
        splitBarFill?.classList.add("rw-over");
        if (splitTotalVal) splitTotalVal.className = "rw-split-total-val rw-over-text";
      } else {
        splitBarFill?.classList.remove("rw-over");
        if (splitTotalVal) splitTotalVal.className = "rw-split-total-val rw-under";
      }
    }

    inputs.forEach((inp) => inp?.addEventListener("input", updateSplitTotal));
    return () => {
      inputs.forEach((inp) => inp?.removeEventListener("input", updateSplitTotal));
    };
  }, []);

  useEffect(() => {
    const recoupToggle = recoupToggleRef.current;
    const handler = () => recoupToggle?.classList.toggle("rw-on");
    recoupToggle?.addEventListener("click", handler);
    return () => recoupToggle?.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const lockOverlay = lockOverlayRef.current;
    const lockBtn = lockBtnRef.current;
    const confirmLock = confirmLockRef.current;
    const cancelLock = cancelLockRef.current;
    const modalHash = modalHashRef.current;
    const lockBannerBtn = lockBannerBtnRef.current;

    function openLockModal() {
      const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      if (modalHash) modalHash.textContent = hash;
      lockOverlay?.classList.add("rw-visible");
    }

    function closeLockModal() {
      lockOverlay?.classList.remove("rw-visible");
    }

    function handleConfirmLock() {
      if (confirmLock) {
        confirmLock.innerHTML = "⏳ &nbsp;Writing to Solana...";
        confirmLock.disabled = true;
      }
      setTimeout(() => {
        closeLockModal();
        if (confirmLock) {
          confirmLock.innerHTML = "🔒 &nbsp;Lock & Publish";
          confirmLock.disabled = false;
        }
        const statusChip = document.querySelector(".rw-status-chip");
        if (statusChip) {
          statusChip.className = "rw-status-chip rw-locked";
          statusChip.innerHTML = '<div class="rw-status-dot"></div> Locked';
        }
        if (lockBtn) {
          lockBtn.innerHTML = "✓ &nbsp;Release Locked";
          lockBtn.disabled = true;
        }
        const goldTag = document.querySelector(".rw-card-tag.rw-gold");
        if (goldTag) {
          goldTag.className = "rw-card-tag rw-green-tag";
          goldTag.textContent = "Locked";
        }
      }, 2200);
    }

    function handleBackdropClick(e: Event) {
      if (e.target === lockOverlay) closeLockModal();
    }

    lockBtn?.addEventListener("click", openLockModal);
    cancelLock?.addEventListener("click", closeLockModal);
    confirmLock?.addEventListener("click", handleConfirmLock);
    lockOverlay?.addEventListener("click", handleBackdropClick);

    // Nav items
    const navItems = document.querySelectorAll(".rw-nav-item");
    const navHandler = (item: Element) => () => {
      navItems.forEach((i) => i.classList.remove("rw-active"));
      item.classList.add("rw-active");
    };
    const navHandlers: Array<{ el: Element; fn: () => void }> = [];
    navItems.forEach((item) => {
      const fn = navHandler(item);
      item.addEventListener("click", fn);
      navHandlers.push({ el: item, fn });
    });

    // Remind button - Ari signing simulation
    const pendingRow = document.querySelector(".rw-sign-status.rw-pending")?.closest(".rw-split-row");
    const remindBtn = pendingRow?.querySelector(".rw-topbar-btn") as HTMLButtonElement | null;
    const remindHandler = function (this: HTMLButtonElement) {
      const btn = this;
      setTimeout(() => {
        const signStatus = btn.closest(".rw-split-row")?.querySelector(".rw-sign-status");
        if (signStatus) {
          signStatus.className = "rw-sign-status rw-signed";
          signStatus.innerHTML = '<span class="rw-sign-icon">✓</span> Signed';
        }
        btn.remove();
        const goldTag2 = document.querySelector(".rw-card-tag.rw-gold");
        if (goldTag2) {
          goldTag2.className = "rw-card-tag rw-green-tag";
          goldTag2.textContent = "3 of 3 Signed";
        }
        const statusChip2 = document.querySelector(".rw-status-chip");
        if (statusChip2) {
          statusChip2.className = "rw-status-chip rw-locked";
          statusChip2.innerHTML = '<div class="rw-status-dot"></div> All Signed';
        }
        if (lockBannerBtn) {
          lockBannerBtn.disabled = false;
          lockBannerBtn.innerHTML = "🔒 &nbsp;Lock Release";
        }
        const warnItems = document.querySelectorAll(".rw-check-item.rw-warn");
        if (warnItems[0]) {
          warnItems[0].className = "rw-check-item rw-done";
          const cb = warnItems[0].querySelector(".rw-check-box");
          if (cb) {
            cb.className = "rw-check-box rw-done";
            cb.textContent = "✓";
          }
          const cs = warnItems[0].querySelector(".rw-check-sub");
          if (cs) cs.textContent = "3 of 3 signed · All confirmed";
        }
      }, 1500);
    };
    remindBtn?.addEventListener("click", remindHandler);

    return () => {
      lockBtn?.removeEventListener("click", openLockModal);
      cancelLock?.removeEventListener("click", closeLockModal);
      confirmLock?.removeEventListener("click", handleConfirmLock);
      lockOverlay?.removeEventListener("click", handleBackdropClick);
      navHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      remindBtn?.removeEventListener("click", remindHandler);
    };
  }, []);

  return (
    <>
      <style>{`
/* ── RIGHTS WORKSPACE STYLES (rw- prefixed) ── */
.rw-page { background: #080806; color: #eceae0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }

.rw-page *,
.rw-page *::before,
.rw-page *::after { box-sizing: border-box; }

/* CSS Variables */
.rw-page {
  --rw-bg: #080806;
  --rw-surface: #0d0d0b;
  --rw-card: #131311;
  --rw-card2: #1a1a17;
  --rw-border: rgba(46,230,46,0.07);
  --rw-border-bright: rgba(46,230,46,0.2);
  --rw-border-locked: rgba(46,230,46,0.25);
  --rw-text: #eceae0;
  --rw-muted: #646258;
  --rw-muted2: #3a3930;
  --rw-green: #2EE62E;
  --rw-green-dim: rgba(46,230,46,0.08);
  --rw-red: #FF4D4D;
  --rw-red-dim: rgba(255,77,77,0.08);
  --rw-gold: #F5A623;
  --rw-gold-dim: rgba(245,166,35,0.08);
  --rw-cream: #eceae0;
}

/* ── TOPBAR ── */
.rw-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  background: var(--rw-surface);
  border-bottom: 1px solid var(--rw-border);
  position: sticky;
  top: 60px;
  z-index: 90;
}

.rw-topbar-left { display: flex; align-items: center; gap: 14px; }

.rw-logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.rw-logo-eq { display: flex; align-items: center; gap: 2px; height: 18px; }

.rw-logo-bar {
  width: 2.5px;
  border-radius: 1px;
  background: linear-gradient(to top, #0D7A0D, #2EE62E);
  box-shadow: 0 0 4px rgba(46,230,46,0.5);
  animation: rwEq var(--dur, 1s) ease-in-out infinite alternate;
  animation-delay: var(--dl, 0s);
}

@keyframes rwEq {
  from { height: var(--min, 3px); }
  to { height: var(--max, 16px); }
}

.rw-logo-text {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--rw-cream);
  letter-spacing: -0.02em;
}

.rw-topbar-divider {
  width: 1px;
  height: 20px;
  background: var(--rw-border-bright);
}

.rw-breadcrumb {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-muted);
  letter-spacing: 0.04em;
}

.rw-breadcrumb .rw-sep { color: var(--rw-muted2); margin: 0 6px; }
.rw-breadcrumb span:last-child { color: var(--rw-cream); }
.rw-breadcrumb .rw-bc-link { color: var(--rw-muted); cursor: pointer; text-decoration: none; }
.rw-breadcrumb .rw-bc-link:hover { color: var(--rw-green); }

.rw-topbar-right { display: flex; align-items: center; gap: 10px; }

.rw-status-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid var(--rw-border-bright);
  color: var(--rw-muted);
}

.rw-status-chip.rw-pending { border-color: rgba(245,166,35,0.3); color: var(--rw-gold); }
.rw-status-chip.rw-locked { border-color: var(--rw-border-bright); color: var(--rw-green); }

.rw-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: rwPulse 2s ease-in-out infinite;
}

@keyframes rwPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.rw-topbar-btn {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  padding: 7px 16px;
  border-radius: 5px;
  border: 1px solid var(--rw-border-bright);
  background: none;
  color: var(--rw-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.rw-topbar-btn:hover { color: var(--rw-cream); border-color: var(--rw-cream); }

.rw-topbar-btn.rw-primary {
  background: var(--rw-green);
  color: #000;
  border-color: var(--rw-green);
  font-weight: 500;
}

.rw-topbar-btn.rw-primary:hover { box-shadow: 0 0 20px rgba(46,230,46,0.3); }
.rw-topbar-btn.rw-primary:disabled { background: var(--rw-card2); color: var(--rw-muted); border-color: var(--rw-border); cursor: not-allowed; box-shadow: none; }

/* ── WORKSPACE GRID ── */
.rw-workspace {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  height: calc(100vh - 112px);
  overflow: hidden;
}

/* ── LEFT NAV ── */
.rw-left-nav {
  border-right: 1px solid var(--rw-border);
  background: var(--rw-surface);
  padding: 16px 0;
  overflow-y: auto;
  scrollbar-width: none;
}

.rw-left-nav::-webkit-scrollbar { display: none; }

.rw-nav-section-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--rw-muted2);
  padding: 12px 20px 8px;
}

.rw-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: var(--rw-muted);
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.04em;
  position: relative;
}

.rw-nav-item:hover { color: var(--rw-cream); background: rgba(255,255,255,0.02); }

.rw-nav-item.rw-active {
  color: var(--rw-cream);
  background: var(--rw-green-dim);
  border-right: 2px solid var(--rw-green);
}

.rw-nav-icon { font-size: 13px; width: 18px; text-align: center; }

.rw-nav-check {
  margin-left: auto;
  font-size: 10px;
  color: var(--rw-green);
}

.rw-nav-warn {
  margin-left: auto;
  font-size: 10px;
  color: var(--rw-gold);
}

.rw-release-meta-card {
  margin: 16px 14px;
  padding: 16px;
  background: var(--rw-card);
  border: 1px solid var(--rw-border);
  border-radius: 8px;
}

.rw-rmc-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 15px;
  color: var(--rw-cream);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.rw-rmc-title em { font-style: italic; color: var(--rw-green); }

.rw-rmc-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid var(--rw-border);
}

.rw-rmc-row:last-child { border-bottom: none; }

.rw-rmc-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--rw-muted);
}

.rw-rmc-val {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-cream);
  letter-spacing: 0.04em;
}

/* ── MAIN CONTENT ── */
.rw-main-content {
  overflow-y: auto;
  padding: 24px;
  scrollbar-width: none;
}

.rw-main-content::-webkit-scrollbar { display: none; }

.rw-section-card {
  background: var(--rw-card);
  border: 1px solid var(--rw-border);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}

.rw-section-card.rw-highlighted { border-color: var(--rw-border-bright); }

.rw-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid var(--rw-border);
}

.rw-card-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 18px;
  color: var(--rw-cream);
  letter-spacing: -0.01em;
}

.rw-card-subtitle {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--rw-muted);
  margin-top: 4px;
  letter-spacing: 0.04em;
}

.rw-card-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  border-radius: 4px;
  white-space: nowrap;
}

.rw-card-tag.rw-gold { background: var(--rw-gold-dim); color: var(--rw-gold); border: 1px solid rgba(245,166,35,0.2); }
.rw-card-tag.rw-green-tag { background: var(--rw-green-dim); color: var(--rw-green); border: 1px solid var(--rw-border-bright); }

/* ── SPLIT TABLE ── */
.rw-split-table-wrap { padding: 0; }

.rw-split-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  padding: 10px 22px;
  border-bottom: 1px solid var(--rw-border);
}

.rw-split-th {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--rw-muted2);
}

.rw-split-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 80px;
  padding: 14px 22px;
  align-items: center;
  border-bottom: 1px solid var(--rw-border);
  transition: background 0.15s;
}

.rw-split-row:hover { background: rgba(255,255,255,0.01); }
.rw-split-row:last-child { border-bottom: none; }

.rw-split-contributor { display: flex; align-items: center; gap: 12px; }

.rw-split-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: #000;
  font-weight: 600;
  flex-shrink: 0;
}

.rw-split-name {
  font-size: 13px;
  color: var(--rw-cream);
  font-weight: 500;
}

.rw-split-handle {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--rw-muted);
  letter-spacing: 0.04em;
}

.rw-split-role-tag {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 3px;
  background: var(--rw-green-dim);
  color: var(--rw-green);
  border: 1px solid var(--rw-border-bright);
}

.rw-split-pct-wrap {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rw-split-pct-input {
  width: 52px;
  background: var(--rw-card2);
  border: 1px solid var(--rw-border);
  border-radius: 4px;
  padding: 6px 8px;
  color: var(--rw-cream);
  font-family: 'Geist Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  outline: none;
  transition: border-color 0.2s;
  -moz-appearance: textfield;
}

.rw-split-pct-input::-webkit-outer-spin-button,
.rw-split-pct-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.rw-split-pct-input:focus { border-color: var(--rw-green); }

.rw-split-pct-sym {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: var(--rw-muted);
}

.rw-sign-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
}

.rw-sign-status.rw-signed { color: var(--rw-green); }
.rw-sign-status.rw-pending { color: var(--rw-gold); }

.rw-sign-icon { font-size: 12px; }

/* ── SPLIT TOTAL BAR ── */
.rw-split-total-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-top: 1px solid var(--rw-border);
}

.rw-split-bar-track {
  flex: 1;
  height: 4px;
  background: var(--rw-card2);
  border-radius: 2px;
  overflow: hidden;
}

.rw-split-bar-fill {
  height: 100%;
  background: var(--rw-green);
  border-radius: 2px;
  transition: width 0.3s ease, background 0.3s;
}

.rw-split-bar-fill.rw-over { background: var(--rw-red); }

.rw-split-total-label {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  color: var(--rw-muted);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.rw-split-total-val {
  font-family: 'Geist Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  min-width: 50px;
  text-align: right;
}

.rw-split-total-val.rw-good { color: var(--rw-green); }
.rw-split-total-val.rw-over-text { color: var(--rw-red); }
.rw-split-total-val.rw-under { color: var(--rw-gold); }

.rw-add-contributor-btn {
  margin: 14px 22px;
  width: calc(100% - 44px);
  padding: 10px;
  background: none;
  border: 1px dashed var(--rw-border-bright);
  border-radius: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-muted);
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.2s;
}

.rw-add-contributor-btn:hover { border-color: var(--rw-green); color: var(--rw-green); background: var(--rw-green-dim); }

/* ── CONTRACT TERMS ── */
.rw-terms-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 20px 22px;
}

.rw-term-field { display: flex; flex-direction: column; gap: 6px; }

.rw-term-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--rw-muted);
}

.rw-term-select, .rw-term-input {
  background: var(--rw-card2);
  border: 1px solid var(--rw-border);
  border-radius: 6px;
  padding: 9px 14px;
  color: var(--rw-text);
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
  cursor: pointer;
  letter-spacing: 0.04em;
}

.rw-term-select:focus, .rw-term-input:focus { border-color: var(--rw-border-bright); }

.rw-term-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--rw-card2);
  border: 1px solid var(--rw-border);
  border-radius: 6px;
}

.rw-term-toggle-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-muted);
  letter-spacing: 0.04em;
}

.rw-toggle {
  width: 36px; height: 20px;
  background: var(--rw-card);
  border-radius: 10px;
  border: 1px solid var(--rw-border);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}

.rw-toggle.rw-on { background: var(--rw-green); border-color: var(--rw-green); }

.rw-toggle-knob {
  position: absolute;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--rw-muted2);
  top: 2px; left: 2px;
  transition: all 0.2s;
}

.rw-toggle.rw-on .rw-toggle-knob { left: 18px; background: #000; }

/* ── PROOF VAULT ── */
.rw-proof-vault {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rw-proof-hash-box {
  background: var(--rw-card2);
  border: 1px solid var(--rw-border);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rw-proof-hash-icon { font-size: 18px; flex-shrink: 0; }

.rw-proof-hash-text { flex: 1; min-width: 0; }

.rw-proof-hash-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--rw-muted);
  margin-bottom: 4px;
}

.rw-proof-hash-val {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-green);
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rw-proof-copy-btn {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--rw-muted);
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s;
  flex-shrink: 0;
}

.rw-proof-copy-btn:hover { color: var(--rw-green); }

.rw-proof-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--rw-card2);
  border: 1px solid var(--rw-border);
  border-radius: 6px;
}

.rw-proof-status-icon { font-size: 14px; }

.rw-proof-status-text {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-muted);
  letter-spacing: 0.04em;
  flex: 1;
}

.rw-proof-status-text strong { color: var(--rw-text); }

.rw-proof-chain-badge {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 3px;
  background: var(--rw-green-dim);
  color: var(--rw-green);
  border: 1px solid var(--rw-border-bright);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── LOCK BANNER ── */
.rw-lock-banner {
  padding: 22px;
  background: linear-gradient(135deg, rgba(46,230,46,0.06) 0%, transparent 60%);
  border-top: 1px solid var(--rw-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.rw-lock-banner-text { flex: 1; }

.rw-lock-banner-title {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 16px;
  color: var(--rw-cream);
  margin-bottom: 4px;
}

.rw-lock-banner-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--rw-muted);
  letter-spacing: 0.06em;
}

.rw-lock-release-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--rw-green);
  color: #000;
  border: none;
  padding: 12px 28px;
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.rw-lock-release-btn:hover { box-shadow: 0 0 32px rgba(46,230,46,0.4); transform: translateY(-1px); }
.rw-lock-release-btn:disabled { background: var(--rw-card2); color: var(--rw-muted); cursor: not-allowed; box-shadow: none; transform: none; }

/* ── RIGHT PANEL ── */
.rw-right-panel {
  border-left: 1px solid var(--rw-border);
  background: var(--rw-surface);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  scrollbar-width: none;
}

.rw-right-panel::-webkit-scrollbar { display: none; }

.rw-rp-section-title {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--rw-muted);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rw-border);
}

/* checklist */
.rw-checklist { display: flex; flex-direction: column; gap: 8px; }

.rw-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--rw-card);
  border: 1px solid var(--rw-border);
  border-radius: 7px;
  transition: border-color 0.2s;
}

.rw-check-item.rw-done { border-color: rgba(46,230,46,0.15); }
.rw-check-item.rw-warn { border-color: rgba(245,166,35,0.15); }

.rw-check-box {
  width: 18px; height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}

.rw-check-box.rw-done { background: var(--rw-green-dim); border: 1px solid var(--rw-border-bright); color: var(--rw-green); }
.rw-check-box.rw-warn { background: var(--rw-gold-dim); border: 1px solid rgba(245,166,35,0.25); color: var(--rw-gold); }

.rw-check-text { flex: 1; min-width: 0; }

.rw-check-label {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-text);
  letter-spacing: 0.04em;
}

.rw-check-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  color: var(--rw-muted);
  margin-top: 2px;
  letter-spacing: 0.04em;
}

/* activity feed */
.rw-activity-feed { display: flex; flex-direction: column; gap: 0; }

.rw-activity-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--rw-border);
}

.rw-activity-item:last-child { border-bottom: none; }

.rw-activity-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.rw-activity-content { flex: 1; min-width: 0; }

.rw-activity-text { font-size: 12px; color: var(--rw-muted); line-height: 1.5; }
.rw-activity-text strong { color: var(--rw-text); }
.rw-activity-text .rw-green-text { color: var(--rw-green); }

.rw-activity-time {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  color: var(--rw-muted2);
  margin-top: 3px;
  letter-spacing: 0.04em;
}

/* distribution targets */
.rw-dist-targets { display: flex; flex-direction: column; gap: 8px; }

.rw-dist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: var(--rw-card);
  border: 1px solid var(--rw-border);
  border-radius: 6px;
}

.rw-dist-name {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-text);
  letter-spacing: 0.04em;
}

.rw-dist-status {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 3px;
}

.rw-dist-status.rw-ready { background: var(--rw-green-dim); color: var(--rw-green); border: 1px solid var(--rw-border-bright); }
.rw-dist-status.rw-pending-dist { background: var(--rw-gold-dim); color: var(--rw-gold); border: 1px solid rgba(245,166,35,0.2); }

/* ── LOCKED OVERLAY ── */
.rw-locked-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8,8,6,0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.rw-locked-overlay.rw-visible { opacity: 1; pointer-events: auto; }

.rw-lock-modal {
  background: var(--rw-card);
  border: 1px solid var(--rw-border-locked);
  border-radius: 16px;
  padding: 40px;
  max-width: 440px;
  width: 90%;
  text-align: center;
  position: relative;
  animation: rwModalIn 0.4s ease both;
}

@keyframes rwModalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.rw-lock-modal::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--rw-green), transparent);
}

.rw-lock-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
  animation: rwLockPulse 2s ease-in-out infinite;
}

@keyframes rwLockPulse {
  0%,100% { filter: drop-shadow(0 0 8px rgba(46,230,46,0.4)); }
  50% { filter: drop-shadow(0 0 20px rgba(46,230,46,0.8)); }
}

.rw-lock-modal-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--rw-cream);
  margin-bottom: 8px;
}

.rw-lock-modal-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-muted);
  letter-spacing: 0.06em;
  line-height: 1.7;
  margin-bottom: 24px;
}

.rw-lock-modal-hash {
  background: var(--rw-card2);
  border: 1px solid var(--rw-border-bright);
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--rw-green);
  letter-spacing: 0.06em;
  margin-bottom: 20px;
  word-break: break-all;
}

.rw-lock-modal-actions { display: flex; gap: 10px; justify-content: center; }

.rw-lock-modal-btn {
  padding: 10px 24px;
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.rw-lock-modal-btn.rw-confirm { background: var(--rw-green); color: #000; border: none; }
.rw-lock-modal-btn.rw-confirm:hover { box-shadow: 0 0 20px rgba(46,230,46,0.4); }
.rw-lock-modal-btn.rw-confirm:disabled { background: var(--rw-card2); color: var(--rw-muted); cursor: not-allowed; }

.rw-lock-modal-btn.rw-cancel { background: none; color: var(--rw-muted); border: 1px solid var(--rw-border); }
.rw-lock-modal-btn.rw-cancel:hover { color: var(--rw-text); border-color: var(--rw-border-bright); }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .rw-workspace { grid-template-columns: 220px 1fr; }
  .rw-right-panel { display: none; }
}

@media (max-width: 768px) {
  .rw-workspace { grid-template-columns: 1fr; }
  .rw-left-nav { display: none; }
  .rw-terms-grid { grid-template-columns: 1fr; }
  .rw-split-table-header, .rw-split-row { grid-template-columns: 1fr 80px 80px; }
  .rw-split-table-header .rw-split-th:nth-child(n+4),
  .rw-split-row > *:nth-child(n+4) { display: none; }
  .rw-topbar { flex-wrap: wrap; height: auto; padding: 10px 16px; gap: 8px; }
  .rw-topbar-right { flex-wrap: wrap; }
  .rw-workspace { height: auto; min-height: calc(100vh - 112px); }
}
      `}</style>

      <div className="rw-page">
        {/* LOCK MODAL */}
        <div className="rw-locked-overlay" ref={lockOverlayRef}>
          <div className="rw-lock-modal">
            <span className="rw-lock-icon">🔒</span>
            <div className="rw-lock-modal-title">Lock This Release</div>
            <div className="rw-lock-modal-sub">
              All contributors have signed. Locking this release writes a tamper-proof proof to Solana. Split terms cannot be changed after this point.
            </div>
            <div className="rw-lock-modal-hash" ref={modalHashRef}>Generating proof hash...</div>
            <div className="rw-lock-modal-actions">
              <button className="rw-lock-modal-btn rw-cancel" ref={cancelLockRef}>Cancel</button>
              <button className="rw-lock-modal-btn rw-confirm" ref={confirmLockRef}>🔒 &nbsp;Lock &amp; Publish</button>
            </div>
          </div>
        </div>

        {/* TOPBAR */}
        <div className="rw-topbar">
          <div className="rw-topbar-left">
            <div className="rw-logo-wrap" onClick={() => setLocation("/")}>
              <div className="rw-logo-eq" ref={logoEqRef}></div>
              <div className="rw-logo-text">dimi</div>
            </div>
            <div className="rw-topbar-divider"></div>
            <div className="rw-breadcrumb">
              <span className="rw-bc-link" onClick={() => setLocation("/app")}>Dashboard</span>
              <span className="rw-sep">›</span> Rights Workspace <span className="rw-sep">›</span> <span>Dark Side of Midnight</span>
            </div>
          </div>
          <div className="rw-topbar-right">
            <div className="rw-status-chip rw-pending">
              <div className="rw-status-dot"></div>
              2 of 3 Signed
            </div>
            <button className="rw-topbar-btn">↗ Share Draft</button>
            <button className="rw-topbar-btn rw-primary" ref={lockBtnRef}>🔒 &nbsp;Lock Release</button>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="rw-workspace">
          {/* LEFT NAV */}
          <div className="rw-left-nav">
            <div className="rw-nav-section-label">Release</div>
            <div className="rw-nav-item rw-active"><span className="rw-nav-icon">◉</span> Split Contract <span className="rw-nav-check">✓</span></div>
            <div className="rw-nav-item"><span className="rw-nav-icon">📄</span> Contract Terms <span className="rw-nav-warn">!</span></div>
            <div className="rw-nav-item"><span className="rw-nav-icon">◈</span> Proof Vault</div>
            <div className="rw-nav-item"><span className="rw-nav-icon">↗</span> Distribution</div>
            <div className="rw-nav-item"><span className="rw-nav-icon">💸</span> Payout Settings</div>

            <div className="rw-nav-section-label">Files</div>
            <div className="rw-nav-item"><span className="rw-nav-icon">♪</span> Master Audio <span className="rw-nav-check">✓</span></div>
            <div className="rw-nav-item"><span className="rw-nav-icon">⬡</span> Stems (5) <span className="rw-nav-check">✓</span></div>
            <div className="rw-nav-item"><span className="rw-nav-icon">📝</span> Metadata <span className="rw-nav-warn">!</span></div>
            <div className="rw-nav-item"><span className="rw-nav-icon">🎨</span> Artwork <span className="rw-nav-check">✓</span></div>

            <div className="rw-release-meta-card">
              <div className="rw-rmc-title">Dark Side of <em>Midnight</em></div>
              <div className="rw-rmc-row"><div className="rw-rmc-label">Genre</div><div className="rw-rmc-val">Trap / Soul</div></div>
              <div className="rw-rmc-row"><div className="rw-rmc-label">BPM</div><div className="rw-rmc-val">142</div></div>
              <div className="rw-rmc-row"><div className="rw-rmc-label">Key</div><div className="rw-rmc-val">F# Minor</div></div>
              <div className="rw-rmc-row"><div className="rw-rmc-label">Session</div><div className="rw-rmc-val">Apr 6, 2026</div></div>
              <div className="rw-rmc-row"><div className="rw-rmc-label">Duration</div><div className="rw-rmc-val">3:47</div></div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="rw-main-content">
            {/* SPLIT CONTRACT */}
            <div className="rw-section-card rw-highlighted">
              <div className="rw-card-header">
                <div>
                  <div className="rw-card-title">Master Split Contract</div>
                  <div className="rw-card-subtitle">Define ownership percentages · All contributors must sign before release</div>
                </div>
                <div className="rw-card-tag rw-gold">2 of 3 Signed</div>
              </div>

              <div className="rw-split-table-wrap">
                <div className="rw-split-table-header">
                  <div className="rw-split-th">Contributor</div>
                  <div className="rw-split-th">Role</div>
                  <div className="rw-split-th">Master Split</div>
                  <div className="rw-split-th">Signature</div>
                  <div className="rw-split-th"></div>
                </div>

                {/* Row 1 */}
                <div className="rw-split-row">
                  <div className="rw-split-contributor">
                    <div className="rw-split-avatar" style={{ background: "#2EE62E" }}>ML</div>
                    <div>
                      <div className="rw-split-name">Metro Luz</div>
                      <div className="rw-split-handle">@metroluz · Host</div>
                    </div>
                  </div>
                  <div><span className="rw-split-role-tag">Producer</span></div>
                  <div className="rw-split-pct-wrap">
                    <input className="rw-split-pct-input" type="number" defaultValue={50} min={0} max={100} ref={pct0Ref} />
                    <span className="rw-split-pct-sym">%</span>
                  </div>
                  <div className="rw-sign-status rw-signed"><span className="rw-sign-icon">✓</span> Signed</div>
                  <div></div>
                </div>

                {/* Row 2 */}
                <div className="rw-split-row">
                  <div className="rw-split-contributor">
                    <div className="rw-split-avatar" style={{ background: "#3DD6C8" }}>KD</div>
                    <div>
                      <div className="rw-split-name">KayDee</div>
                      <div className="rw-split-handle">@kaydee</div>
                    </div>
                  </div>
                  <div><span className="rw-split-role-tag">Co-Producer</span></div>
                  <div className="rw-split-pct-wrap">
                    <input className="rw-split-pct-input" type="number" defaultValue={30} min={0} max={100} ref={pct1Ref} />
                    <span className="rw-split-pct-sym">%</span>
                  </div>
                  <div className="rw-sign-status rw-signed"><span className="rw-sign-icon">✓</span> Signed</div>
                  <div></div>
                </div>

                {/* Row 3 */}
                <div className="rw-split-row">
                  <div className="rw-split-contributor">
                    <div className="rw-split-avatar" style={{ background: "#FF4D6D" }}>AL</div>
                    <div>
                      <div className="rw-split-name">Ari Lennox</div>
                      <div className="rw-split-handle">@arilennox</div>
                    </div>
                  </div>
                  <div><span className="rw-split-role-tag">Vocalist</span></div>
                  <div className="rw-split-pct-wrap">
                    <input className="rw-split-pct-input" type="number" defaultValue={20} min={0} max={100} ref={pct2Ref} />
                    <span className="rw-split-pct-sym">%</span>
                  </div>
                  <div className="rw-sign-status rw-pending"><span className="rw-sign-icon">⏳</span> Pending</div>
                  <div>
                    <button className="rw-topbar-btn" style={{ fontSize: "10px", padding: "4px 10px" }}>Remind</button>
                  </div>
                </div>
              </div>

              {/* Split total bar */}
              <div className="rw-split-total-bar">
                <div className="rw-split-bar-track">
                  <div className="rw-split-bar-fill" ref={splitBarFillRef} style={{ width: "100%" }}></div>
                </div>
                <div className="rw-split-total-label">Total allocated</div>
                <div className="rw-split-total-val rw-good" ref={splitTotalValRef}>100%</div>
              </div>

              <button className="rw-add-contributor-btn">+ Add Contributor</button>
            </div>

            {/* CONTRACT TERMS */}
            <div className="rw-section-card">
              <div className="rw-card-header">
                <div>
                  <div className="rw-card-title">Contract Terms</div>
                  <div className="rw-card-subtitle">Recoupment · Reserve · Dispute rules · Payout schedule</div>
                </div>
                <div className="rw-card-tag rw-gold">Review Required</div>
              </div>
              <div className="rw-terms-grid">
                <div className="rw-term-field">
                  <div className="rw-term-label">Payout Schedule</div>
                  <select className="rw-term-select">
                    <option>Monthly</option>
                    <option>Bi-weekly</option>
                    <option>On threshold</option>
                  </select>
                </div>
                <div className="rw-term-field">
                  <div className="rw-term-label">Minimum Payout</div>
                  <input className="rw-term-input" type="text" defaultValue="$25.00" />
                </div>
                <div className="rw-term-field">
                  <div className="rw-term-label">Reserve Period</div>
                  <select className="rw-term-select">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                  </select>
                </div>
                <div className="rw-term-field">
                  <div className="rw-term-label">Dispute Window</div>
                  <select className="rw-term-select">
                    <option>14 days</option>
                    <option>30 days</option>
                    <option>60 days</option>
                  </select>
                </div>
                <div className="rw-term-field">
                  <div className="rw-term-label">Recoupment</div>
                  <div className="rw-term-toggle-row">
                    <span className="rw-term-toggle-label">Enable recoupment tracking</span>
                    <div className="rw-toggle" ref={recoupToggleRef}>
                      <div className="rw-toggle-knob"></div>
                    </div>
                  </div>
                </div>
                <div className="rw-term-field">
                  <div className="rw-term-label">Payout Method</div>
                  <select className="rw-term-select">
                    <option>Fiat (Bank Transfer)</option>
                    <option>USDC (Solana)</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PROOF VAULT */}
            <div className="rw-section-card">
              <div className="rw-card-header">
                <div>
                  <div className="rw-card-title">Proof Vault</div>
                  <div className="rw-card-subtitle">Tamper-evident record of this release · Written to Solana on lock</div>
                </div>
                <div className="rw-card-tag rw-gold">Pre-lock · Pending</div>
              </div>
              <div className="rw-proof-vault">
                <div className="rw-proof-hash-box">
                  <div className="rw-proof-hash-icon">🔐</div>
                  <div className="rw-proof-hash-text">
                    <div className="rw-proof-hash-label">Release Fingerprint (SHA-256)</div>
                    <div className="rw-proof-hash-val">a3f8c2e1d94b7056f31...pending lock</div>
                  </div>
                  <button className="rw-proof-copy-btn">Copy</button>
                </div>
                <div className="rw-proof-hash-box">
                  <div className="rw-proof-hash-icon">📄</div>
                  <div className="rw-proof-hash-text">
                    <div className="rw-proof-hash-label">Split Contract Hash</div>
                    <div className="rw-proof-hash-val">b92d14a7e63f8c1205a...pending signatures</div>
                  </div>
                  <button className="rw-proof-copy-btn">Copy</button>
                </div>
                <div className="rw-proof-status-row">
                  <div className="rw-proof-status-icon">⛓</div>
                  <div className="rw-proof-status-text">Proof will be written to <strong>Solana mainnet</strong> upon release lock. All contributor signatures required.</div>
                  <div className="rw-proof-chain-badge">Solana</div>
                </div>
                <div className="rw-proof-status-row">
                  <div className="rw-proof-status-icon">📦</div>
                  <div className="rw-proof-status-text">Distribution package will be auto-generated and submitted to partner rails after lock.</div>
                  <div className="rw-proof-chain-badge">IPFS</div>
                </div>
              </div>

              {/* Lock banner */}
              <div className="rw-lock-banner">
                <div className="rw-lock-banner-text">
                  <div className="rw-lock-banner-title">Ready to lock this release?</div>
                  <div className="rw-lock-banner-sub">Waiting on 1 signature · Ari Lennox has been notified · Terms reviewed</div>
                </div>
                <button className="rw-lock-release-btn" ref={lockBannerBtnRef} disabled>🔒 &nbsp;1 Signature Remaining</button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rw-right-panel">
            {/* Checklist */}
            <div>
              <div className="rw-rp-section-title">Release Checklist</div>
              <div className="rw-checklist">
                <div className="rw-check-item rw-done">
                  <div className="rw-check-box rw-done">✓</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Master Audio Uploaded</div>
                    <div className="rw-check-sub">WAV 24-bit · 44.1kHz · 3:47</div>
                  </div>
                </div>
                <div className="rw-check-item rw-done">
                  <div className="rw-check-box rw-done">✓</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Artwork Uploaded</div>
                    <div className="rw-check-sub">3000×3000px · RGB · JPEG</div>
                  </div>
                </div>
                <div className="rw-check-item rw-done">
                  <div className="rw-check-box rw-done">✓</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Splits Defined</div>
                    <div className="rw-check-sub">3 contributors · 100% allocated</div>
                  </div>
                </div>
                <div className="rw-check-item rw-warn">
                  <div className="rw-check-box rw-warn">!</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">All Signatures</div>
                    <div className="rw-check-sub">2 of 3 signed · Ari pending</div>
                  </div>
                </div>
                <div className="rw-check-item rw-warn">
                  <div className="rw-check-box rw-warn">!</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Metadata Complete</div>
                    <div className="rw-check-sub">ISRC code missing</div>
                  </div>
                </div>
                <div className="rw-check-item rw-done">
                  <div className="rw-check-box rw-done">✓</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Contract Terms</div>
                    <div className="rw-check-sub">Monthly · $25 min · 30d reserve</div>
                  </div>
                </div>
                <div className="rw-check-item rw-done">
                  <div className="rw-check-box rw-done">✓</div>
                  <div className="rw-check-text">
                    <div className="rw-check-label">Distribution Targets</div>
                    <div className="rw-check-sub">Spotify · Apple · TikTok · 4 more</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution targets */}
            <div>
              <div className="rw-rp-section-title">Distribution Targets</div>
              <div className="rw-dist-targets">
                <div className="rw-dist-item"><div className="rw-dist-name">Spotify</div><div className="rw-dist-status rw-ready">Ready</div></div>
                <div className="rw-dist-item"><div className="rw-dist-name">Apple Music</div><div className="rw-dist-status rw-ready">Ready</div></div>
                <div className="rw-dist-item"><div className="rw-dist-name">TikTok / SoundOn</div><div className="rw-dist-status rw-ready">Ready</div></div>
                <div className="rw-dist-item"><div className="rw-dist-name">YouTube Music</div><div className="rw-dist-status rw-ready">Ready</div></div>
                <div className="rw-dist-item"><div className="rw-dist-name">DIMI Feed</div><div className="rw-dist-status rw-ready">Ready</div></div>
                <div className="rw-dist-item"><div className="rw-dist-name">Amazon Music</div><div className="rw-dist-status rw-pending-dist">Pending</div></div>
              </div>
            </div>

            {/* Activity */}
            <div>
              <div className="rw-rp-section-title">Activity</div>
              <div className="rw-activity-feed">
                <div className="rw-activity-item">
                  <div className="rw-activity-dot" style={{ background: "#2EE62E" }}></div>
                  <div className="rw-activity-content">
                    <div className="rw-activity-text"><strong>Metro Luz</strong> signed the split contract</div>
                    <div className="rw-activity-time">Today, 2:14 PM</div>
                  </div>
                </div>
                <div className="rw-activity-item">
                  <div className="rw-activity-dot" style={{ background: "#3DD6C8" }}></div>
                  <div className="rw-activity-content">
                    <div className="rw-activity-text"><strong>KayDee</strong> signed the split contract</div>
                    <div className="rw-activity-time">Today, 1:52 PM</div>
                  </div>
                </div>
                <div className="rw-activity-item">
                  <div className="rw-activity-dot" style={{ background: "#F5A623" }}></div>
                  <div className="rw-activity-content">
                    <div className="rw-activity-text">Signature request sent to <strong>Ari Lennox</strong></div>
                    <div className="rw-activity-time">Today, 1:30 PM</div>
                  </div>
                </div>
                <div className="rw-activity-item">
                  <div className="rw-activity-dot" style={{ background: "#2EE62E" }}></div>
                  <div className="rw-activity-content">
                    <div className="rw-activity-text">Split contract <span className="rw-green-text">created</span> — 3 contributors</div>
                    <div className="rw-activity-time">Today, 1:15 PM</div>
                  </div>
                </div>
                <div className="rw-activity-item">
                  <div className="rw-activity-dot" style={{ background: "#646258" }}></div>
                  <div className="rw-activity-content">
                    <div className="rw-activity-text">Master audio uploaded — WAV 24-bit</div>
                    <div className="rw-activity-time">Today, 12:44 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
