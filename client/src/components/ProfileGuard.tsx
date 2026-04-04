import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface ProfileGuardProps {
  children: React.ReactNode;
  requireProfile?: boolean; // If true, user must have a profile; if false, user must NOT have a profile
}

/**
 * ProfileGuard enforces profile completion state:
 * - requireProfile=true: redirects to /onboarding/profile if no profile
 * - requireProfile=false: redirects to /app if profile already exists
 * - Used for /app (requires profile) and /onboarding/profile (must not have profile)
 */
export function ProfileGuard({ children, requireProfile = true }: ProfileGuardProps) {
  const [, navigate] = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Query to check if user has a profile
  const profileQuery = trpc.profile.me.useQuery();

  useEffect(() => {
    // Wait for profile query to complete
    if (profileQuery.isLoading) {
      return;
    }

    const hasProfile = !!profileQuery.data;

    if (requireProfile && !hasProfile) {
      // User needs a profile but doesn't have one
      navigate("/onboarding/profile");
    } else if (!requireProfile && hasProfile) {
      // User shouldn't have a profile but does
      navigate("/app");
    } else {
      // Profile state is correct, allow access
      setIsReady(true);
    }
  }, [profileQuery.data, profileQuery.isLoading, requireProfile, navigate]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
