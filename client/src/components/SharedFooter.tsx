import { useEffect, useRef } from "react";
import { Link } from "wouter";

export default function SharedFooter() {
  const eqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = eqRef.current;
    if (!el || el.children.length > 0) return;
    Array.from({ length: 6 }, () => {
      const max = Math.floor(Math.random() * 14 + 4);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.7 + 0.6).toFixed(2);
      const dl = (Math.random() * 0.5).toFixed(2);
      const bar = document.createElement("div");
      bar.style.cssText = `width:2.5px;border-radius:1px;background:linear-gradient(to top,#0D7A0D,#2EE62E);box-shadow:0 0 4px rgba(46,230,46,0.4);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    }).forEach((b) => el.appendChild(b));
  }, []);

  return (
    <footer className="shared-footer">
      <div className="shared-footer-logo">
        <div ref={eqRef} className="shared-footer-eq" />
        <span className="shared-footer-name">dimi</span>
      </div>
      <ul className="shared-footer-links">
        <li><Link href="/">Platform</Link></li>
        <li><Link href="/discover">Discover</Link></li>
        <li><Link href="/brand">Brand Kit</Link></li>
        <li><a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord</a></li>
        <li><a href="https://x.com/_gwapspot?s=21" target="_blank" rel="noopener noreferrer">Twitter</a></li>
      </ul>
      <div className="shared-footer-copy">© 2026 DIMI. All rights reserved.</div>
    </footer>
  );
}
