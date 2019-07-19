const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();

  const user = new User({email, displayName, verificationToken});
  await user.setPassword(password);

  try {
    await user.save();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
    return;
  }

  const mailOptions = {
    subject: '',
    to: email,
    template: 'confirmation',
    locals: {
      token: verificationToken,
    },
  };
  await sendMail(mailOptions);

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  if (!verificationToken) return next();

  const user = await User.findOneAndUpdate({verificationToken}, {$unset: {verificationToken}});

  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  ctx.body = {token: verificationToken};
};
