import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, getContent, saveContent, GalleryData } from "@/lib/cms";

/**
 * 组卡片管理 API（同一本书/同一产品的多图合集）
 *
 * POST   { name, category, cover, srcs }          建组（srcs 从散图移除进组）
 * PATCH  { id, ... }                              改组：name / category / cover / images（全量替换，移除的图回散图、新增的图从散图移除）
 * PATCH  { ids: [...] }                           组顺序重排（全量）
 * DELETE { id }                                   删组（组内图全部回散图）
 */

function getGallery(content: any): GalleryData {
  return content?.gallery || { folders: [], categories: [] };
}

function genId(category: string): string {
  return `${category || "group"}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function defaultGroupName(category: string, gallery: GalleryData, count: number): string {
  const catName = (gallery.categories || []).find((c: any) => c.key === category)?.name || category;
  const existing = (gallery.groups || []).filter((g: any) => g.category === category).length;
  const n = count || existing + 1;
  return `${catName}·组${String(n).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const srcs = Array.isArray(body?.srcs) ? body.srcs.filter((s: unknown) => typeof s === "string") : [];
    const category = (body?.category || "uncategorized") as string;
    if (srcs.length < 1) {
      return NextResponse.json({ ok: false, error: "至少选择 1 张图片" }, { status: 400 });
    }
    const content = getContent() as any;
    const gallery = getGallery(content);
    if (!gallery.folders) gallery.folders = [];
    if (!gallery.categories) gallery.categories = [];
    if (!gallery.groups) gallery.groups = [];

    // 校验 srcs 都在散图里，并从散图移除
    const allSrcs = new Set<string>();
    (gallery.folders || []).forEach((f: any) => (f.images || []).forEach((i: any) => allSrcs.add(i.src)));
    const missing = srcs.filter((s: string) => !allSrcs.has(s));
    if (missing.length > 0) {
      return NextResponse.json({ ok: false, error: `以下图片不在图库中：${missing.join(", ")}` }, { status: 400 });
    }
    (gallery.folders || []).forEach((f: any) => {
      f.images = (f.images || []).filter((i: any) => !srcs.includes(i.src));
    });

    const cover = srcs.includes(body?.cover) ? body.cover : srcs[0];
    const group = {
      id: genId(category),
      category,
      name: (body?.name as string)?.trim() || defaultGroupName(category, gallery, 0),
      cover,
      images: srcs,
    };
    gallery.groups.push(group);
    content.gallery = gallery;
    saveContent(content);
    return NextResponse.json({ ok: true, group });
  } catch (error) {
    console.error("[CMS-GROUPS] POST error:", error);
    return NextResponse.json({ ok: false, error: "创建组失败" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const content = getContent() as any;
    const gallery = getGallery(content);
    if (!gallery.groups) gallery.groups = [];

    // 组顺序重排
    if (Array.isArray(body?.ids)) {
      const allGroups = gallery.groups || [];
      const idSet = new Set(allGroups.map((g: any) => g.id));
      const ids = body.ids.filter((id: string) => idSet.has(id));
      if (ids.length !== allGroups.length) {
        return NextResponse.json({ ok: false, error: "组列表不完整，无法重排" }, { status: 400 });
      }
      const byId = new Map(allGroups.map((g: any) => [g.id, g]));
      gallery.groups = ids.map((id: string) => byId.get(id)!);
      content.gallery = gallery;
      saveContent(content);
      return NextResponse.json({ ok: true, reordered: ids.length });
    }

    const id = body?.id as string;
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing group id" }, { status: 400 });
    }
    const group = (gallery.groups || []).find((g: any) => g.id === id);
    if (!group) {
      return NextResponse.json({ ok: false, error: "Group not found" }, { status: 404 });
    }

    const changed: string[] = [];

    // 组名
    if (typeof body?.name === "string" && body.name.trim()) {
      group.name = body.name.trim();
      changed.push("name");
    }

    // 分类
    if (typeof body?.category === "string" && body.category) {
      group.category = body.category;
      changed.push("category");
    }

    // 封面（必须存在于组内）
    if (typeof body?.cover === "string") {
      if (!group.images.includes(body.cover)) {
        return NextResponse.json({ ok: false, error: "封面必须是组内图片" }, { status: 400 });
      }
      group.cover = body.cover;
      changed.push("cover");
    }

    // 组内图片全量替换：移除的图回散图，新增的图从散图移除
    if (Array.isArray(body?.images)) {
      const prev = group.images;
      const next = body.images.filter((s: unknown) => typeof s === "string");
      if (next.length < 1) {
        return NextResponse.json({ ok: false, error: "组内至少保留 1 张图" }, { status: 400 });
      }
      const removed = prev.filter((s: string) => !next.includes(s));
      const added = next.filter((s: string) => !prev.includes(s));
      // 新增的图必须在散图里
      const allSrcs = new Set<string>();
      (gallery.folders || []).forEach((f: any) => (f.images || []).forEach((i: any) => allSrcs.add(i.src)));
      const missing = added.filter((s: string) => !allSrcs.has(s));
      if (missing.length > 0) {
        return NextResponse.json({ ok: false, error: `以下图片不在图库中：${missing.join(", ")}` }, { status: 400 });
      }
      // 从散图移除新增的
      (gallery.folders || []).forEach((f: any) => {
        f.images = (f.images || []).filter((i: any) => !added.includes(i.src));
      });
      // 移除的图回散图（追加到主 folder，category 用组分类）
      const targetFolder = gallery.folders.find((f: any) => f.key === "2026-08-20__图库") || gallery.folders[0];
      if (targetFolder) {
        removed.forEach((s: string) => {
          targetFolder.images.push({ src: s, name: decodeURIComponent(s.split("/").pop() || "").replace(/\.[^.]+$/, ""), sizeKB: 0, category: group.category });
        });
      }
      group.images = next;
      // 封面若被移除则回退到第一张
      if (!next.includes(group.cover)) group.cover = next[0];
      changed.push("images");
    }

    content.gallery = gallery;
    saveContent(content);
    return NextResponse.json({ ok: true, changed, group });
  } catch (error) {
    console.error("[CMS-GROUPS] PATCH error:", error);
    return NextResponse.json({ ok: false, error: "修改组失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = (body?.id || "") as string;
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing group id" }, { status: 400 });
    }
    const content = getContent() as any;
    const gallery = getGallery(content);
    if (!gallery.groups) gallery.groups = [];
    const group = (gallery.groups || []).find((g: any) => g.id === id);
    if (!group) {
      return NextResponse.json({ ok: false, error: "Group not found" }, { status: 404 });
    }

    // 组内图全部回散图（保留原顺序追加到主 folder）
    const targetFolder = gallery.folders.find((f: any) => f.key === "2026-08-20__图库") || gallery.folders[0];
    if (targetFolder) {
      (group.images || []).forEach((s: string) => {
        if (!targetFolder.images.some((i: any) => i.src === s)) {
          targetFolder.images.push({ src: s, name: decodeURIComponent(s.split("/").pop() || "").replace(/\.[^.]+$/, ""), sizeKB: 0, category: group.category });
        }
      });
    }
    gallery.groups = gallery.groups.filter((g: any) => g.id !== id);
    content.gallery = gallery;
    saveContent(content);
    return NextResponse.json({ ok: true, removed: id, imagesBack: (group.images || []).length });
  } catch (error) {
    console.error("[CMS-GROUPS] DELETE error:", error);
    return NextResponse.json({ ok: false, error: "删除组失败" }, { status: 500 });
  }
}
