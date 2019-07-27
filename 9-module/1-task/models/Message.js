const mongoose = require('mongoose');
const connection = require('../libs/connection');

const schemaOptions = {
  toJSON: {
    versionKey: false,
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.chat;
      return ret;
    },
  },
};

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

}, schemaOptions);

module.exports = connection.model('Message', messageSchema);
