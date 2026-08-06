// gen-auth.cjs — 生成 CMS auth.json (与 lib/cms.ts 相同的 scrypt 格式)
// 用法: node gen-auth.cjs <password>
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const password = process.argv[2];
if (!password) {
  console.error("用法: node gen-auth.cjs <password>");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
const authData = { passwordHash, salt };

const outDir = path.join(__dirname, "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "auth.json");
fs.writeFileSync(outFile, JSON.stringify(authData, null, 2), "utf8");
console.log("✅ auth.json 已生成: " + outFile);
console.log("密码: " + password);
