require('dotenv').config();
const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY,
  },
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
    res.json({ isAuthenticated: req.session.isAuthenticated, errorMessage: req.flash('error') });
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
      } else {
        req.flash('error', 'Invalid password!');
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
      html: '<h1>Sign up Successful!</h1>',
    });

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
    console.error(`Error: ${e} in resetting password.`);
  }
};

postResetPassword = async (req, res) => {
  crypto.randomBytes(32, async (e, buffer) => {
    if (e) {
      console.error(`Error: ${e} in postResetPassword`);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    try {
      if (!user) {
        req.flash('error', 'No account with that email found.');
        res.json({ errorMessage: req.flash('error') });
      } else {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        const result = await user.save();
        console.log(result);
        res.json({ email: result.email });
        await transporter.sendMail({
          to: req.body.email,
          from: process.env.SENDER,
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click <a href="http://localhost:3000/reset/${token}">here</a> to set a new password</p>
            <p>This link is only valid for an hour!</p>
          `,
        });
      }
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  });
};

getNewPassword = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
    }
    res.json({ errorMessage: req.flash('error'), userId: user._id.toString(), passwordToken: token });
  } catch (e) {
    console.error(`Error: ${e} in updating password.`);
  }
};

postNewPassword = async (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }, _id: userId });
    user.password = await bcrypt.hash(newPassword, 12);
    const result = await user.save();
    res.json({});
    await transporter.sendMail({
      to: user.email,
      from: process.env.SENDER,
      subject: 'Password updated',
      html: `
            <p>You have successfully updated your password!</p>
            <p>Click <a href="http://localhost:3000/login">here</a> to login.</p>
          `,
    });
  } catch (e) {
    console.error(`Error: ${e} in saving new password.`);
  }
};


module.exports = { getLogin, getSignUp, postLogin, postSignUp, postLogout, getResetPassword, postResetPassword, getNewPassword, postNewPassword };