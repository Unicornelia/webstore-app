require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

getLogin = (req, res) => {
  res.status(200).json({ isAuthenticated: false });
};

getSignUp = (req, res) => {
  res.status(200).json({ isAuthenticated: false });
};

postLogin = async (req, res) => {
  const userId = process.env.USER_ID;
  const user = await User.findById(userId);
  try {
    req.session.isAuthenticated = true;
    req.session.user = user;
    req.session.save(() => {
      res.redirect('/');
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