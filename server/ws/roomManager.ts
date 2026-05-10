import type { WebSocket } from "ws";

export interface RoomClient {
  ws: WebSocket;
  userId: number | null;
  displayName: string;
}

export interface RoomState {
  roomId: string;
  isLive: boolean;
  hostUserId: number | null;
  clients: Set<RoomClient>;
  viewerCount: number;
}

const rooms = new Map<string, RoomState>();

export function getOrCreateRoom(roomId: string): RoomState {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      roomId,
      isLive: false,
      hostUserId: null,
      clients: new Set(),
      viewerCount: 0,
    };
    rooms.set(roomId, room);
  }
  return room;
}

export function addClient(roomId: string, client: RoomClient): void {
  const room = getOrCreateRoom(roomId);
  room.clients.add(client);
  room.viewerCount = room.clients.size;
}

export function removeClient(roomId: string, client: RoomClient): void {
  const room = rooms.get(roomId);
  if (!room) return;
  room.clients.delete(client);
  room.viewerCount = room.clients.size;
  if (room.clients.size === 0) {
    rooms.delete(roomId);
  }
}

export function broadcast(roomId: string, message: object, exclude?: RoomClient): void {
  const room = rooms.get(roomId);
  if (!room) return;
  const payload = JSON.stringify(message);
  room.clients.forEach(client => {
    if (client === exclude) return;
    if (client.ws.readyState === 1 /* OPEN */) {
      try {
        client.ws.send(payload);
      } catch (err) {
        console.warn("[ws] broadcast send failed:", err);
      }
    }
  });
}

export function setLive(roomId: string, isLive: boolean, hostUserId: number | null): void {
  const room = getOrCreateRoom(roomId);
  room.isLive = isLive;
  room.hostUserId = hostUserId;
}
