const express = require('express');
const { getLogin, getSignUp, postLogin, postLogout, postSignUp, getResetPassword } = require('../controllers/auth');
const router = express.Router();

router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.post('/login', postLogin);
router.post('/signup', postSignUp);
router.post('/logout', postLogout);
router.get('/reset', getResetPassword);

module.exports = router;