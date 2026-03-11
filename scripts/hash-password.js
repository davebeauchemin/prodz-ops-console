#!/usr/bin/env node
/**
 * Generate a base64-encoded bcrypt hash for HASHED_PASSWORD.
 * Usage: node scripts/hash-password.js
 *        PASSWORD=your-password node scripts/hash-password.js
 *        echo "your-password" | node scripts/hash-password.js
 */
const bcrypt = require("bcryptjs");

function main() {
  const password =
    process.env.PASSWORD || (process.stdin.isTTY ? undefined : require("fs").readFileSync(0, "utf-8").trim());
  if (!password) {
    console.error("Usage: PASSWORD=your-password node scripts/hash-password.js");
    console.error("   or: echo 'your-password' | node scripts/hash-password.js");
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, 10);
  const encoded = Buffer.from(hash, "utf8").toString("base64");
  console.log("Add to .env:");
  console.log("HASHED_PASSWORD=" + encoded);
}

main();
