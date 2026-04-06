import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SharedNav() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const eqRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const el = eqRef.current;
    if (!el || el.children.length > 0) return;
    const bars = Array.from({ length: 8 }, () => {
      const max = Math.floor(Math.random() * 16 + 6);
      const min = Math.floor(max * 0.15);
      const dur = (Math.random() * 0.7 + 0.6).toFixed(2);
      const dl = (Math.random() * 0.5).toFixed(2);
      const bar = document.createElement("div");
      bar.style.cssText = `width:3px;border-radius:1px;background:linear-gradient(to top,#0D7A0D,#2EE62E,#7BFF8F);box-shadow:0 0 4px rgba(46,230,46,0.5);animation:eqAnim ${dur}s ease-in-out infinite alternate;animation-delay:${dl}s;--min:${min}px;--max:${max}px;`;
      return bar;
    });
    bars.forEach((b) => el.appendChild(b));
  }, []);

  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <nav className="shared-nav">
      <Link href="/" className="shared-nav-logo">
        <div ref={eqRef} className="shared-nav-eq" />
        <span className="shared-nav-wordmark">dimi</span>
      </Link>

      <button
        className="shared-nav-hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`shared-nav-links ${mobileOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <>
            <li>
              <Link
                href="/app"
                className={`shared-nav-link ${isActive("/app") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                App
              </Link>
            </li>
            <li>
              <Link
                href="/rooms"
                className={`shared-nav-link ${isActive("/rooms") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/rights"
                className={`shared-nav-link ${isActive("/rights") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Rights
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`shared-nav-link ${isActive("/profile") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="shared-nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href="/"
                className={`shared-nav-link ${isActive("/") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Landing
              </Link>
            </li>
            <li>
              <Link
                href="/discover"
                className={`shared-nav-link ${isActive("/discover") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Discover
              </Link>
            </li>
            <li>
              <Link
                href="/rooms"
                className={`shared-nav-link ${isActive("/rooms") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/brand"
                className={`shared-nav-link ${isActive("/brand") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Brand Kit
              </Link>
            </li>
            <li>
              <Link
                href="/rights"
                className={`shared-nav-link ${isActive("/rights") ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Rights
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="shared-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="shared-nav-cta"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
