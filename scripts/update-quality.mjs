import { readFileSync, writeFileSync } from "fs";

const file = "data/content.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);

// 保留前5个模块，图片换成新图 01-05.png
data.quality.modules = data.quality.modules.slice(0, 5).map((m, i) => {
  const num = String(i + 1).padStart(2, "0");
  return { ...m, image: `/real-factory/${num}.png` };
});

writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("quality.modules count:", data.quality.modules.length);
console.log("images:", data.quality.modules.map((m) => m.image).join(", "));
