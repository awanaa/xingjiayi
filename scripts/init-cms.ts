#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { setupAdminPassword, saveContent, ensureDataDir, type SiteContent } from "../lib/cms";

const args = process.argv.slice(2);
const password = args[0];
const seedPath = args[1];

if (!password) {
  console.error("错误: 缺少密码参数。");
  console.log("用法: node scripts/init-cms.ts <password> [seed.json路径]");
  process.exit(1);
}

try {
  ensureDataDir();
  setupAdminPassword(password);
  console.log("✅ 管理员密码已设置 ✓ (auth.json 已更新)");

  if (seedPath) {
    const absolutePath = path.resolve(process.cwd(), seedPath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ 错误: 找不到提供的内容种子文件 - ${absolutePath}`);
      process.exit(1);
    }
    const rawData = fs.readFileSync(absolutePath, "utf8");
    const contentData = JSON.parse(rawData) as SiteContent;
    saveContent(contentData);
    console.log(`✅ 初始化内容已写入 ✓ (读取自 ${absolutePath})`);
  } else {
    console.log("ℹ️ 提示: 密码已设置,内容文件未生成,可稍后从后台填写或提供 seed.json");
  }
} catch (error: any) {
  console.error("❌ 初始化过程中发生异常:", error.message || error);
  process.exit(1);
}
