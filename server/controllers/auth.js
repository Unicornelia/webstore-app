require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY,
  }
}));

getLogin = (req, res) => {
  try {
    res.json({ isAuthenticated: req.session.isAuthenticated, errorMessage: req.flash('error') });
  } catch (e) {
    console.error(`Error in getLogin: ${e}`);
  }
};

getSignUp = (req, res) => {
  try {
    res.json({ isAuthenticated: req.session.isAuthenticated,  errorMessage: req.flash('error') });
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
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password, (e, isMatch) => {
      if (isMatch) {
        req.session.isAuthenticated = true;
        req.session.user = user;
        return req.session.save((e) => {
          console.error(`Error: ${e}`);
          res.redirect('/');
        });
      }
      res.redirect('/login');
      if (e) {
        console.log(`Error in bcrypt compare: ${e}`);
        res.redirect('/');
      }
    });
  } catch (e) {
    console.error(`Error: ${e} in finding user with email: ${email}`);
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
      req.flash('error', 'Email already exists!');
      return res.redirect('/signup');
    }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name, email, password: hashedPassword, cart: { items: [] },
      });
      await user.save();
    res.redirect('/login');
    await transporter.sendMail({
        to: email,
        subject: 'Sign up',
        from: process.env.SENDER,
        html: '<h1>Sign up Successful!</h1>'
      })

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

getResetPassword = async (req, res) => {
  try {
    res.json({ errorMessage: req.flash('error') });
  } catch (e) {
    console.error(`Error in getPwReset: ${e}`);
  }
}

module.exports = { getLogin, getSignUp, postLogin, postSignUp, postLogout, getResetPassword };