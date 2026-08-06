// gen-content.cjs — 从 page.tsx 提取硬编码内容,生成 CMS 初始 content.json
// 用法: node scripts/gen-content.cjs > data/content.json
const fs = require("fs");

const c = fs.readFileSync("app/page.tsx", "utf8");

// 提取 contentDict 的原始文本区间 (从 "const contentDict" 到 "};" 结束)
const start = c.indexOf("const contentDict");
const end = c.indexOf("\n};", start);
if (start < 0 || end < 0) {
  console.error("无法定位 contentDict");
  process.exit(1);
}
const dictText = c.substring(start, end + 3);

// 在临时作用域里 eval 出 contentDict(只包含纯对象字面量,安全)
// 注意: 文本里可能有 `?` 等字符,但都是合法 JS 字符串
// 去掉 TS 类型注解 (const contentDict: Record<Lang, ContentType> = {...})
const cleanText = dictText.replace("const contentDict: Record<Lang, ContentType> = ", "const contentDict = ");
const sandbox = {};
const fn = new Function("return " + cleanText.replace("const contentDict = ", ""));
const contentDict = fn();

// 图片映射(按索引)
const processImgs = [
  "/process-illustrations/Gemini_Generated_Image_h4tdnmh4tdnmh4td.webp",
  "/process-illustrations/Gemini_Generated_Image_38tvxi38tvxi38tv.webp",
  "/process-illustrations/Gemini_Generated_Image_3i7d4v3i7d4v3i7d.webp",
  "/process-illustrations/Gemini_Generated_Image_4nzn934nzn934nzn.webp",
  "/process-illustrations/Gemini_Generated_Image_1zhoul1zhoul1zho.webp",
  "/process-illustrations/Gemini_Generated_Image_rrrvparrrvparrrv.webp",
  "/process-illustrations/Gemini_Generated_Image_t02tdut02tdut02t.webp",
];

const qualityImgs = [
  "/real-factory/color-management.jpg",
  "/real-factory/IMG_5110.JPG",
  "/real-factory/IMG_5141.JPG",
  "/real-factory/IMG_5183.JPG",
  "/real-factory/IMG_5133.JPG",
  "/real-factory/truck-loading.jpg",
];

const sustainabilityImgs = [
  "/real-factory/fsc-paper.jpg",
  "/real-factory/IMG_5112.JPG",
  "/real-factory/IMG_5256.JPG",
  "/real-factory/automated-production.jpg",
  "/real-factory/IMG_5143.JPG",
  "/real-factory/IMG_5141.JPG",
];

const certifications = [
  { name: "Disney", src: "/certificate/Disney_logo.png", invert: true },
  { name: "Walmart", src: "/certificate/Walmart.png" },
  { name: "Target", src: "/certificate/Target.png" },
  { name: "Costco", src: "/certificate/Costco.png" },
  { name: "ISO 9001", src: "/certificate/ISO_9001-2015.png" },
  { name: "ISO 14001", src: "/certificate/iso14001.png", scale: "scale-[1.3]" },
  { name: "SCAN", src: "/certifications/scan.jpg", scale: "scale-[1.8]" },
  { name: "SMETA", src: "/certifications/smeta-.png", scale: "scale-[1.8]" },
  { name: "Universal", src: "/certifications/universal.png", invert: true, scale: "scale-[2.1]" },
  { name: "中国环境标志", src: "/certifications/china10.png", scale: "scale-[1.8]" },
  { name: "FSC", src: "/certifications/fsc-new.png", scale: "scale-125" },
  { name: "EXPERT", src: "/certifications/expert.jpg", scale: "scale-125" },
];

// 从 page.tsx 提取 certifications(和上面一致,直接引用)
// 提取 trustNumbers —— TrustProofSection 里,单独处理

// 构造 SiteContent(四语)
const langOrder = ["en", "zh", "ja", "ko"];
const L = (obj) => {
  const out = {};
  for (const l of langOrder) {
    out[l] = obj && obj[l] !== undefined ? obj[l] : "";
  }
  return out;
};

