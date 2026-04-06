import { useEffect } from 'react';
import { useLocation } from 'wouter';
import SharedNav from '@/components/SharedNav';

export default function Session() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // ── STEMS ──
    const stems = [
      { name: 'Drums', color: '#2EE62E', active: true },
      { name: 'Bass', color: '#3DD6C8', active: true },
      { name: 'Keys', color: '#FF4D6D', active: true },
      { name: 'Melody', color: '#A47DFF', active: true },
    ];

    const stemsContainer = document.getElementById('stemsContainer');
    if (stemsContainer) {
      stemsContainer.innerHTML = stems.map(s => {
        const bars = Array.from({ length: 60 }, () => {
          const max = Math.floor(Math.random() * 13 + 3);
          const min = Math.floor(max * 0.15);
          const d = (Math.random() * 0.6 + 0.5).toFixed(2);
          const dl = (Math.random() * 0.5).toFixed(2);
          return `<div class="stem-wf-bar" style="background:${s.color};opacity:0.7;--min:${min}px;--max:${max}px;--d:${d}s;--dl:${dl}s"></div>`;
        }).join('');

        return `
          <div class="stem-row">
            <div class="stem-name">${s.name}</div>
            <div class="stem-track">${bars}</div>
            <div class="stem-active-dot" style="background:${s.color};box-shadow:0 0 6px ${s.color}44;"></div>
          </div>
        `;
      }).join('');
    }

    // ── SESSION TIMER ──
    let seconds = 2 * 3600 + 14 * 60 + 37;
    const timerInterval = setInterval(() => {
      seconds++;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      const timerEl = document.getElementById('sessionTimer');
      if (timerEl) {
        timerEl.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }, 1000);

    // ── TIP AMOUNTS ──
    document.querySelectorAll('.tip-amount').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tip-amount').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    // ── TIP SEND ──
    const tipBtn = document.getElementById('tipBtn') as HTMLButtonElement;
    if (tipBtn) {
      tipBtn.addEventListener('click', () => {
        const selected = document.querySelector('.tip-amount.selected');
        const amount = selected ? selected.textContent : '$5';
        const orig = tipBtn.innerHTML;
        tipBtn.innerHTML = `✓ &nbsp;${amount} Sent!`;
        tipBtn.style.background = '#1a2e1a';
        tipBtn.style.color = 'var(--green)';
        tipBtn.style.border = '1px solid var(--border-bright)';

        // Add to chat
        addTipToChat('you', amount || '$5');

        setTimeout(() => {
          tipBtn.innerHTML = orig;
          tipBtn.style.background = '';
          tipBtn.style.color = '';
          tipBtn.style.border = '';
        }, 3000);
      });
    }

    // ── CHAT ──
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput') as HTMLInputElement;
    const chatSend = document.getElementById('chatSend') as HTMLButtonElement;

    function addMessage(username: string, text: string, color = '#5a5e50', isProducer = false) {
      const initial = username[0].toUpperCase();
      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
      const div = document.createElement('div');
      div.className = 'chat-msg';
      div.innerHTML = `
        <div class="chat-avatar" style="background:${color}">${initial}</div>
        <div class="chat-msg-body">
          <div class="chat-msg-header">
            <span class="chat-username ${isProducer ? 'producer-msg' : ''}">${username}</span>
            <span class="chat-timestamp">${time}</span>
          </div>
          <div class="chat-text">${text}</div>
        </div>
      `;
      if (chatMessages) {
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    function addTipToChat(username: string, amount: string) {
      const div = document.createElement('div');
      div.className = 'chat-tip-event';
      div.innerHTML = `
        <div class="tip-event-icon">💸</div>
        <div class="tip-event-text"><strong>@${username}</strong> tipped <strong>${amount}</strong></div>
      `;
      if (chatMessages) {
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      addMessage('you', text, '#2EE62E', false);
      chatInput.value = '';
    }

    if (chatSend) {
      chatSend.addEventListener('click', sendMessage);
    }
    if (chatInput) {
      chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    }

    // ── LIVE CHAT SIMULATION ──
    const liveMessages = [
      { user: 'trap_historian', text: 'this 808 pattern is straight from the classics', color: '#FF9F47' },
      { user: 'newwave_fan', text: 'dropped everything to watch this session lmao', color: '#4DA6FF' },
      { user: 'producerwatch', text: 'bro just snapped on that transition 🔥🔥', color: '#FF4D6D' },
      { user: 'KayDee', text: 'ok the bridge is about to go crazy trust', color: '#3DD6C8', isProducer: true },
      { user: 'midnightvibes', text: 'i can hear this on a drake album already', color: '#A47DFF' },
      { user: 'beatscout_atl', text: 'how long has metro been on dimi?', color: '#5a5e50' },
      { user: 'wavefan22', text: 'like 3 months, best thing that happened to music streaming', color: '#5a5e50' },
      { user: 'Metro Luz', text: 'bridge dropping in 2 mins 👀👀', color: '#2EE62E', isProducer: true },
    ];

    let msgIndex = 0;
    function scheduleNextMessage() {
      const delay = Math.random() * 5000 + 3000;
      const timeout = setTimeout(() => {
        if (msgIndex < liveMessages.length) {
          const m = liveMessages[msgIndex++];
          addMessage(m.user, m.text, m.color, m.isProducer);
        }
        scheduleNextMessage();
      }, delay);
      return () => clearTimeout(timeout);
    }
    const clearSchedule = scheduleNextMessage();

    // ── VIEWER COUNT SIMULATION ──
    let viewers = 1247;
    const viewerInterval = setInterval(() => {
      const delta = Math.floor(Math.random() * 7) - 3;
      viewers = Math.max(1000, viewers + delta);
      const viewerEl = document.querySelector('.viewer-count');
      if (viewerEl) {
        viewerEl.innerHTML = `${viewers.toLocaleString()} watching`;
      }
      const chatOnlineEl = document.querySelector('.chat-online');
      if (chatOnlineEl) {
        chatOnlineEl.textContent = `● ${viewers.toLocaleString()} online`;
      }
    }, 4000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(viewerInterval);
      if (clearSchedule) clearSchedule();
    };
  }, []);

  return (
    <>
      <SharedNav />
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* TOAST */}
      <div className="moment-toast">🎵 <strong>Ari Lennox</strong> just joined the session as a collaborator</div>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => setLocation('/discover')}>← Discover</button>
          <div className="topbar-divider"></div>
          <div className="session-breadcrumb">Metro Luz · <span>Dark Side of Midnight</span></div>
        </div>

        <div className="topbar-center">
          <div className="live-indicator"><div className="live-dot"></div>Live</div>
          <div className="session-timer" id="sessionTimer">2:14:37</div>
        </div>

        <div className="topbar-right">
          <div className="viewer-count">1,247 watching</div>
          <button className="share-btn">↗ Share</button>
          <button className="follow-btn">+ Follow</button>
        </div>
      </div>

      {/* ROOM */}
      <div className="room-layout">
        {/* STAGE */}
        <div className="stage-col">
          <div className="webcam-stage">
            {/* Simulated webcam feed */}
            <div className="webcam-feed">
              <div className="webcam-placeholder">
                <div className="studio-glow"></div>

                {/* Producer silhouette */}
                <div className="producer-silhouette">
                  <div className="sil-head"></div>
                  <div className="sil-body"></div>
                </div>

                {/* Equipment row */}
                <div className="equipment-row">
                  <div className="eq-knob"></div>
                  <div className="eq-knob"></div>
                  <div className="eq-fader"><div className="eq-fader-thumb" style={{ '--pos': '20%' } as any}></div></div>
                  <div className="eq-fader"><div className="eq-fader-thumb" style={{ '--pos': '45%' } as any}></div></div>
                  <div className="eq-fader"><div className="eq-fader-thumb" style={{ '--pos': '15%' } as any}></div></div>
                  <div className="eq-fader"><div className="eq-fader-thumb" style={{ '--pos': '35%' } as any}></div></div>
                  <div className="eq-knob"></div>
                  <div className="eq-knob"></div>
                </div>
              </div>
            </div>

            {/* Overlay elements */}
            <div className="webcam-overlay">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
            </div>

            {/* Save moment */}
            <button className="save-moment-btn">✦ Save Moment</button>

            {/* Producer info gradient */}
            <div className="producer-overlay">
              <div className="producer-info">
                <div className="producer-name">Metro Luz</div>
                <div className="producer-tag-row">
                  <div className="producer-tag">@metroluz</div>
                  <div className="producer-genre">Trap / Soul</div>
                </div>
              </div>
              <div className="collab-bubbles">
                <div className="collab-avatar" style={{ background: '#3DD6C8' }} title="KayDee">KD</div>
                <div className="collab-avatar" style={{ background: '#FF4D6D' }} title="Ari Lennox">AL</div>
                <div className="collab-avatar" style={{ background: '#A47DFF' }} title="BassNova">BN</div>
                <div className="collab-label">3 collabs</div>
              </div>
            </div>
          </div>

          {/* STEMS STRIP */}
          <div className="stems-strip">
            <div className="stems-header">
              <div className="stems-label">Live Stems</div>
              <div className="stems-bpm">142 BPM · Session 4</div>
            </div>
            <div id="stemsContainer"></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Session info */}
          <div className="session-info-card">
            <div className="session-title">Dark Side of <em>Midnight</em></div>
            <div className="session-meta-row">
              <div className="session-meta-item">Started <span>2h 14m ago</span></div>
              <div className="session-meta-sep">·</div>
              <div className="session-meta-item"><span>3</span> collaborators</div>
              <div className="session-meta-sep">·</div>
              <div className="session-meta-item">FL Studio <span>21</span></div>
            </div>
          </div>

          {/* Tip section */}
          <div className="tip-section">
            <div className="tip-label">Tip Metro Luz</div>
            <div className="tip-amounts">
              <div className="tip-amount">$1</div>
              <div className="tip-amount selected">$5</div>
              <div className="tip-amount">$10</div>
              <div className="tip-amount">$20</div>
            </div>
            <button className="tip-send-btn" id="tipBtn">💸 &nbsp;Send Tip</button>
          </div>

          {/* Chat */}
          <div className="chat-section">
            <div className="chat-header">
              <div className="chat-label">Fan Chat</div>
              <div className="chat-online">● 1,247 online</div>
            </div>

            <div className="chat-messages" id="chatMessages">
              <div className="chat-tip-event">
                <div className="tip-event-icon">💸</div>
                <div className="tip-event-text"><strong>@wavefan22</strong> tipped <strong>$10</strong> — "This beat is INSANE 🔥"</div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#3DD6C8' }}>KD</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username producer-msg">KayDee</span>
                    <span className="chat-timestamp">2:12</span>
                  </div>
                  <div className="chat-text">That 808 slide on the chorus is different bro 🤯</div>
                </div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#5a5e50' }}>W</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username">wavefan22</span>
                    <span className="chat-timestamp">2:12</span>
                  </div>
                  <div className="chat-text">been watching for 2 hours straight, can't stop</div>
                </div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#A47DFF' }}>BN</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username producer-msg">BassNova</span>
                    <span className="chat-timestamp">2:13</span>
                  </div>
                  <div className="chat-text">Metro what key is that melody? asking for a friend 👀</div>
                </div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#2EE62E' }}>ML</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username producer-msg">Metro Luz</span>
                    <span className="chat-timestamp">2:13</span>
                  </div>
                  <div className="chat-text">F# minor, same key as the whole project 🎹 bout to add the bridge now</div>
                </div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#FF4D4D' }}>J</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username">jazzhead_nyc</span>
                    <span className="chat-timestamp">2:13</span>
                  </div>
                  <div className="chat-text">the way that chord progression transitions is lowkey genius</div>
                </div>
              </div>
              <div className="chat-tip-event">
                <div className="tip-event-icon">💸</div>
                <div className="tip-event-text"><strong>@beathead99</strong> tipped <strong>$5</strong> — "keep going!!"</div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#FF9F47' }}>S</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username">soundchaser</span>
                    <span className="chat-timestamp">2:14</span>
                  </div>
                  <div className="chat-text">I literally discovered Metro here 3 weeks ago and now I check every day</div>
                </div>
              </div>
              <div className="chat-msg">
                <div className="chat-avatar" style={{ background: '#4DA6FF' }}>M</div>
                <div className="chat-msg-body">
                  <div className="chat-msg-header">
                    <span className="chat-username">musicmom_detroit</span>
                    <span className="chat-timestamp">2:14</span>
                  </div>
                  <div className="chat-text">when does this drop? I need this in my life</div>
                </div>
              </div>
            </div>

            <div className="chat-input-row">
              <input className="chat-input" type="text" placeholder="Say something..." id="chatInput" />
              <button className="chat-send-btn" id="chatSend">→</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --bg: #080806;
          --surface: #0f0f0c;
          --card: #141412;
          --card2: #1a1a17;
          --border: rgba(46,230,46,0.08);
          --border-bright: rgba(46,230,46,0.18);
          --text: #f0ede6;
          --muted: #6b6a60;
          --muted2: #3d3c34;
          --green: #2EE62E;
          --green-dim: rgba(46,230,46,0.1);
          --green-glow: rgba(46,230,46,0.25);
          --red: #FF4D4D;
          --red-dim: rgba(255,77,77,0.12);
          --teal: #3DD6C8;
          --cream: #f0ede6;
          --gold: #F5A623;
        }

        .topbar {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid var(--border);
          background: rgba(8,8,6,0.95);
          backdrop-filter: blur(20px);
          flex-shrink: 0;
          z-index: 50;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          cursor: pointer;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
          border: none;
          background: none;
        }

        .back-btn:hover { color: var(--text); }

        .topbar-divider {
          width: 1px;
          height: 20px;
          background: var(--border-bright);
        }

        .session-breadcrumb {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.04em;
        }

        .session-breadcrumb span { color: var(--text); }

        .topbar-center {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--red-dim);
          border: 1px solid rgba(255,77,77,0.25);
          border-radius: 20px;
          padding: 4px 12px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--red);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--red);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,77,77,0.5); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(255,77,77,0); }
        }

        .session-timer {
          font-family: 'Geist Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.08em;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .viewer-count {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 12px;
          color: var(--teal);
        }

        .viewer-count::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 8px var(--teal);
          display: block;
        }

        .share-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-bright);
          border-radius: 6px;
          padding: 6px 14px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: all 0.2s;
        }

        .share-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

        .follow-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--green-dim);
          border: 1px solid var(--border-bright);
          border-radius: 6px;
          padding: 6px 14px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--green);
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          transition: all 0.2s;
        }

        .follow-btn:hover {
          background: rgba(46,230,46,0.16);
          box-shadow: 0 0 20px rgba(46,230,46,0.1);
        }

        .room-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          flex: 1;
          overflow: hidden;
        }

        .stage-col {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-right: 1px solid var(--border);
        }

        .webcam-stage {
          position: relative;
          flex: 1;
          background: #0a0906;
          overflow: hidden;
          min-height: 0;
        }

        .webcam-feed {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .webcam-placeholder {
          width: 100%;
          height: 100%;
          background:
          radial-gradient(ellipse 60% 80% at 50% 40%,
          rgba(46,230,46,0.03) 0%,
          transparent 70%),
          linear-gradient(180deg, #0d0d0a 0%, #080806 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          position: relative;
        }

        .producer-silhouette {
          width: 220px;
          height: 300px;
          position: relative;
          margin-bottom: -20px;
        }

        .sil-head {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a14, #222218);
          border: 1px solid rgba(46,230,46,0.1);
          margin: 0 auto 0;
          position: relative;
          box-shadow: 0 0 40px rgba(46,230,46,0.06);
        }

        .sil-head::before {
          content: '';
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 60px;
          border: 3px solid rgba(46,230,46,0.2);
          border-bottom: none;
          border-radius: 55px 55px 0 0;
        }

        .sil-head::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 14px;
          background: rgba(46,230,46,0.15);
          border-radius: 3px;
        }

        .sil-body {
          width: 130px;
          height: 160px;
          background: linear-gradient(180deg, #181814 0%, #0f0f0c 100%);
          border: 1px solid rgba(46,230,46,0.06);
          border-radius: 65px 65px 0 0;
          margin: 12px auto 0;
          position: relative;
          overflow: hidden;
        }

        .studio-glow {
          position: absolute;
          width: 400px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(46,230,46,0.04) 0%, transparent 70%);
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
        }

        .equipment-row {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          margin-top: 8px;
          padding: 0 40px;
          opacity: 0.6;
        }

        .eq-knob {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(46,230,46,0.2);
          background: radial-gradient(circle at 35% 35%, #222, #111);
          position: relative;
          flex-shrink: 0;
        }

        .eq-knob::after {
          content: '';
          position: absolute;
          top: 4px; left: 50%;
          transform: translateX(-50%);
          width: 2px; height: 8px;
          background: var(--green);
          border-radius: 1px;
          opacity: 0.6;
        }

        .eq-fader {
          flex: 1;
          height: 60px;
          background: rgba(46,230,46,0.04);
          border: 1px solid rgba(46,230,46,0.1);
          border-radius: 4px;
          position: relative;
        }

        .eq-fader-thumb {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 22px; height: 10px;
          background: linear-gradient(135deg, #333, #222);
          border: 1px solid rgba(46,230,46,0.2);
          border-radius: 2px;
          top: var(--pos, 30%);
        }

        .webcam-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 20px; height: 20px;
          border-color: rgba(46,230,46,0.3);
          border-style: solid;
        }

        .corner-tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }

        .producer-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 60px 24px 20px;
          background: linear-gradient(to top, rgba(8,8,6,0.92) 0%, transparent 100%);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          pointer-events: none;
        }

        .producer-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .producer-name {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: var(--cream);
        }

        .producer-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .producer-tag {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .producer-genre {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--green);
          background: var(--green-dim);
          border: 1px solid var(--border-bright);
          padding: 2px 8px;
          border-radius: 3px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .collab-bubbles {
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: auto;
        }

        .collab-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: #000;
          margin-left: -8px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .collab-avatar:first-child { margin-left: 0; }
        .collab-avatar:hover { transform: scale(1.1); z-index: 2; }

        .collab-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.06em;
          margin-left: 4px;
        }

        .stems-strip {
          height: 130px;
          flex-shrink: 0;
          border-top: 1px solid var(--border);
          background: var(--surface);
          display: flex;
          flex-direction: column;
          padding: 12px 20px;
          gap: 6px;
          overflow: hidden;
        }

        .stems-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .stems-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .stems-bpm {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--green);
          letter-spacing: 0.08em;
        }

        .stem-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stem-name {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          width: 44px;
          flex-shrink: 0;
        }

        .stem-track {
          flex: 1;
          height: 18px;
          background: rgba(255,255,255,0.03);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 1px;
          padding: 0 3px;
        }

        .stem-wf-bar {
          flex: 1;
          border-radius: 1px;
          animation: stemWave var(--d, 0.9s) ease-in-out infinite alternate;
          animation-delay: var(--dl, 0s);
        }

        @keyframes stemWave {
          from { height: var(--min, 2px); }
          to { height: var(--max, 14px); }
        }

        .stem-active-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .right-panel {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--surface);
        }

        .session-info-card {
          padding: 18px 18px 14px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .session-title {
          font-family: 'Fraunces', serif;
          font-weight: 300;
          font-size: 17px;
          letter-spacing: -0.02em;
          color: var(--cream);
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .session-title em {
          font-style: italic;
          color: var(--green);
        }

        .session-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .session-meta-item {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.06em;
        }

        .session-meta-item span { color: var(--text); }

        .session-meta-sep { color: var(--muted2); font-size: 10px; }

        .tip-section {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .tip-label {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .tip-amounts {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }

        .tip-amount {
          flex: 1;
          padding: 8px 4px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tip-amount:hover,
        .tip-amount.selected {
          border-color: var(--green);
          color: var(--green);
          background: var(--green-dim);
        }

        .tip-send-btn {
          width: 100%;
          padding: 11px;
          background: var(--green);
          border: none;
          border-radius: 6px;
          font-family: 'Geist Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: #000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tip-send-btn:hover {
          box-shadow: 0 0 24px rgba(46,230,46,0.3);
          transform: translateY(-1px);
        }

        .chat-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          padding: 12px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .chat-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--muted);
        }

        .chat-online {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--teal);
          letter-spacing: 0.06em;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .chat-msg {
          display: flex;
          gap: 8px;
          animation: msgIn 0.3s ease both;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-avatar {
          width: 22px; height: 22px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Geist Mono', monospace;
          font-size: 8px;
          font-weight: 500;
          color: #000;
          margin-top: 1px;
        }

        .chat-msg-body { flex: 1; min-width: 0; }

        .chat-msg-header {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 2px;
        }

        .chat-username {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--text);
          letter-spacing: 0.04em;
        }

        .chat-username.producer-msg { color: var(--green); }

        .chat-timestamp {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          color: var(--muted2);
        }

        .chat-text {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.4;
          word-break: break-word;
        }

        .chat-text strong { color: var(--text); }

        .chat-tip-event {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(46,230,46,0.06);
          border: 1px solid var(--border-bright);
          border-radius: 6px;
          padding: 8px 12px;
          animation: msgIn 0.3s ease both;
        }

        .tip-event-icon { font-size: 14px; }

        .tip-event-text {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--muted);
        }

        .tip-event-text strong { color: var(--green); }

        .chat-input-row {
          padding: 12px 18px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 9px 14px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input::placeholder { color: var(--muted2); }
        .chat-input:focus { border-color: var(--border-bright); }

        .chat-send-btn {
          width: 36px; height: 36px;
          border-radius: 6px;
          background: var(--green-dim);
          border: 1px solid var(--border-bright);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .chat-send-btn:hover {
          background: rgba(46,230,46,0.18);
          box-shadow: 0 0 12px rgba(46,230,46,0.2);
        }

        .moment-toast {
          position: fixed;
          top: 66px;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: rgba(14,14,12,0.95);
          border: 1px solid var(--border-bright);
          border-radius: 8px;
          padding: 10px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: var(--muted);
          backdrop-filter: blur(20px);
          opacity: 0;
          animation: toastIn 0.4s ease 1.5s both, toastOut 0.4s ease 5s forwards;
          z-index: 200;
          pointer-events: none;
          white-space: nowrap;
        }

        .moment-toast strong { color: var(--green); }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @keyframes toastOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }

        .save-moment-btn {
          position: absolute;
          top: 16px;
          right: 50%;
          transform: translateX(50%);
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(8,8,6,0.8);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 6px 16px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: var(--text);
          cursor: pointer;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
          transition: all 0.2s;
          pointer-events: auto;
        }

        .save-moment-btn:hover {
          border-color: var(--green);
          color: var(--green);
          box-shadow: 0 0 16px rgba(46,230,46,0.15);
        }

        @media (max-width: 768px) {
          .room-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
          .stage-col { max-height: 55vh; }
          .webcam-stage { min-height: 260px; }
          .stems-strip { height: 100px; }
          .topbar { padding: 0 14px; }
          .topbar-center { display: none; }
          .session-breadcrumb { display: none; }
        }
      `}</style>
      </div>
    </>
  );
}
