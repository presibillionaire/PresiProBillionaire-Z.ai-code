const port = 3000;
const distDir = "./dist";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    if (path === "/") path = "/index.html";
    
    const filePath = `${distDir}${path}`;
    const file = Bun.file(filePath);
    const exists = await file.exists();
    
    if (!exists) {
      return new Response("Not Found", { status: 404 });
    }
    
    const ext = path.substring(path.lastIndexOf("."));
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    
    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  },
});

console.log(`Static server running on http://localhost:${port}`);
