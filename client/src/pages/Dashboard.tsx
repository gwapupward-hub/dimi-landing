import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, LogIn } from "lucide-react";
import { useLocation, Link } from "wouter";

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

      {/* Profile Summary Card + CTAs */}
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

            {/* Investor Brief — subtle muted link at bottom of sidebar */}
            <div className="pt-4 border-t border-gray-800">
              <Link
                href="/investor"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                View Investor Brief
              </Link>
            </div>
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

      {/* Past Sessions Table */}
      <section>
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Past Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Session</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Rights</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4 text-white">Dark Side of Midnight</td>
                  <td className="py-3 px-4 text-gray-400">Apr 2, 2026</td>
                  <td className="py-3 px-4 text-gray-400">2h 14m</td>
                  <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-900/50">Complete</span></td>
                  <td className="py-3 px-4 text-right">
                    <Link href="/rights" className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium">
                      Rights Workspace →
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4 text-white">Concrete Dreams v2</td>
                  <td className="py-3 px-4 text-gray-400">Mar 28, 2026</td>
                  <td className="py-3 px-4 text-gray-400">1h 47m</td>
                  <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-900/50">Complete</span></td>
                  <td className="py-3 px-4 text-right">
                    <Link href="/rights" className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium">
                      Rights Workspace →
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4 text-white">Neon Drift</td>
                  <td className="py-3 px-4 text-gray-400">Mar 22, 2026</td>
                  <td className="py-3 px-4 text-gray-400">3h 05m</td>
                  <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-900/50">Draft</span></td>
                  <td className="py-3 px-4 text-right">
                    <Link href="/rights" className="text-xs text-green-500 hover:text-green-400 transition-colors font-medium">
                      Rights Workspace →
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Placeholder Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
