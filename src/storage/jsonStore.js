const fs = require("fs");
const path = require("path");

function resolveFile() {
  const configured = process.env.DATA_FILE || "./data/db.json";
  return path.resolve(process.cwd(), configured);
}

function ensureDb() {
  const file = resolveFile();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ students: [], employees: [] }, null, 2));
  }
  return file;
}

function readDb() {
  const file = ensureDb();
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  const file = ensureDb();
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

module.exports = { readDb, writeDb };
