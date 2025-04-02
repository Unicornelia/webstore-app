"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.getNewPassword = exports.postResetPassword = exports.getResetPassword = exports.postLogout = exports.postSignUp = exports.postLogin = exports.getSignUp = exports.getLogin = void 0;
require('dotenv').config();
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_sendgrid_transport_1 = __importDefault(require("nodemailer-sendgrid-transport"));
const express_validator_1 = require("express-validator");
const transporter = nodemailer_1.default.createTransport((0, nodemailer_sendgrid_transport_1.default)({
    auth: {
        api_key: process.env.SENDGRID_KEY,
    },
}));
const getLogin = (req, res) => {
    try {
        res.json({
            isAuthenticated: req.session.isAuthenticated,
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error in getLogin: ${e}`);
    }
};
exports.getLogin = getLogin;
const getSignUp = (req, res) => {
    try {
        res.json({
            isAuthenticated: req.session.isAuthenticated,
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error in getSignUp: ${e}`);
    }
};
exports.getSignUp = getSignUp;
const postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        bcryptjs_1.default.compare(password, user.password, (e, isMatch) => {
            if (isMatch) {
                req.session.isAuthenticated = true;
                req.session.user = user;
                return req.session.save((e) => {
                    console.error(`Error: ${e}`);
                    res.redirect('/');
                });
            }
            else {
                req.flash('error', 'Invalid password!');
            }
            res.redirect('/login');
            if (e) {
                console.log(`Error in bcrypt compare: ${e}`);
                res.redirect('/');
            }
        });
    }
    catch (e) {
        console.error(`Error: ${e} in finding user with email: ${email}`);
    }
};
exports.postLogin = postLogin;
const postSignUp = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors.array(), 'error array');
        return res.json({ errorMessage: errors.array()[0].msg });
    }
    try {
        const userDoc = await user_1.default.findOne({ email });
        if (userDoc) {
            req.flash('error', 'Email already exists!');
            return res.redirect('/signup');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            name,
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        await user.save();
        res.redirect('/login');
        await transporter.sendMail({
            to: email,
            subject: 'Sign up',
            from: process.env.SENDER,
            html: '<h1>Sign up Successful!</h1>',
        });
    }
    catch (e) {
        console.error(`Error during signup: ${e}`);
    }
};
exports.postSignUp = postSignUp;
const postLogout = (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    catch (e) {
        console.error(`Error: ${e} in logging out.`);
    }
};
exports.postLogout = postLogout;
const getResetPassword = async (req, res) => {
    try {
        res.json({ errorMessage: req.flash('error') });
    }
    catch (e) {
        console.error(`Error: ${e} in resetting password.`);
    }
};
exports.getResetPassword = getResetPassword;
const postResetPassword = async (req, res) => {
    crypto_1.default.randomBytes(32, async (e, buffer) => {
        if (e) {
            console.error(`Error: ${e} in postResetPassword`);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const user = await user_1.default.findOne({ email: req.body.email });
        try {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                res.json({ errorMessage: req.flash('error') });
            }
            else {
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
        }
        catch (e) {
            console.error(`Error: ${e}`);
        }
    });
};
exports.postResetPassword = postResetPassword;
const getNewPassword = async (req, res) => {
    const token = req.params.token;
    try {
        const user = await user_1.default.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
        }
        res.json({
            errorMessage: req.flash('error'),
            userId: user._id.toString(),
            passwordToken: token,
        });
    }
    catch (e) {
        console.error(`Error: ${e} in updating password.`);
    }
};
exports.getNewPassword = getNewPassword;
const postNewPassword = async (req, res) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    try {
        const user = await user_1.default.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId,
        });
        user.password = await bcryptjs_1.default.hash(newPassword, 12);
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
    }
    catch (e) {
        console.error(`Error: ${e} in saving new password.`);
    }
};
exports.postNewPassword = postNewPassword;
