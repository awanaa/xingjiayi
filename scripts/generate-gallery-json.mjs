import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const galleryDir = 'D:\\xjy-lishihua\\xjy-lishihua\\appp\\app\\public\\product-gallery';

const entries = readdirSync(galleryDir, { withFileTypes: true });
const output = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const dirPath = join(galleryDir, entry.name);
  const files = readdirSync(dirPath).filter(f =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  );
  if (files.length === 0) continue;
  
  const images = files.map(f => {
    const fullPath = join(dirPath, f);
    const stat = statSync(fullPath);
    return {
      src: `/product-gallery/${entry.name}/${f}`,
      name: f,
      sizeKB: Math.round(stat.size / 1024 * 10) / 10,
    };
  });

  output.push({
    key: entry.name,
    images,
  });
}

const jsonPath = 'D:\\xjy-lishihua\\xjy-lishihua\\appp\\app\\public\\gallery-index.json';
writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Generated ${jsonPath} — ${output.length} categories, ${output.reduce((a,c) => a + c.images.length, 0)} total images`);
