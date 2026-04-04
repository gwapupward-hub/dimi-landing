import { useState } from "react";

interface AvatarPlaceholderOption {
  id: string;
  initials: string;
  bgColor: string;
  textColor: string;
  label: string;
}

const AVATAR_PLACEHOLDERS: AvatarPlaceholderOption[] = [
  { id: "green", initials: "DM", bgColor: "#2EE62E", textColor: "#000000", label: "Green" },
  { id: "blue", initials: "DM", bgColor: "#0066FF", textColor: "#FFFFFF", label: "Blue" },
  { id: "purple", initials: "DM", bgColor: "#8B5CF6", textColor: "#FFFFFF", label: "Purple" },
  { id: "pink", initials: "DM", bgColor: "#EC4899", textColor: "#FFFFFF", label: "Pink" },
  { id: "orange", initials: "DM", bgColor: "#FF6B35", textColor: "#FFFFFF", label: "Orange" },
  { id: "cyan", initials: "DM", bgColor: "#06B6D4", textColor: "#000000", label: "Cyan" },
];

interface AvatarPlaceholderSelectorProps {
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function AvatarPlaceholderSelector({ selectedId, onSelect }: AvatarPlaceholderSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-200">Choose a placeholder avatar</label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {AVATAR_PLACEHOLDERS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative w-16 h-16 rounded-lg transition-all ${
              selectedId === option.id
                ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-green-500"
                : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 hover:ring-slate-600"
            }`}
            style={{
              backgroundColor: option.bgColor,
            }}
            title={option.label}
          >
            <span
              className="text-lg font-bold"
              style={{ color: option.textColor }}
            >
              {option.initials.charAt(0)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface AvatarUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function AvatarUpload({ onFileSelect, isLoading }: AvatarUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-200">Upload a custom avatar</label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-green-500 bg-green-500/10"
            : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="pointer-events-none">
          <p className="text-slate-300 font-medium">Drag and drop your image here</p>
          <p className="text-slate-400 text-sm mt-1">or click to select a file</p>
          <p className="text-slate-500 text-xs mt-2">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>
    </div>
  );
}

interface AvatarPreviewProps {
  src?: string;
  placeholderId?: string;
  displayName?: string;
}

export function AvatarPreview({ src, placeholderId, displayName }: AvatarPreviewProps) {
  if (src) {
    return (
      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-700">
        <img src={src} alt="Avatar preview" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (placeholderId) {
    const placeholder = AVATAR_PLACEHOLDERS.find((p) => p.id === placeholderId);
    if (placeholder) {
      return (
        <div
          className="w-24 h-24 rounded-lg flex items-center justify-center border-2 border-slate-700 font-bold text-2xl"
          style={{
            backgroundColor: placeholder.bgColor,
            color: placeholder.textColor,
          }}
        >
          {displayName?.charAt(0).toUpperCase() || "D"}
        </div>
      );
    }
  }

  return (
    <div className="w-24 h-24 rounded-lg bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
      <span className="text-slate-500 text-sm">No avatar</span>
    </div>
  );
}
