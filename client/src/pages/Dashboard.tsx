import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, LogIn } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } =
    trpc.profile.me.useQuery();

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile.displayName}
          </h1>
          <p className="text-gray-400">
            Ready to create something amazing? Start a new room or join an
            existing one.
          </p>
        </div>
      </section>

      {/* Profile Summary Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800 p-6 md:col-span-1">
          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-bold text-2xl">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">
                {profile.displayName}
              </h2>
              <p className="text-sm text-green-500 font-medium">
                {profile.creatorRole === "producer"
                  ? "Producer"
                  : profile.creatorRole === "engineer"
                    ? "Engineer"
                    : "Creator"}
              </p>
              {profile.bio && (
                <p className="text-sm text-gray-400 line-clamp-3">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Edit Profile Link */}
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* CTAs Section */}
        <div className="md:col-span-2 space-y-4">
          {/* Create Room CTA */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-900/50 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Create a Room
                </h3>
                <p className="text-sm text-gray-400">
                  Start a live session and invite collaborators to create music
                  together in real time.
                </p>
              </div>
              <Button
                onClick={() => setLocation("/app/rooms/create")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                <Plus size={16} className="mr-2" />
                Create Room
              </Button>
            </div>
          </Card>

          {/* Join Room CTA */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-900/50 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Join a Room
                </h3>
                <p className="text-sm text-gray-400">
                  Collaborate with other producers or join an existing live
                  session.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full border-blue-900 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                <LogIn size={16} className="mr-2" />
                Browse Rooms
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Placeholder Sections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Sessions</h3>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No sessions yet</p>
            <p className="text-gray-500 text-xs mt-2">
              Your recent sessions will appear here
            </p>
          </div>
        </Card>

        {/* Live Activity */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Live Activity</h3>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No active sessions</p>
            <p className="text-gray-500 text-xs mt-2">
              Your live activity will appear here
            </p>
          </div>
        </Card>

        {/* Session Stats */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Session Stats</h3>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No data yet</p>
            <p className="text-gray-500 text-xs mt-2">
              Streaming stats will appear after your first session
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
