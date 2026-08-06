// merge-gallery.cjs — 把 public/gallery-index.json 的图库合并进 data/content.json 的 gallery 字段
// 用法: node scripts/merge-gallery.cjs
// 幂等:已存在的 folder.key 会保留,只新增缺失文件夹;若 content.gallery 已存在则跳过整个合并(除非 --force)
const fs = require("fs");
const path = require("path");

const force = process.argv.includes("--force");
const contentPath = path.join(process.cwd(), "data", "content.json");
const galleryPath = path.join(process.cwd(), "public", "gallery-index.json");

if (!fs.existsSync(galleryPath)) {
  console.error("缺少 public/gallery-index.json");
  process.exit(1);
}
if (!fs.existsSync(contentPath)) {
  console.error("缺少 data/content.json — 请先运行 gen-content.cjs 生成");
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const galleryIndex = JSON.parse(fs.readFileSync(galleryPath, "utf8"));

if (content.gallery && !force) {
  console.log("content.gallery 已存在,跳过合并(用 --force 覆盖)");
  process.exit(0);
}

// 每个原 folder 转成一个 CMS folder,key = 原文件夹名
const folders = galleryIndex.map((f) => ({
  key: f.key,
  images: f.images.map((img) => ({
    src: img.src,
    name: img.name || "",
    sizeKB: img.sizeKB || 0,
    category: img.category || f.key,
  })),
}));

content.gallery = { folders };
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf8");
console.log(`✅ 合并完成: ${folders.length} 个文件夹, ${folders.reduce((s, f) => s + f.images.length, 0)} 张图片 → data/content.json`);
