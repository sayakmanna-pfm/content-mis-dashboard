const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const ROOT = __dirname;

const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.csv':'text/csv' };

http.createServer((req, res) => {
  const file = path.join(ROOT, req.url === '/' ? 'Content Dashboard.html' : decodeURIComponent(req.url));
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Server ready on port ' + PORT));
