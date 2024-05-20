import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY as string;
const secretAccessKey = process.env.S3_SECRET_KEY as string;
const client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const file = searchParams.get("file");

  if (!file) {
    return Response.json(
      { error: "File query parameter is required" },
      { status: 400 }
    );
  }

  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file,
  });

  const getCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file,
  });

  const url = await getSignedUrl(client, putCommand, { expiresIn: 60 });
  const getUrl = await getSignedUrl(client, getCommand, { expiresIn: 60 });
  return Response.json({ uploadUrl: url, downloadUrl: getUrl });
}
