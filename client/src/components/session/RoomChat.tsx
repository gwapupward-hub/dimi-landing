import { useState } from "react";
import type { ChatMessage } from "@/hooks/useRoomSocket";

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

export function RoomChat({ messages, onSend }: Props) {
  const [input, setInput] = useState("");

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full border border-white/10 rounded-lg overflow-hidden bg-black/40">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
        {messages.length === 0 && (
          <p className="text-white/30 text-xs italic">No messages yet. Be the first to say something.</p>
        )}
        {messages.map((m, i) => (
          <div key={`${m.ts}-${i}`}>
            <span className="text-[#2EE62E] font-semibold mr-1">{m.from}</span>
            <span className="text-white/80">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex border-t border-white/10">
        <input
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
          placeholder="Say something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") submit();
          }}
        />
        <button
          onClick={submit}
          className="px-4 text-[#2EE62E] text-sm font-semibold hover:bg-white/5 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
