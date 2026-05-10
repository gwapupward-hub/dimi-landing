import { useEffect, useRef, useCallback, useState } from "react";

export interface ChatMessage {
  from: string;
  text: string;
  ts: number;
}

export interface RoomSocketState {
  isLive: boolean;
  viewerCount: number;
  messages: ChatMessage[];
  connected: boolean;
}

interface UseRoomSocketOptions {
  roomId: string;
  userId?: number;
  displayName?: string;
}

export function useRoomSocket({ roomId, userId, displayName }: UseRoomSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [state, setState] = useState<RoomSocketState>({
    isLive: false,
    viewerCount: 0,
    messages: [],
    connected: false,
  });

  useEffect(() => {
    if (!roomId) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws/room`);
    ws.current = socket;

    socket.onopen = () => {
      setState(s => ({ ...s, connected: true }));
      socket.send(JSON.stringify({ type: "join", roomId, userId, displayName }));
    };

    socket.onmessage = e => {
      let msg: any;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      if (msg.type === "room_state") {
        setState(s => ({ ...s, isLive: !!msg.isLive, viewerCount: msg.viewerCount ?? 0 }));
      } else if (msg.type === "viewer_count") {
        setState(s => ({ ...s, viewerCount: msg.count ?? 0 }));
      } else if (msg.type === "live_started") {
        setState(s => ({ ...s, isLive: true }));
      } else if (msg.type === "live_ended") {
        setState(s => ({ ...s, isLive: false }));
      } else if (msg.type === "chat") {
        setState(s => ({
          ...s,
          messages: [...s.messages, { from: msg.from, text: msg.text, ts: msg.ts }],
        }));
      }
    };

    socket.onclose = () => setState(s => ({ ...s, connected: false }));
    socket.onerror = () => setState(s => ({ ...s, connected: false }));

    return () => {
      socket.close();
    };
  }, [roomId, userId, displayName]);

  const sendChat = useCallback(
    (text: string) => {
      ws.current?.send(JSON.stringify({ type: "chat", roomId, text }));
    },
    [roomId]
  );

  const goLive = useCallback(() => {
    ws.current?.send(JSON.stringify({ type: "go_live", roomId, userId }));
  }, [roomId, userId]);

  const endLive = useCallback(() => {
    ws.current?.send(JSON.stringify({ type: "end_live", roomId, userId }));
  }, [roomId, userId]);

  const signalStem = useCallback(
    (stemId: string, action: "play" | "mute") => {
      ws.current?.send(
        JSON.stringify({
          type: action === "play" ? "stem_play" : "stem_mute",
          roomId,
          stemId,
        })
      );
    },
    [roomId]
  );

  return { state, sendChat, goLive, endLive, signalStem };
}
