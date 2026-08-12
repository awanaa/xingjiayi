import { readFileSync, writeFileSync } from "fs";

const file = "data/content.json";
const raw = readFileSync(file, "utf8");
const data = JSON.parse(raw);

// sustainability 6 项图片换成环保新图 /eco/01-06.png
data.sustainability.items = data.sustainability.items.map((it, i) => {
  const num = String(i + 1).padStart(2, "0");
  return { ...it, image: `/eco/${num}.png` };
});

writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("sustainability items:", data.sustainability.items.length);
console.log("images:", data.sustainability.items.map((m) => m.image).join(", "));
