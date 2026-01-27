function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  const provided = req.header("x-api-key");

  if (!expected) {
    return res.status(500).json({ error: "Server misconfigured: API_KEY missing" });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized: invalid or missing API key" });
  }
  next();
}

module.exports = { requireApiKey };
