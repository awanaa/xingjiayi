/**
 * CMS Data Layer & Authentication Core
 *
 * Environment: Next.js 16.2.1 (App Router) + TS strict
 * Requirements: Node builtin modules only, zero third-party dependencies, atomic write, memory cache.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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