const content = {
  hero: {
    title: L(contentDict.en.hero.title ? { en: contentDict.en.hero.title, zh: contentDict.zh.hero.title, ja: contentDict.ja.hero.title, ko: contentDict.ko.hero.title } : {}),
    subtitle: L({ en: contentDict.en.hero.subtitle, zh: contentDict.zh.hero.subtitle, ja: contentDict.ja.hero.subtitle, ko: contentDict.ko.hero.subtitle }),
    ctaPrimary: L({ en: contentDict.en.hero.ctaPrimary, zh: contentDict.zh.hero.ctaPrimary, ja: contentDict.ja.hero.ctaPrimary, ko: contentDict.ko.hero.ctaPrimary }),
    ctaSecondary: L({ en: contentDict.en.hero.ctaSecondary, zh: contentDict.zh.hero.ctaSecondary, ja: contentDict.ja.hero.ctaSecondary, ko: contentDict.ko.hero.ctaSecondary }),
  },
  trust: {
    title: L({ en: contentDict.en.trust.title, zh: contentDict.zh.trust.title, ja: contentDict.ja.trust.title, ko: contentDict.ko.trust.title }),
    subtitle: L({ en: contentDict.en.trust.subtitle, zh: contentDict.zh.trust.subtitle, ja: contentDict.ja.trust.subtitle, ko: contentDict.ko.trust.subtitle }),
  },
  featured: {
    title: L({ en: contentDict.en.featured.title, zh: contentDict.zh.featured.title, ja: contentDict.ja.featured.title, ko: contentDict.ko.featured.title }),
    subtitle: L({ en: contentDict.en.featured.subtitle, zh: contentDict.zh.featured.subtitle, ja: contentDict.ja.featured.subtitle, ko: contentDict.ko.featured.subtitle }),
    categories: contentDict.en.featured.categories.map((_, i) => ({
      name: L({ en: contentDict.en.featured.categories[i].name, zh: contentDict.zh.featured.categories[i].name, ja: contentDict.ja.featured.categories[i].name, ko: contentDict.ko.featured.categories[i].name }),
      desc: L({ en: contentDict.en.featured.categories[i].desc, zh: contentDict.zh.featured.categories[i].desc, ja: contentDict.ja.featured.categories[i].desc, ko: contentDict.ko.featured.categories[i].desc }),
      image: `/products/prod-${String(i + 1).padStart(2, "0")}.webp`,
    })),
  },
  capabilities: {
    title: L({ en: contentDict.en.capabilities.title, zh: contentDict.zh.capabilities.title, ja: contentDict.ja.capabilities.title, ko: contentDict.ko.capabilities.title }),
    subtitle: L({ en: contentDict.en.capabilities.subtitle, zh: contentDict.zh.capabilities.subtitle, ja: contentDict.ja.capabilities.subtitle, ko: contentDict.ko.capabilities.subtitle }),
    steps: contentDict.en.capabilities.steps.map((_, i) => ({
      name: L({ en: contentDict.en.capabilities.steps[i].name, zh: contentDict.zh.capabilities.steps[i].name, ja: contentDict.ja.capabilities.steps[i].name, ko: contentDict.ko.capabilities.steps[i].name }),
      desc: L({ en: contentDict.en.capabilities.steps[i].desc, zh: contentDict.zh.capabilities.steps[i].desc, ja: contentDict.ja.capabilities.steps[i].desc, ko: contentDict.ko.capabilities.steps[i].desc }),
      image: processImgs[i] || "",
    })),
  },
  quality: {
    title: L({ en: contentDict.en.quality.title, zh: contentDict.zh.quality.title, ja: contentDict.ja.quality.title, ko: contentDict.ko.quality.title }),
    subtitle: L({ en: contentDict.en.quality.subtitle, zh: contentDict.zh.quality.subtitle, ja: contentDict.ja.quality.subtitle, ko: contentDict.ko.quality.subtitle }),
    modules: contentDict.en.quality.modules.map((_, i) => ({
      name: L({ en: contentDict.en.quality.modules[i], zh: contentDict.zh.quality.modules[i], ja: contentDict.ja.quality.modules[i], ko: contentDict.ko.quality.modules[i] }),
      image: qualityImgs[i] || "",
    })),
  },
  sustainability: {
    title: L({ en: contentDict.en.sustainability.title, zh: contentDict.zh.sustainability.title, ja: contentDict.ja.sustainability.title, ko: contentDict.ko.sustainability.title }),
    subtitle: L({ en: contentDict.en.sustainability.subtitle, zh: contentDict.zh.sustainability.subtitle, ja: contentDict.ja.sustainability.subtitle, ko: contentDict.ko.sustainability.subtitle }),
    items: contentDict.en.sustainability.items.map((_, i) => ({
      name: L({ en: contentDict.en.sustainability.items[i], zh: contentDict.zh.sustainability.items[i], ja: contentDict.ja.sustainability.items[i], ko: contentDict.ko.sustainability.items[i] }),
      image: sustainabilityImgs[i] || "",
    })),
  },
  cta: {
    title: L({ en: contentDict.en.cta.title, zh: contentDict.zh.cta.title, ja: contentDict.ja.cta.title, ko: contentDict.ko.cta.title }),
    subtitle: L({ en: contentDict.en.cta.subtitle, zh: contentDict.zh.cta.subtitle, ja: contentDict.ja.cta.subtitle, ko: contentDict.ko.cta.subtitle }),
    buttonPrimary: L({ en: contentDict.en.cta.buttonPrimary, zh: contentDict.zh.cta.buttonPrimary, ja: contentDict.ja.cta.buttonPrimary, ko: contentDict.ko.cta.buttonPrimary }),
    buttonSecondary: L({ en: contentDict.en.cta.buttonSecondary, zh: contentDict.zh.cta.buttonSecondary, ja: contentDict.ja.cta.buttonSecondary, ko: contentDict.ko.cta.buttonSecondary }),
  },
  certifications: certifications.map((cert) => ({
    name: { en: cert.name, zh: cert.name, ja: cert.name, ko: cert.name },
    src: cert.src,
    ...(cert.invert !== undefined ? { invert: cert.invert } : {}),
    ...(cert.scale !== undefined ? { scale: cert.scale } : {}),
  })),
  trustNumbers: [
    { value: "25", suffix: "+", label: L({ en: "Years of Excellence", zh: "年卓越经验", ja: "年の卓越した実績", ko: "년의 탁월한 경험" }), desc: L({ en: "Serving global publishers since 1998", zh: "自1998年起服务全球出版商", ja: "1998年から世界の出版社にサービス", ko: "1998년부터 세계 출판사 서비스" }) },
    { value: "30", suffix: "+", label: L({ en: "Countries Served", zh: "服务国家/地区", ja: "対応国・地域", ko: "서비스 국가" }), desc: L({ en: "Delivering to publishers worldwide", zh: "向全球出版商交付", ja: "世界中の出版社に配送", ko: "전 세계 출판사에 배송" }) },
    { value: "500", suffix: "+", label: L({ en: "Projects Completed", zh: "完成项目", ja: "完了プロジェクト", ko: "완료 프로젝트" }), desc: L({ en: "From board books to complex pop-ups", zh: "从纸板书到复杂立体书", ja: "ボードブックから複雑な仕掛け絵本まで", ko: "보드북부터 복잡한 팝업북까지" }) },
    { value: "98", suffix: "%", label: L({ en: "On-time Delivery", zh: "准时交付率", ja: "納期順守率", ko: "정시 납품률" }), desc: L({ en: "Consistent, reliable production schedules", zh: "稳定可靠的生产排期", ja: "安定した信頼性の高い生産スケジュール", ko: "안정적이고 신뢰할 수 있는 생산 일정" }) },
  ],
};

process.stdout.write(JSON.stringify(content, null, 2));
