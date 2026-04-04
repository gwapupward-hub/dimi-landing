import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";

export default function OnboardingProfile() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-slate-400">
              Welcome to DIMI, {(user as any)?.username}! Set up your profile to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
              <p className="text-slate-300 mb-4">
                Profile setup is coming soon. For now, you can explore the platform.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/app")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to App
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
