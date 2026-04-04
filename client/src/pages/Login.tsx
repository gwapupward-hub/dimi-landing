import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      // Redirect based on profile completion status
      if (result.hasProfile) {
        navigate("/app");
      } else {
        navigate("/onboarding/profile");
      }
    } catch (error: any) {
      const message = error?.message || "Login failed";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your DIMI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-slate-200">
                Email or Username
              </label>
              <Input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                placeholder="you@example.com or your_username"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              {errors.emailOrUsername && (
                <p className="text-xs text-red-400">{errors.emailOrUsername}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
