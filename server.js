import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const ROOT = '.';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? '/index.html' : req.url);
  
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});