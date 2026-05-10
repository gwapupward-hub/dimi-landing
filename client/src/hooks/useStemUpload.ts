import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function useStemUpload(sessionId: number) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getUploadUrl = trpc.uploads.getUploadUrl.useMutation();
  const confirmUpload = trpc.uploads.confirmUpload.useMutation();
  const utils = trpc.useUtils();

  const upload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const { uploadUrl, key, publicUrl } = await getUploadUrl.mutateAsync({
        sessionId,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
      });

      setProgress(20);

      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!putResponse.ok) {
        throw new Error(`S3 upload failed: ${putResponse.status}`);
      }
      setProgress(80);

      const stem = await confirmUpload.mutateAsync({
        sessionId,
        name: file.name,
        s3Key: key,
        s3Url: publicUrl,
        fileType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
      });
      setProgress(100);

      utils.uploads.listStems.invalidate({ sessionId });
      return stem;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
}
