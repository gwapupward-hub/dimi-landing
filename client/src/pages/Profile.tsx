import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SessionGrid } from "@/components/profile/SessionGrid";

export default function ProfilePage() {
  const [, params] = useRoute<{ handle: string }>("/u/:handle");
  const handle = params?.handle ?? "";

  const { data: creator, isLoading, error } = trpc.profiles.getByHandle.useQuery(
    { handle },
    { enabled: !!handle }
  );

  const { data: sessions } = trpc.profiles.getSessionsByCreator.useQuery(
    { creatorId: creator?.id ?? 0 },
    { enabled: !!creator }
  );

  if (!handle) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/40">
        Invalid handle.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/40">
        Loading...
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/40">
        Producer not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader creator={creator} />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-white/60 mb-6 uppercase tracking-wider">
          Sessions
        </h2>
        <SessionGrid sessions={sessions ?? []} />
      </div>
    </div>
  );
}
