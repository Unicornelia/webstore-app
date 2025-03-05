require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

getLogin = (req, res) => {
  try {
    res.json({ isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getLogin: ${e}`);
  }
};

getSignUp = (req, res) => {
  try {
    res.json({ isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getSignUp: ${e}`);
  }
};

postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password, (e, isMatch) => {
      if (isMatch) {
        console.log('The passwords are matching!');
        req.session.isAuthenticated = true;
        req.session.user = user;
        return req.session.save((e) => {
          console.log(e);
          res.redirect('/');
        });
      }
      if (e) {
        console.log(`Error in bcrypt compare: ${e}`);
        res.redirect('/');
      }
    });
  } catch (e) {
    console.error(`Error: ${e} in finding user with id: ${userId}`);
  }
};

postSignUp = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      console.info('User already exists!');
      return res.redirect('/signup');
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name, email, password: hashedPassword, cart: { items: [] },
      });

      await user.save();
      console.info('Sign up successful');
      res.redirect('/login');
    }
  } catch (e) {
    console.error(`Error during signup: ${e}`);
  }
};

postLogout = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (e) {
    console.error(`Error: ${e} in logging out.`);
  }
};

module.exports = { getLogin, getSignUp, postLogin, postSignUp, postLogout };