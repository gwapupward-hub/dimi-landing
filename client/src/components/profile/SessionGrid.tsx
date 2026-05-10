import { useLocation } from "wouter";

interface Session {
  id: number;
  title: string;
  genre: string | null;
  bpm: number | null;
  viewers: number;
  collaborators: number;
  isLive: number;
  color: string;
}

export function SessionGrid({ sessions }: { sessions: Session[] }) {
  const [, setLocation] = useLocation();

  if (sessions.length === 0) {
    return <p className="text-white/40 text-sm">No sessions yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map(s => (
        <button
          key={s.id}
          onClick={() => setLocation(`/session?room=${s.id}`)}
          className="text-left p-5 rounded-xl border border-white/10 bg-black/40 hover:border-[#2EE62E]/40 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="w-8 h-8 rounded-md"
              style={{ background: s.color }}
            />
            {s.isLive === 1 && (
              <span className="text-[#2EE62E] text-xs font-bold uppercase">● Live</span>
            )}
          </div>
          <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-[#2EE62E] transition">
            {s.title}
          </h3>
          <p className="text-white/40 text-xs">
            {s.genre ?? "—"} · {s.bpm ?? "—"} BPM
          </p>
          <p className="text-white/30 text-xs mt-2">
            {s.viewers.toLocaleString()} viewers · {s.collaborators} collab
          </p>
        </button>
      ))}
    </div>
  );
}
