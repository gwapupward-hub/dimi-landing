import { WebSocketServer } from "ws";
import type { Server } from "http";
import { handleConnection } from "./handlers";

export function attachWebSocket(httpServer: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/ws/room")) {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
      });
    }
    // Don't destroy the socket here — Vite's HMR uses upgrade for its own
    // WebSocket. Let other handlers (e.g. vite-dev-server) take it.
  });

  wss.on("connection", handleConnection);
  console.log("[ws] WebSocket server attached at /ws/room");
}
