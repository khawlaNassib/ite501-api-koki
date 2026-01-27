const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDb, writeDb } = require("../storage/jsonStore");

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json(db.students);
});

router.get("/:id", (req, res) => {
  const db = readDb();
  const item = db.students.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Student not found" });
  res.json(item);
});

router.post("/", (req, res) => {
  const { name, email, major } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });

  const db = readDb();
  const exists = db.students.some(s => s.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ error: "student email already exists" });

  const created = { id: uuidv4(), name, email, major: major || "", createdAt: new Date().toISOString() };
  db.students.push(created);
  writeDb(db);
  res.status(201).json(created);
});

router.put("/:id", (req, res) => {
  const db = readDb();
  const idx = db.students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Student not found" });

  const current = db.students[idx];
  const { name, email, major } = req.body || {};
  const updated = {
    ...current,
    name: name ?? current.name,
    email: email ?? current.email,
    major: major ?? current.major,
    updatedAt: new Date().toISOString()
  };

  // prevent duplicate email
  const dupe = db.students.some(s => s.id !== current.id && s.email.toLowerCase() === String(updated.email).toLowerCase());
  if (dupe) return res.status(409).json({ error: "another student already uses this email" });

  db.students[idx] = updated;
  writeDb(db);
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const db = readDb();
  const before = db.students.length;
  db.students = db.students.filter(s => s.id !== req.params.id);
  if (db.students.length === before) return res.status(404).json({ error: "Student not found" });
  writeDb(db);
  res.status(204).send();
});

module.exports = router;
