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
const { check } = require('express-validator');
const router = express.Router();

router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.post('/login', postLogin);
router.post(
  '/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('Email cannot be test@test.com');
      }
    }),
  postSignUp
);
router.post('/logout', postLogout);
router.get('/reset', getResetPassword);
router.post('/reset', postResetPassword);
router.get('/reset/:token', getNewPassword);
router.post('/new-password', postNewPassword);

module.exports = router;
