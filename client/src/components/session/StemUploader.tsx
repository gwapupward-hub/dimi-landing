import { useRef } from "react";
import { useStemUpload } from "@/hooks/useStemUpload";

const ACCEPTED = [
  "audio/wav",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/aiff",
  "audio/x-aiff",
  "audio/ogg",
];

interface Props {
  sessionId: number;
  onUploaded?: () => void;
}

export function StemUploader({ sessionId, onUploaded }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress, error } = useStemUpload(sessionId);

  const handleFile = async (file: File) => {
    if (file.type && !ACCEPTED.includes(file.type)) return;
    try {
      await upload(file);
      onUploaded?.();
    } catch {
      // surfaced via `error` state
    }
  };

  return (
    <div
      className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#2EE62E]/50 transition group"
      onClick={() => input.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {uploading ? (
        <div className="space-y-2">
          <p className="text-white/60 text-sm">Uploading… {progress}%</p>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2EE62E] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <>
          <p className="text-white/40 group-hover:text-white/60 transition text-sm">
            Drop stem / beat here or click to browse
          </p>
          <p className="text-white/20 text-xs mt-1">WAV · MP3 · AIFF · OGG</p>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}
