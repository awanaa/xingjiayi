// gen-plant-content.cjs — 从 app/plant/page.tsx 提取硬编码内容,合并进 data/content.json 的 plant 字段
// 用法: node scripts/gen-plant-content.cjs
const fs = require("fs");
const path = require("path");

const pagePath = path.join(process.cwd(), "app", "plant", "page.tsx");
const contentPath = path.join(process.cwd(), "data", "content.json");

const src = fs.readFileSync(pagePath, "utf8");

// 提取 t0 对象 (const t0 = { en: {...}, zh: {...}, ja: {...}, ko: {...} };
const t0Start = src.indexOf("const t0 = ");
if (t0Start < 0) {
  console.error("找不到 const t0");
  process.exit(1);
}
// 用括号配对找到最外层对象结束
let depth = 0;
let t0End = -1;
const bodyStart = src.indexOf("{", t0Start);
for (let i = bodyStart; i < src.length; i++) {
  const ch = src[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) {
      t0End = i;
      break;
    }
  }
}
if (t0End < 0) {
  console.error("t0 结束标记找不到");
  process.exit(1);
}
const t0Text = src.substring(bodyStart, t0End + 1);
const sandbox = {};
const fn = new Function("return " + t0Text);
const t0 = fn();

// plant 页的认证列表(渲染时硬编码的 6 个)
const plantCerts = [
  { src: "/certificate/ISO_9001-2015.png", name: "ISO 9001" },
  { src: "/certificate/iso14001.png", name: "ISO 14001" },
  { src: "/certificate/Disney_logo.png", name: "Disney FAMA", invert: true },
  { src: "/certificate/Walmart.png", name: "Walmart" },
  { src: "/certificate/Target.png", name: "Target" },
  { src: "/certificate/Costco.png", name: "Costco" },
];

const L = (obj) => {
  const out = {};
  for (const l of ["en", "zh", "ja", "ko"]) {
    out[l] = obj && obj[l] !== undefined ? obj[l] : "";
  }
  return out;
};

const lang = "en"; // 用 en 结构做模板;每语言字段从对应语言取
const build = (field, idx) => L({
  en: t0.en[field][idx], zh: t0.zh[field][idx], ja: t0.ja[field][idx], ko: t0.ko[field][idx],
});

const plant = {
  heroOver: L({ en: t0.en.heroOver, zh: t0.zh.heroOver, ja: t0.ja.heroOver, ko: t0.ko.heroOver }),
  heroTitle: L({ en: t0.en.heroTitle, zh: t0.zh.heroTitle, ja: t0.ja.heroTitle, ko: t0.ko.heroTitle }),
  heroAccent: L({ en: t0.en.heroAccent, zh: t0.zh.heroAccent, ja: t0.ja.heroAccent, ko: t0.ko.heroAccent }),
  heroDesc: L({ en: t0.en.heroDesc, zh: t0.zh.heroDesc, ja: t0.ja.heroDesc, ko: t0.ko.heroDesc }),
  scroll: L({ en: t0.en.scroll, zh: t0.zh.scroll, ja: t0.ja.scroll, ko: t0.ko.scroll }),
  stats: (t0.en.stats || []).map((_, i) => ({
    value: String(t0.en.stats[i].end),
    suffix: t0.en.stats[i].suffix || "",
    label: L({ en: t0.en.stats[i].label, zh: t0.zh.stats[i].label, ja: t0.ja.stats[i].label, ko: t0.ko.stats[i].label }),
  })),
  processTitle: L({ en: t0.en.processTitle, zh: t0.zh.processTitle, ja: t0.ja.processTitle, ko: t0.ko.processTitle }),
  processSub: L({ en: t0.en.processSub, zh: t0.zh.processSub, ja: t0.ja.processSub, ko: t0.ko.processSub }),
  steps: (t0.en.steps || []).map((_, i) => ({
    title: L({ en: t0.en.steps[i].title, zh: t0.zh.steps[i].title, ja: t0.ja.steps[i].title, ko: t0.ko.steps[i].title }),
    desc: L({ en: t0.en.steps[i].desc, zh: t0.zh.steps[i].desc, ja: t0.ja.steps[i].desc, ko: t0.ko.steps[i].desc }),
    img: t0.en.steps[i].img || "",
  })),
  equipTitle: L({ en: t0.en.equipTitle, zh: t0.zh.equipTitle, ja: t0.ja.equipTitle, ko: t0.ko.equipTitle }),
  equipSub: L({ en: t0.en.equipSub, zh: t0.zh.equipSub, ja: t0.ja.equipSub, ko: t0.ko.equipSub }),
  equipItems: (t0.en.equipItems || []).map((_, i) => ({
    title: L({ en: t0.en.equipItems[i].title, zh: t0.zh.equipItems[i].title, ja: t0.ja.equipItems[i].title, ko: t0.ko.equipItems[i].title }),
    desc: L({ en: t0.en.equipItems[i].desc, zh: t0.zh.equipItems[i].desc, ja: t0.ja.equipItems[i].desc, ko: t0.ko.equipItems[i].desc }),
    img: t0.en.equipItems[i].img || "",
  })),
  certTitle: L({ en: t0.en.certTitle, zh: t0.zh.certTitle, ja: t0.ja.certTitle, ko: t0.ko.certTitle }),
  ctaTitle: L({ en: t0.en.ctaTitle, zh: t0.zh.ctaTitle, ja: t0.ja.ctaTitle, ko: t0.ko.ctaTitle }),
  ctaDesc: L({ en: t0.en.ctaDesc, zh: t0.zh.ctaDesc, ja: t0.ja.ctaDesc, ko: t0.ko.ctaDesc }),
  ctaBtn: L({ en: t0.en.ctaBtn, zh: t0.zh.ctaBtn, ja: t0.ja.ctaBtn, ko: t0.ko.ctaBtn }),
  certifications: plantCerts.map((c) => ({
    name: L({ en: c.name, zh: c.name, ja: c.name, ko: c.name }),
    src: c.src,
    ...(c.invert !== undefined ? { invert: c.invert } : {}),
  })),
};

const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
content.plant = plant;
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf8");
console.log("✅ plant 区块已合并进 data/content.json");
console.log("  stats:", plant.stats.length, "| steps:", plant.steps.length, "| equipItems:", plant.equipItems.length, "| certs:", plant.certifications.length);
