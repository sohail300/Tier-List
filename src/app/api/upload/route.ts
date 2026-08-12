import { NextResponse } from "next/server";
import { requireDbUser } from "@/lib/auth";
import { SUPABASE_UPLOAD_BUCKET, supabaseAdmin } from "@/lib/supabase";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(request: Request) {
  let userId: string;
  try {
    const user = await requireDbUser();
    userId = user.id;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("file")
    .filter((entry): entry is File => entry instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }
  if (files.some((file) => !ALLOWED_IMAGE_TYPES.has(file.type))) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WEBP, GIF, or AVIF images are allowed" },
      { status: 400 },
    );
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabaseAdmin.storage
        .from(SUPABASE_UPLOAD_BUCKET)
        .upload(path, file, { contentType: file.type });
      if (error) {
        return null;
      }
      return supabaseAdmin.storage
        .from(SUPABASE_UPLOAD_BUCKET)
        .getPublicUrl(path).data.publicUrl;
    }),
  );

  const urls = uploads.filter((url): url is string => Boolean(url));
  return NextResponse.json({ urls });
}
