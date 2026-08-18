import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, getContent, saveContent, GalleryData } from "@/lib/cms";
import fs from "node:fs";
import path from "node:path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 50;

const DEFAULT_CATEGORY_NAMES: Record<string, string> = {
  yo: "YO类",
  custom: "匠心特装定制",
  soundlight: "声光互动书册",
  paperback: "平装书刊书籍",
  boardbook: "板纸对裱童书",
  cards: "益智卡牌卡册",
  toys: "益智玩具类",
  hardcover: "精装图书画册",
  stickers: "趣味贴纸书系",
  uncategorized: "未分类",
};

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
      const gallery: GalleryData = content?.gallery || { folders: [], categories: [] };
      if (!gallery.categories) gallery.categories = [];
      // 分类不在列表则自动追加（带默认中文名）
      if (!gallery.categories.some((c: any) => c.key === category)) {
        gallery.categories.push({ key: category, name: DEFAULT_CATEGORY_NAMES[category] || category });
      }
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

// 删除图片：移除 content.json 条目 + 删除物理文件
function safePublicPath(src: string): string | null {
  // 只允许 /uploads/ 与 /product-gallery/ 下的资源，防止路径穿越
  if (!src || typeof src !== "string") return null;
  if (!src.startsWith("/uploads/") && !src.startsWith("/product-gallery/")) return null;
  if (src.includes("..")) return null;
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const src = (body?.src || "") as string;
    if (!src) {
      return NextResponse.json({ ok: false, error: "Missing src" }, { status: 400 });
    }

    const content = getContent() as any;
    const gallery: GalleryData = content?.gallery || { folders: [], categories: [] };
    let removed = false;
    const newFolders = (gallery.folders || [])
      .map((f: any) => ({ ...f, images: (f.images || []).filter((img: any) => {
        if (img.src === src) { removed = true; return false; }
        return true;
      }) }))
      .filter((f: any) => (f.images || []).length > 0);

    if (!removed) {
      return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
    }

    // 删除物理文件（尽力而为，失败不影响条目移除）
    const filePath = safePublicPath(src);
    if (filePath) {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch { /* ignore */ }
    }

    gallery.folders = newFolders;
    content.gallery = gallery;
    saveContent(content);
    return NextResponse.json({ ok: true, removed: src });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Delete failed" }, { status: 500 });
  }
}

// 移动图片到其他分类：更新条目 category 并搬到目标文件夹（含新建）
export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const src = (body?.src || "") as string;
    const category = (body?.category || "") as string;
    if (!src || !category) {
      return NextResponse.json({ ok: false, error: "Missing src or category" }, { status: 400 });
    }

    const content = getContent() as any;
    const gallery: GalleryData = content?.gallery || { folders: [], categories: [] };
    if (!gallery.categories) gallery.categories = [];

    let movedImg: any = null;
    let moved = false;
    const newFolders = (gallery.folders || [])
      .map((f: any) => {
        const hit = (f.images || []).find((img: any) => img.src === src);
        if (hit) {
          moved = true;
          movedImg = { ...hit, category };
          return { ...f, images: (f.images || []).filter((img: any) => img.src !== src) };
        }
        return f;
      })
      .filter((f: any) => (f.images || []).length > 0);

    if (!moved || !movedImg) {
      return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
    }

    // 分类不存在则自动追加
    if (!gallery.categories.some((c: any) => c.key === category)) {
      gallery.categories.push({ key: category, name: DEFAULT_CATEGORY_NAMES[category] || category });
    }
    let target = newFolders.find((f: any) => f.key === category);
    if (!target) {
      target = { key: category, images: [] };
      newFolders.push(target);
    }
    target.images.push(movedImg);

    gallery.folders = newFolders;
    content.gallery = gallery;
    saveContent(content);
    return NextResponse.json({ ok: true, moved: src, category });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Move failed" }, { status: 500 });
  }
}
