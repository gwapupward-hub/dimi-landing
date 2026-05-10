import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: process.env.AWS_REGION ?? "us-east-1",
    });
  }
  return _client;
}

function getBucket(): string {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }
  return bucket;
}

export async function createUploadUrl(sessionId: number, fileName: string, fileType: string) {
  const ext = fileName.includes(".") ? fileName.split(".").pop()! : "bin";
  const key = `sessions/${sessionId}/stems/${nanoid()}.${ext}`;
  const bucket = getBucket();
  const region = process.env.AWS_REGION ?? "us-east-1";

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
    Metadata: { sessionId: String(sessionId) },
  });

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 300 });
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function createDownloadUrl(key: string) {
  const bucket = getBucket();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(getClient(), command, { expiresIn: 3600 });
}
