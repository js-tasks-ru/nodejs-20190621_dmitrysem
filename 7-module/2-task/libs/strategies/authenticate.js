const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      return done(null, false, `Не указан email`);
    }

    let user = await User.findOne({email});

    if (!user) {
      user = new User({email, displayName});
      user = await user.save();
    }

    done(null, user);
  } catch (e) {
    done(e);
  }
};
