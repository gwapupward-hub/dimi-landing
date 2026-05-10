import { useRef, useState } from "react";

interface Props {
  name: string;
  url: string;
}

export function StemPlayer({ name, url }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded border border-white/10 bg-black/40">
      <button
        onClick={toggle}
        className="w-7 h-7 rounded-full bg-[#2EE62E]/15 border border-[#2EE62E]/40 text-[#2EE62E] text-xs flex items-center justify-center hover:bg-[#2EE62E]/25 transition"
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <span className="text-white/80 text-sm truncate">{name}</span>
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        preload="none"
      />
    </div>
  );
}
