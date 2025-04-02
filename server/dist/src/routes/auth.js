"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.get('/login', auth_1.getLogin);
router.get('/signup', auth_1.getSignUp);
router.post('/login', auth_1.postLogin);
router.post('/signup', (0, express_validator_1.check)('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
    if (value === 'test@test.com') {
        throw new Error('Email cannot be test@test.com');
    }
}), auth_1.postSignUp);
router.post('/logout', auth_1.postLogout);
router.get('/reset', auth_1.getResetPassword);
router.post('/reset', auth_1.postResetPassword);
router.get('/reset/:token', auth_1.getNewPassword);
router.post('/new-password', auth_1.postNewPassword);
exports.default = router;
