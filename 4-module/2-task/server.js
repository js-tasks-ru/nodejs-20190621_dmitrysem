const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');
const {pipeline} = require('stream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      postHandler(req, res, pathname, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function postHandler(req, res, pathname, filepath) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end();
    return;
  }

  let error = null;
  let isFileOpened = false;

  function errorHandler(err) {
    error = err || true;
    endStreams(limitStream, writeStream);
  }

  const limitStream = new LimitSizeStream({limit: 1000000});
  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
  req.on('aborted', errorHandler);
  limitStream.on('error', errorHandler);
  writeStream.on('error', (err) => {
    errorHandler(err);

    if (!isFileOpened) {
      writeStreamOpenErrorHandler(err, req, res);
    }
  });
  writeStream.on('open', () => isFileOpened = true);
  writeStream.on('close', () => writeStreamCloseHandler(error, req, res, filepath));

  req.pipe(limitStream).pipe(writeStream);
}

function writeStreamCloseHandler(err, req, res, filepath) {
  if (err) {
    fs.unlink(filepath, (err) => {});
    res.statusCode = err instanceof LimitExceededError ? 413 : 500;
    // TODO: workaround to fix error in test
    setTimeout(() => res.end(), 300);
    return;
  }

  res.statusCode = 201;
  res.end();
}

function writeStreamOpenErrorHandler(err, req, res) {
  res.statusCode = err.code === 'EEXIST' ? 409 : 500;
  res.end();
}

function endStreams(...args) {
  for (const stream of args) {
    stream.end();
  }
}

module.exports = server;
