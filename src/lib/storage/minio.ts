import { Client } from "minio";
import { Readable } from "stream";

// Initialize MinIO client
export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET = process.env.MINIO_BUCKET || "coursekit";

// Ensure bucket exists
export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
    // Set bucket policy to allow public read for certain paths
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET}/public/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(BUCKET, JSON.stringify(policy));
  }
}

export class AssetStorage {
  /**
   * Upload a file from a buffer
   */
  static async upload(
    key: string,
    buffer: Buffer,
    metadata: Record<string, string> = {}
  ): Promise<string> {
    await ensureBucket();
    await minioClient.putObject(BUCKET, key, buffer, buffer.length, metadata);
    return key;
  }

  /**
   * Upload a file from a stream
   */
  static async uploadStream(
    key: string,
    stream: Readable,
    size: number,
    metadata: Record<string, string> = {}
  ): Promise<string> {
    await ensureBucket();
    await minioClient.putObject(BUCKET, key, stream, size, metadata);
    return key;
  }

  /**
   * Get a presigned URL for downloading
   */
  static async getSignedUrl(key: string, expirySeconds = 3600): Promise<string> {
    return await minioClient.presignedGetObject(BUCKET, key, expirySeconds);
  }

  /**
   * Get a presigned URL for uploading
   */
  static async getUploadUrl(key: string, expirySeconds = 3600): Promise<string> {
    return await minioClient.presignedPutObject(BUCKET, key, expirySeconds);
  }

  /**
   * Download a file to buffer
   */
  static async download(key: string): Promise<Buffer> {
    const stream = await minioClient.getObject(BUCKET, key);
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  /**
   * Get object metadata
   */
  static async getMetadata(key: string) {
    return await minioClient.statObject(BUCKET, key);
  }

  /**
   * Delete an object
   */
  static async delete(key: string): Promise<void> {
    await minioClient.removeObject(BUCKET, key);
  }

  /**
   * Delete multiple objects
   */
  static async deleteMany(keys: string[]): Promise<void> {
    await minioClient.removeObjects(BUCKET, keys);
  }

  /**
   * Copy an object
   */
  static async copy(sourceKey: string, destKey: string): Promise<void> {
    await minioClient.copyObject(
      BUCKET,
      destKey,
      `/${BUCKET}/${sourceKey}`,
      null
    );
  }

  /**
   * List objects with prefix
   */
  static async list(prefix: string, recursive = true): Promise<string[]> {
    const objects: string[] = [];
    const stream = minioClient.listObjects(BUCKET, prefix, recursive);
    
    return new Promise((resolve, reject) => {
      stream.on("data", (obj) => objects.push(obj.name));
      stream.on("end", () => resolve(objects));
      stream.on("error", reject);
    });
  }

  /**
   * Generate a consistent key for course assets
   */
  static generateKey(
    courseId: string,
    type: "images" | "videos" | "documents" | "audio" | "general",
    filename: string
  ): string {
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `courses/${courseId}/${type}/${timestamp}-${sanitized}`;
  }

  /**
   * Get public URL for an asset (if bucket is public)
   */
  static getPublicUrl(key: string): string {
    const publicUrl = process.env.MINIO_PUBLIC_URL;
    if (publicUrl) {
      return `${publicUrl}/${BUCKET}/${key}`;
    }
    
    const endpoint = process.env.MINIO_ENDPOINT || "localhost";
    const port = process.env.MINIO_PORT || 9000;
    const protocol = process.env.MINIO_SSL === "true" ? "https" : "http";
    return `${protocol}://${endpoint}:${port}/${BUCKET}/${key}`;
  }

  /**
   * Check if an object exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      await minioClient.statObject(BUCKET, key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create a multipart upload for large files
   */
  static async createMultipartUpload(key: string) {
    // MinIO client handles multipart uploads automatically for putObject
    // This is a placeholder for if you need more control
    return {
      uploadId: `multipart-${Date.now()}`,
      key,
    };
  }
}

// Utility function to get asset URL with fallback
export async function getAssetUrl(
  key: string | null | undefined,
  options: {
    fallback?: string;
    expiry?: number;
    transform?: { width?: number; height?: number; quality?: number };
  } = {}
): Promise<string> {
  if (!key) {
    return options.fallback || "/placeholder.jpg";
  }

  try {
    // For now, return signed URL
    // In production, you might want to use a CDN or image optimization service
    const url = await AssetStorage.getSignedUrl(key, options.expiry);
    
    // If transform options are provided, you could integrate with an image service
    if (options.transform) {
      // Example: integrate with a service like Cloudinary or imgix
      // return transformImageUrl(url, options.transform);
    }
    
    return url;
  } catch (error) {
    console.error(`Failed to get asset URL for ${key}:`, error);
    return options.fallback || "/placeholder.jpg";
  }
}

// Helper to determine asset type from filename
export function getAssetType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const typeMap: Record<string, string> = {
    // Images
    jpg: "images",
    jpeg: "images",
    png: "images",
    gif: "images",
    webp: "images",
    svg: "images",
    
    // Videos
    mp4: "videos",
    webm: "videos",
    mov: "videos",
    avi: "videos",
    
    // Audio
    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    m4a: "audio",
    
    // Documents
    pdf: "documents",
    doc: "documents",
    docx: "documents",
    ppt: "documents",
    pptx: "documents",
    xls: "documents",
    xlsx: "documents",
    
    // Default
    default: "general",
  };
  
  return typeMap[ext || ""] || typeMap.default;
}
