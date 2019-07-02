const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lastChunk = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    const splittedChunks = chunkStr.split(os.EOL);

    this.lastChunk += splittedChunks.shift();

    while (splittedChunks.length) {
      this.push(this.lastChunk);
      this.lastChunk = splittedChunks.shift();
    }

    callback();
  }

  _flush(callback) {
    this.push(this.lastChunk);
    callback();
  }
}

module.exports = LineSplitStream;
