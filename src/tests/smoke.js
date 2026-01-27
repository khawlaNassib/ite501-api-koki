/**
 * Minimal smoke test (no test framework). Run: npm test
 */
const http = require("http");

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || "changeme-ite501";

function req(path, cb) {
  const options = {
    hostname: "localhost",
    port,
    path,
    method: "GET",
    headers: { "x-api-key": apiKey }
  };
  const r = http.request(options, (res) => {
    let data = "";
    res.on("data", (d) => (data += d));
    res.on("end", () => cb(null, res.statusCode, data));
  });
  r.on("error", cb);
  r.end();
}

req("/api/students", (err, code, data) => {
  if (err) return console.error("Smoke test failed:", err);
  console.log("GET /api/students ->", code);
  console.log(data);
});
