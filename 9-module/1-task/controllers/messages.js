const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const user = ctx.user;
  const messages = await Message.find({chat: user.id})
      .sort({date: -1})
      .limit(20);

  ctx.body = {messages};
};
