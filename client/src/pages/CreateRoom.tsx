import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft, Globe, Lock } from "lucide-react";

export default function CreateRoom() {
  const [, setLocation] = useLocation();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [errors, setErrors] = useState<{ roomName?: string; general?: string }>({});

  const createMutation = trpc.room.create.useMutation({
    onSuccess: (data) => {
      setLocation(`/app/rooms/${data.room.id}`);
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!roomName.trim()) {
      newErrors.roomName = "Room name is required";
    } else if (roomName.trim().length > 100) {
      newErrors.roomName = "Room name must be 100 characters or fewer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createMutation.mutate({
      roomName: roomName.trim(),
      description: description.trim() || undefined,
      visibility,
    });
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Back Button */}
      <button
        onClick={() => setLocation("/app")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create a Room</h1>
        <p className="text-gray-400">
          Set up a new session space. Keep it simple — you can always update
          details later.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-gray-900 border-gray-800 p-6 space-y-6">
          {/* Room Name */}
          <div className="space-y-2">
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-300"
            >
              Room Name <span className="text-red-500">*</span>
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                if (errors.roomName) setErrors((prev) => ({ ...prev, roomName: undefined }));
              }}
              placeholder="e.g. Late Night Beats"
              maxLength={100}
              className={`w-full bg-black border ${
                errors.roomName ? "border-red-500" : "border-gray-700"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors`}
            />
            {errors.roomName && (
              <p className="text-red-500 text-xs">{errors.roomName}</p>
            )}
            <p className="text-gray-500 text-xs text-right">
              {roomName.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the vibe? What are you working on?"
              maxLength={500}
              rows={3}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <p className="text-gray-500 text-xs text-right">
              {description.length}/500
            </p>
          </div>

          {/* Visibility */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Visibility <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  visibility === "private"
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-700 bg-black hover:border-gray-600"
                }`}
              >
                <Lock
                  size={18}
                  className={
                    visibility === "private"
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      visibility === "private"
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    Private
                  </p>
                  <p className="text-xs text-gray-500">Invite only</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  visibility === "public"
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-700 bg-black hover:border-gray-600"
                }`}
              >
                <Globe
                  size={18}
                  className={
                    visibility === "public"
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      visibility === "public"
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  >
                    Public
                  </p>
                  <p className="text-xs text-gray-500">Anyone can join</p>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/app")}
              className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
