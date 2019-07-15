const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
    },
    async function(email, password, done) {
      const user = await User.findOne({email});

      if (!user) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      const isPasswordCorrect = await user.checkPassword(password);

      if (!isPasswordCorrect) {
        done(null, false, 'Невереный пароль');
        return;
      }

      done(null, user, '');
    }
);
