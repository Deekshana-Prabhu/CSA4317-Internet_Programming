/**
 * SHOPZONE - Localhost Development Web Server
 * Built with native Node.js (Zero external dependencies).
 * Serves the shopzone application at http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.jsp': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Default routes
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  } else if (!path.extname(reqUrl)) {
    // If request has no extension (e.g. /products or /cart)
    if (fs.existsSync(path.join(ROOT, reqUrl + '.html'))) {
      reqUrl = reqUrl + '.html';
    } else if (fs.existsSync(path.join(ROOT, reqUrl + '.jsp'))) {
      reqUrl = reqUrl + '.jsp';
    }
  }

  const filePath = path.join(ROOT, reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>404 - Page Not Found</h2>
          <p>The requested URL <code>${req.url}</code> was not found on this server.</p>
          <a href="/index.html" style="color: #3b82f6; text-decoration: underline;">Return to SHOPZONE Home</a>
        </div>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  SHOPZONE Web Server Running!`);
  console.log(`  Open in browser: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
