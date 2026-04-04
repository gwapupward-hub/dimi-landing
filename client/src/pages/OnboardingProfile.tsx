import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarPlaceholderSelector, AvatarUpload, AvatarPreview } from "@/components/AvatarPlaceholder";

const CREATOR_ROLES = [
  { id: "producer", label: "Producer" },
  { id: "engineer", label: "Engineer" },
  { id: "artist", label: "Artist" },
  { id: "composer", label: "Composer" },
  { id: "beatmaker", label: "Beat Maker" },
];

export default function OnboardingProfile() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    creatorRole: "producer",
    avatarFile: null as File | null,
    avatarPlaceholderId: "green",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProfileMutation = trpc.profile.create.useMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters";
    } else if (formData.displayName.length > 255) {
      newErrors.displayName = "Display name must be less than 255 characters";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      displayName: e.target.value,
    }));
    if (errors.displayName) {
      setErrors((prev) => ({
        ...prev,
        displayName: "",
      }));
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));
    if (errors.bio) {
      setErrors((prev) => ({
        ...prev,
        bio: "",
      }));
    }
  };

  const handleAvatarFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "File size must be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      avatarFile: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (errors.avatar) {
      setErrors((prev) => ({
        ...prev,
        avatar: "",
      }));
    }
  };

  const handlePlaceholderSelect = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      avatarPlaceholderId: id,
      avatarFile: null,
    }));
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // If there's an avatar file, we'll need to upload it first
      let avatarUrl = null;
      if (formData.avatarFile) {
        // For now, we'll pass the file data as base64
        // In a production app, you'd upload to S3 first
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          await createProfileMutation.mutateAsync({
            displayName: formData.displayName,
            bio: formData.bio,
            creatorRole: formData.creatorRole,
            avatarUrl: base64,
          });
          navigate("/app");
        };
        reader.readAsDataURL(formData.avatarFile);
      } else {
        // Use placeholder
        await createProfileMutation.mutateAsync({
          displayName: formData.displayName,
          bio: formData.bio,
          creatorRole: formData.creatorRole,
          avatarPlaceholderId: formData.avatarPlaceholderId,
        });
        navigate("/app");
      }
    } catch (error: any) {
      const message = error?.message || "Failed to create profile";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
            <CardDescription className="text-slate-400">
              Set up your DIMI profile to get started creating and collaborating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                  {errors.form}
                </div>
              )}

              {/* Avatar Preview */}
              <div className="flex justify-center">
                <AvatarPreview
                  src={avatarPreview || undefined}
                  placeholderId={!avatarPreview ? formData.avatarPlaceholderId : undefined}
                  displayName={formData.displayName}
                />
              </div>

              {/* Avatar Upload */}
              <AvatarUpload onFileSelect={handleAvatarFileSelect} isLoading={isSubmitting} />

              {/* Avatar Placeholder Selector */}
              {!avatarPreview && (
                <AvatarPlaceholderSelector
                  selectedId={formData.avatarPlaceholderId}
                  onSelect={handlePlaceholderSelect}
                />
              )}

              {/* Display Name */}
              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-200">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your display name"
                  value={formData.displayName}
                  onChange={handleDisplayNameChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={isSubmitting}
                  maxLength={255}
                />
                {errors.displayName && (
                  <p className="text-xs text-red-400">{errors.displayName}</p>
                )}
                <p className="text-xs text-slate-500">
                  {formData.displayName.length}/255 characters
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-slate-200">
                  Bio <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleBioChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                  disabled={isSubmitting}
                  maxLength={500}
                />
                {errors.bio && (
                  <p className="text-xs text-red-400">{errors.bio}</p>
                )}
                <p className="text-xs text-slate-500">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Creator Role */}
              <div className="space-y-2">
                <label htmlFor="creatorRole" className="block text-sm font-medium text-slate-200">
                  Creator Role
                </label>
                <select
                  id="creatorRole"
                  value={formData.creatorRole}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      creatorRole: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                >
                  {CREATOR_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating profile..." : "Complete Profile"}
              </Button>

              <p className="text-center text-sm text-slate-400">
                You can edit your profile later in settings
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
