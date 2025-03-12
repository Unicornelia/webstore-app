const express = require('express');
const {
  getLogin,
  getSignUp,
  postLogin,
  postLogout,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');
const router = express.Router();

router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.post('/login', postLogin);
router.post('/signup', postSignUp);
router.post('/logout', postLogout);
router.get('/reset', getResetPassword);
router.post('/reset', postResetPassword);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = router;