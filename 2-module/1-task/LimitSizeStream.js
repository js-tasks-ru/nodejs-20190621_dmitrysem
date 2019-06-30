const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.availableSize = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const newAvailableSize = this.availableSize - chunk.length;

    if (newAvailableSize >= 0) {
      this.availableSize = newAvailableSize;
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
