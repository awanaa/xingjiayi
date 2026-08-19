/**
 * CMS Data Layer & Authentication Core
 *
 * Environment: Next.js 16.2.1 (App Router) + TS strict
 * Requirements: Node builtin modules only, zero third-party dependencies, atomic write, memory cache.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

// --- Type Definitions ---
export type LocaleString = {
  en: string;
  zh: string;
  ja: string;
  ko: string;
};

export interface HeroSection {
  title: LocaleString;
  subtitle: LocaleString;
  ctaPrimary: LocaleString;
  ctaSecondary: LocaleString;
}

export interface TrustSection {
  title: LocaleString;
  subtitle: LocaleString;
}

export interface FeaturedItem {
  name: LocaleString;
  desc: LocaleString;
  image: string;
}

export interface FeaturedSection {
  title: LocaleString;
  subtitle: LocaleString;
  categories: FeaturedItem[];
}

export interface CapabilityItem {
  name: LocaleString;
  desc: LocaleString;
  image: string;
}

export interface CapabilitiesSection {
  title: LocaleString;
  subtitle: LocaleString;
  steps: CapabilityItem[];
}

export interface QualityItem {
  name: LocaleString;
  image: string;
}

export interface QualitySection {
  title: LocaleString;
  subtitle: LocaleString;
  modules: QualityItem[];
}

export interface SustainabilityItem {
  name: LocaleString;
  image: string;
}

export interface SustainabilitySection {
  title: LocaleString;
  subtitle: LocaleString;
  items: SustainabilityItem[];
}

export interface CtaSection {
  title: LocaleString;
  subtitle: LocaleString;
  buttonPrimary: LocaleString;
  buttonSecondary: LocaleString;
}

export interface CertificationItem {
  name: LocaleString;
  src: string;
  invert?: boolean;
  scale?: string;
}

export interface TrustNumberItem {
  value: string;
  suffix: string;
  label: LocaleString;
  desc: LocaleString;
}

// ── 智能工厂页 (Plant) ──
export interface PlantNumberItem {
  value: string;      // 数字(如 "50")
  suffix: string;     // 后缀(如 "%+")
  label: LocaleString;
}

export interface PlantStepItem {
  title: LocaleString;
  desc: LocaleString;
  img: string;        // 图片路径
}

export interface PlantEquipItem {
  title: LocaleString;
  desc: LocaleString;
  img: string;
}

export interface PlantSection {
  heroOver: LocaleString;
  heroTitle: LocaleString;
  heroAccent: LocaleString;
  heroDesc: LocaleString;
  scroll: LocaleString;
  stats: PlantNumberItem[];
  processTitle: LocaleString;
  processSub: LocaleString;
  steps: PlantStepItem[];
  equipTitle: LocaleString;
  equipSub: LocaleString;
  equipItems: PlantEquipItem[];
  certTitle: LocaleString;
  ctaTitle: LocaleString;
  ctaDesc: LocaleString;
  ctaBtn: LocaleString;
  certifications: CertificationItem[];
}

// ── 产品画册 (Portfolio/Gallery) ──
export interface GalleryImage {
  src: string;
  name: string;
  sizeKB: number;
  category: string;
}

export interface GalleryFolder {
  key: string;
  images: GalleryImage[];
}

export interface GalleryCategory {
  key: string;
  name: string;
}

/** 同一本书/同一产品的多图组：封面 + 组内全部图，点击封面可浏览整组 */
export interface GalleryGroup {
  id: string;
  category: string;
  name: string;
  cover: string;
  images: string[];
}

export interface GalleryData {
  folders: GalleryFolder[];
  categories: GalleryCategory[];
  groups?: GalleryGroup[];
}

export interface SiteContent {
  hero: HeroSection;
  trust: TrustSection;
  featured: FeaturedSection;
  capabilities: CapabilitiesSection;
  quality: QualitySection;
  sustainability: SustainabilitySection;
  cta: CtaSection;
  certifications: CertificationItem[];
  trustNumbers: TrustNumberItem[];
  plant?: PlantSection;
  gallery?: GalleryData;
}

export interface AuthData {
  passwordHash: string;
  salt: string;
}

export interface SessionsData {
  [token: string]: number;
}

// --- Configuration ---
const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

// Memory Cache
let contentCache: SiteContent | null = null;

