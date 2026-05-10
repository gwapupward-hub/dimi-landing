import type { WebSocket } from "ws";
import {
  addClient,
  removeClient,
  broadcast,
  setLive,
  getOrCreateRoom,
  type RoomClient,
} from "./roomManager";

interface IncomingMessage {
  type: "join" | "go_live" | "end_live" | "chat" | "stem_play" | "stem_mute";
  roomId: string;
  userId?: number;
  displayName?: string;
  text?: string;
  stemId?: string;
}

export function handleConnection(ws: WebSocket) {
  let registeredClient: RoomClient | null = null;
  let registeredRoomId: string | null = null;

  ws.on("message", raw => {
    let msg: IncomingMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    const { type, roomId } = msg;
    if (typeof roomId !== "string" || !roomId) return;

    if (type === "join") {
      registeredClient = {
        ws,
        userId: msg.userId ?? null,
        displayName: msg.displayName ?? "Anonymous",
      };
      registeredRoomId = roomId;
      addClient(roomId, registeredClient);

      const room = getOrCreateRoom(roomId);
      ws.send(
        JSON.stringify({
          type: "room_state",
          isLive: room.isLive,
          viewerCount: room.viewerCount,
        })
      );
      broadcast(roomId, { type: "viewer_count", count: room.viewerCount }, registeredClient);
      return;
    }

    if (!registeredClient || !registeredRoomId) return;

    if (type === "go_live") {
      setLive(roomId, true, msg.userId ?? null);
      broadcast(roomId, { type: "live_started", hostName: registeredClient.displayName });
      return;
    }

    if (type === "end_live") {
      setLive(roomId, false, msg.userId ?? null);
      broadcast(roomId, { type: "live_ended" });
      return;
    }

    if (type === "chat") {
      if (typeof msg.text !== "string" || !msg.text.trim()) return;
      broadcast(roomId, {
        type: "chat",
        from: registeredClient.displayName,
        text: msg.text.slice(0, 500),
        ts: Date.now(),
      });
      return;
    }

    if (type === "stem_play" || type === "stem_mute") {
      broadcast(
        roomId,
        {
          type,
          stemId: msg.stemId,
          from: registeredClient.displayName,
        },
        registeredClient
      );
      return;
    }
  });

  ws.on("close", () => {
    if (registeredClient && registeredRoomId) {
      removeClient(registeredRoomId, registeredClient);
      const room = getOrCreateRoom(registeredRoomId);
      broadcast(registeredRoomId, { type: "viewer_count", count: room.viewerCount });
    }
  });

  ws.on("error", err => {
    console.warn("[ws] client error:", err);
  });
}
