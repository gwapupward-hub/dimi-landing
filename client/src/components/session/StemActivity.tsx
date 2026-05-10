import { useEffect, useState } from "react";

export interface StemSignal {
  stemId: string;
  from: string;
  action: "play" | "mute";
  ts: number;
}

export function StemActivity({ signals }: { signals: StemSignal[] }) {
  const [visible, setVisible] = useState<StemSignal[]>([]);

  useEffect(() => {
    setVisible(signals.slice(-3));
    const id = setTimeout(() => setVisible([]), 4000);
    return () => clearTimeout(id);
  }, [signals]);

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 text-xs font-mono text-white/60">
      {visible.map(s => (
        <div key={`${s.ts}-${s.stemId}`} className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${s.action === "play" ? "bg-[#2EE62E]" : "bg-white/30"}`}
          />
          <span className="text-[#2EE62E]">{s.from}</span>
          <span>{s.action === "play" ? "played" : "muted"}</span>
          <span className="text-white/40">{s.stemId}</span>
        </div>
      ))}
    </div>
  );
}