// --- Helper Functions ---
export function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// --- Content Management ---
export function getContent(): SiteContent | null {
  if (contentCache) {
    return contentCache;
  }
  if (!fs.existsSync(CONTENT_FILE)) {
    return null;
  }
  const rawData = fs.readFileSync(CONTENT_FILE, "utf8");
  contentCache = JSON.parse(rawData) as SiteContent;
  return contentCache;
}

export function saveContent(data: SiteContent): void {
  ensureDataDir();
  const tmpFile = `${CONTENT_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmpFile, CONTENT_FILE);
  contentCache = data;
  syncContentToGit();
}

/**
 * content.json 双向同步：保存后自动 commit -> pull --rebase（合并远端改动）-> push。
 * 同一处两边同时改动时 git 报冲突，本地数据保留、远端保留，抛错由 API 层返回 409 提示人工合并。
 */
function syncContentToGit(): void {
  const repoDir = path.resolve(path.dirname(CONTENT_FILE), "..");
  const run = (cmd: string): string =>
    execSync(cmd, {
      cwd: repoDir,
      encoding: "utf8",
      timeout: 90000,
      stdio: ["ignore", "pipe", "pipe"],
    });
  try {
    try {
      run(`git add data/content.json`);
      run(`git commit -m "CMS: 内容保存 ${new Date().toISOString().slice(0, 19)}"`);
    } catch {
      // nothing to commit：内容与上次提交一致，忽略
    }
    try {
      run(`git pull --rebase --autostash origin main`);
      run(`git push origin main`);
    } catch (e) {
      const msg = String(e);
      if (/CONFLICT|could not apply|rebase in progress|autostash/i.test(msg)) {
        try {
          run(`git rebase --abort`);
        } catch {
          /* 不在 rebase 状态则忽略 */
        }
        throw new Error(
          `CMS_GIT_CONFLICT: 本次保存已写入本地，但与远端同一处同时改动，git 检测到冲突；两版均已保留（本地=已保存内容，远端=origin/main）。请人工合并后推送。`
        );
      }
      console.error("[CMS-GIT] pull/push 失败(仅记录, 保存已成功):", msg.slice(0, 300));
    }
    // 刷新内存缓存：pull 可能带回远端改动，避免读到旧数据
    if (fs.existsSync(CONTENT_FILE)) {
      contentCache = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8")) as SiteContent;
    }
  } catch (e) {
    console.error("[CMS-GIT] 同步异常:", e);
  }
}

// --- Authentication & Sessions ---
export function setupAdminPassword(plain: string): void {
  ensureDataDir();
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto.scryptSync(plain, salt, 64).toString("hex");
  const authData: AuthData = { passwordHash, salt };
  const tmpFile = `${AUTH_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(authData, null, 2), "utf8");
  fs.renameSync(tmpFile, AUTH_FILE);
}

export function verifyPassword(plain: string): boolean {
  if (!fs.existsSync(AUTH_FILE)) return false;
  const rawData = fs.readFileSync(AUTH_FILE, "utf8");
  const authData = JSON.parse(rawData) as AuthData;
  const hash = crypto.scryptSync(plain, authData.salt, 64);
  const stored = Buffer.from(authData.passwordHash, "hex");
  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
}

export function createSession(): string {
  ensureDataDir();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  let sessions: SessionsData = {};
  if (fs.existsSync(SESSIONS_FILE)) {
    sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
  }
  sessions[token] = expiresAt;
  const tmpFile = `${SESSIONS_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(sessions, null, 2), "utf8");
  fs.renameSync(tmpFile, SESSIONS_FILE);
  return token;
}

export function verifySession(token: string): boolean {
  if (!fs.existsSync(SESSIONS_FILE)) return false;
  const sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8")) as SessionsData;
  const now = Date.now();
  let modified = false;
  let isValid = false;
  for (const [key, expiresAt] of Object.entries(sessions)) {
    if (expiresAt < now) {
      delete sessions[key];
      modified = true;
    } else if (key === token) {
      isValid = true;
    }
  }
  if (modified) {
    const tmpFile = `${SESSIONS_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(sessions, null, 2), "utf8");
    fs.renameSync(tmpFile, SESSIONS_FILE);
  }
  return isValid;
}

export function deleteSession(token: string): void {
  if (!fs.existsSync(SESSIONS_FILE)) return;
  const sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8")) as SessionsData;
  if (sessions[token]) {
    delete sessions[token];
    const tmpFile = `${SESSIONS_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(sessions, null, 2), "utf8");
    fs.renameSync(tmpFile, SESSIONS_FILE);
  }
}
