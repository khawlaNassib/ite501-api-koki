const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDb, writeDb } = require("../storage/jsonStore");

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json(db.employees);
});

router.get("/:id", (req, res) => {
  const db = readDb();
  const item = db.employees.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Employee not found" });
  res.json(item);
});

router.post("/", (req, res) => {
  const { name, email, department } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });

  const db = readDb();
  const exists = db.employees.some(e => e.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ error: "employee email already exists" });

  const created = { id: uuidv4(), name, email, department: department || "", createdAt: new Date().toISOString() };
  db.employees.push(created);
  writeDb(db);
  res.status(201).json(created);
});

router.put("/:id", (req, res) => {
  const db = readDb();
  const idx = db.employees.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Employee not found" });

  const current = db.employees[idx];
  const { name, email, department } = req.body || {};
  const updated = {
    ...current,
    name: name ?? current.name,
    email: email ?? current.email,
    department: department ?? current.department,
    updatedAt: new Date().toISOString()
  };

  const dupe = db.employees.some(e => e.id !== current.id && e.email.toLowerCase() === String(updated.email).toLowerCase());
  if (dupe) return res.status(409).json({ error: "another employee already uses this email" });

  db.employees[idx] = updated;
  writeDb(db);
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  const db = readDb();
  const before = db.employees.length;
  db.employees = db.employees.filter(e => e.id !== req.params.id);
  if (db.employees.length === before) return res.status(404).json({ error: "Employee not found" });
  writeDb(db);
  res.status(204).send();
});

module.exports = router;
