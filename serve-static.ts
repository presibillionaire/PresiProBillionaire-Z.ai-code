// Static file server for Vite built output
// Serves /home/z/my-project/dist on port 3000
const distDir = "/home/z/my-project/dist";
const fs = require("fs");
const path = require("path");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

require("http").createServer((req: any, res: any) => {
  let urlPath = req.url.split("?")[0]; // Remove query string
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(distDir, urlPath);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err: any, data: any) => {
    if (err) {
      // SPA fallback: serve index.html for unknown routes
      fs.readFile(path.join(distDir, "index.html"), (err2: any, indexData: any) => {
        if (err2) {
          res.writeHead(500);
          res.end("Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(indexData);
        }
      });
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    }
  });
}).listen(3000, "0.0.0.0", () => {
  console.log("Static server running on http://0.0.0.0:3000");
  console.log("Serving from: " + distDir);
});
