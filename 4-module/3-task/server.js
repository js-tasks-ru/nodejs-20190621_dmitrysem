const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      deleteHandler(req, res, pathname, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function deleteHandler(req, res, pathname, filepath) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end();
    return;
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
    }

    res.end();
  });
}

module.exports = server;
