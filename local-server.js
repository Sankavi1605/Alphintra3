const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4'
};

function send(res, statusCode, contentType, body) {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(body);
}

function resolveSafePath(urlPathname) {
  const decodedPath = decodeURIComponent(urlPathname);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const requestPath = normalizedPath === '/' ? '/index.html' : normalizedPath;
  const absolutePath = path.resolve(ROOT_DIR, `.${requestPath}`);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  let filePath = resolveSafePath(requestUrl.pathname);

  if (!filePath) {
    send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (!statErr && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        send(res, 404, 'text/plain; charset=utf-8', 'Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      send(res, 200, contentType, data);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Local server running at http://${HOST}:${PORT}/index.html`);
});

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: PORT=8010 npm run dev`);
    process.exit(1);
    return;
  }

  console.error(error);
  process.exit(1);
});
