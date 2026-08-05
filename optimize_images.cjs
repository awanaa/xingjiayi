const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const srcDir = "D:\\xjy-lishihua\\xjy-lishihua\\appp\\app\\public\\product-gallery";
const bakDir = "D:\\xjy-lishihua\\xjy-lishihua\\appp\\app\\public\\product-gallery-backup";
const outDir = srcDir; // overwrite in place

// Backup first
if (!fs.existsSync(bakDir)) {
  fs.mkdirSync(bakDir, { recursive: true });
  console.log("Backup created at:", bakDir);
}

let totalBefore = 0;
let totalAfter = 0;
let count = 0;
let skipped = 0;

async function processDir(dir, relPath) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(dir, entry.name);
    // Backup: mirror to backup dir
    const bak = path.join(bakDir, relPath, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(bak)) fs.mkdirSync(bak, { recursive: true });
      await processDir(src, path.join(relPath, entry.name));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".gif") {
        // Backup and skip GIFs
        if (!fs.existsSync(bak)) {
          if (!fs.existsSync(path.dirname(bak))) fs.mkdirSync(path.dirname(bak), { recursive: true });
          fs.copyFileSync(src, bak);
        }
        skipped++;
        continue;
      }
      if (![".jpg", ".jpeg", ".png"].includes(ext)) {
        skipped++;
        continue;
      }

      const oldSize = fs.statSync(src).size;
      totalBefore += oldSize;

      // Backup original if not already done
      if (!fs.existsSync(bak)) {
        if (!fs.existsSync(path.dirname(bak))) fs.mkdirSync(path.dirname(bak), { recursive: true });
        fs.copyFileSync(src, bak);
      }

      // Resize and compress
      const img = sharp(src);
      const meta = await img.metadata();
      const w = Math.min(meta.width || 2000, 1200);
      
      if (ext === ".png") {
        await img.resize(w, undefined, { fit: "inside", withoutEnlargement: true }).png({ quality: 70, palette: true }).toFile(src + ".tmp");
      } else {
        await img.resize(w, undefined, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 75, mozjpeg: true }).toFile(src + ".tmp");
      }
      
      fs.renameSync(src + ".tmp", src);
      const newSize = fs.statSync(src).size;
      totalAfter += newSize;
      count++;

      const pct = ((1 - newSize / oldSize) * 100).toFixed(0);
      console.log(`${entry.name}: ${(oldSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (-${pct}%)`);
    }
  }
}

processDir(srcDir, "").then(() => {
  console.log("\n========== SUMMARY ==========");
  console.log(`Compressed: ${count} files`);
  console.log(`Skipped: ${skipped} files`);
  console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (${((1-totalAfter/totalBefore)*100).toFixed(0)}% reduction)`);
  console.log("Backup saved to:", bakDir);
  console.log("DONE!");
}).catch(console.error);
