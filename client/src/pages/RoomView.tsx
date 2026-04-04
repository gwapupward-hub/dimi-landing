import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { Loader2, ArrowLeft, Globe, Lock } from "lucide-react";

export default function RoomView() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/app/rooms/:id");
  const roomId = params?.id ? parseInt(params.id, 10) : null;

  const { data: room, isLoading, error } = trpc.room.getById.useQuery(
    { roomId: roomId! },
    { enabled: !!roomId && !isNaN(roomId!) }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <button
          onClick={() => setLocation("/app")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Dashboard</span>
        </button>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">Room not found</p>
          <p className="text-gray-500 text-sm mt-2">
            This room may have been removed or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const statusLabel =
    room.status === "live"
      ? "Live"
      : room.status === "ended"
      ? "Ended"
      : "Idle";

  const statusColor =
    room.status === "live"
      ? "bg-green-500"
      : room.status === "ended"
      ? "bg-gray-500"
      : "bg-yellow-500";

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Back */}
      <button
        onClick={() => setLocation("/app")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      {/* Room Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{room.roomName}</h1>
            {room.description && (
              <p className="text-gray-400 mt-2">{room.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${statusColor}`}
            />
            <span className="text-sm text-gray-400">{statusLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            {room.visibility === "public" ? (
              <Globe size={14} />
            ) : (
              <Lock size={14} />
            )}
            {room.visibility === "public" ? "Public" : "Private"}
          </span>
          <span>
            Created{" "}
            {new Date(room.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-12 text-center">
        <div className="text-gray-500 space-y-2">
          <p className="text-lg font-medium text-gray-400">
            Room is ready
          </p>
          <p className="text-sm">
            Live streaming, chat, and collaboration features are coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
