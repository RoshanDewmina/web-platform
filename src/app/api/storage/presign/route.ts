import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
const region = process.env.S3_REGION || "us-east-1";
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "minioadmin";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "minioadmin";
const bucket = process.env.S3_BUCKET || "uploads";

const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

export async function POST(req: NextRequest) {
  try {
    const { key, contentType } = await req.json();
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

    const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType || "application/octet-stream" });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    return NextResponse.json({ url, bucket, key });
  } catch (e) {
    console.error("presign error", e);
    return NextResponse.json({ error: "Failed to presign" }, { status: 500 });
  }
}


