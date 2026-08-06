import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, getContent, saveContent, GalleryData } from "@/lib/cms";
import fs from "node:fs";
import path from "node:path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 50;

// 批量上传图片：写入 public/uploads/，并把条目追加进 content.json 的 gallery.folders
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const category = (formData.get("category") as string) || "uncategorized";

    if (!files || files.length === 0) {
      return NextResponse.json({ ok: false, error: "No files provided" }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ ok: false, error: `Too many files (max ${MAX_FILES})` }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uploaded: { src: string; name: string; sizeKB: number; category: string }[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const extension = path.extname(file.name).toLowerCase();
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: 超过 5MB`);
        continue;
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push(`${file.name}: 格式不支持`);
        continue;
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${Date.now()}-${randomStr}${extension}`;
      fs.writeFileSync(path.join(uploadsDir, fileName), buffer);
      uploaded.push({
        src: `/uploads/${fileName}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        sizeKB: Math.round(file.size / 1024),
        category,
      });
    }

    // 写入 gallery 数据（追加到 category 同名文件夹，不存在则新建）
    if (uploaded.length > 0) {
      const content = getContent() as any;
      const gallery: GalleryData = content?.gallery || { folders: [] };
      let folder = gallery.folders.find((f) => f.key === category);
      if (!folder) {
        folder = { key: category, images: [] };
        gallery.folders.push(folder);
      }
      folder.images.push(...uploaded);
      content.gallery = gallery;
      saveContent(content);
    }

    return NextResponse.json({ ok: true, count: uploaded.length, uploaded, errors });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
