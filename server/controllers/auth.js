require('dotenv').config();
const User = require('../models/user');

getLogin = (req, res) => {
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
    `Error: ${e} in finding user with id: ${userId}`;
  }
};

postLogout = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (e) {
    console.log(`Error: ${e} in logging out.`);
  }
};

module.exports = { getLogin, postLogin, postLogout };