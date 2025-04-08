"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewPassword = exports.getNewPassword = exports.postResetPassword = exports.getResetPassword = exports.postLogout = exports.postSignUp = exports.postLogin = exports.getSignUp = exports.getLogin = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_sendgrid_transport_1 = __importDefault(require("nodemailer-sendgrid-transport"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
// Configure email transporter with error handling
const transporter = nodemailer_1.default.createTransport((0, nodemailer_sendgrid_transport_1.default)({
    auth: {
        api_key: process.env.SENDGRID_KEY || '',
    },
}));
// Helper function to send standardized responses
const sendResponse = (res, statusCode, data) => {
    return res.status(statusCode).json(data);
};
const getLogin = (req, res) => {
    try {
        return sendResponse(res, 200, {
            isAuthenticated: req.session.isAuthenticated || false,
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error in getLogin: ${e instanceof Error ? e.message : e}`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.getLogin = getLogin;
const getSignUp = async (req, res) => {
    try {
        return sendResponse(res, 200, {
            isAuthenticated: req.session.isAuthenticated || false,
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error in getSignUp: ${e instanceof Error ? e.message : e}`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.getSignUp = getSignUp;
const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = (await user_1.default.findOne({ email }));
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return sendResponse(res, 401, {
                success: false,
                message: 'Invalid email or password',
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (isMatch) {
            req.session.isAuthenticated = true;
            req.session.user = {
                ...user,
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
            };
            return req.session.save((err) => {
                if (err) {
                    console.error(`Error saving session: ${err}`);
                    return sendResponse(res, 500, { error: 'Session error' });
                }
                return sendResponse(res, 200, {
                    success: true,
                    redirectUrl: '/',
                });
            });
        }
        else {
            req.flash('error', 'Invalid password');
            return sendResponse(res, 401, {
                success: false,
                message: 'Invalid email or password',
            });
        }
    }
    catch (e) {
        console.error(`Error: ${e instanceof Error ? e.message : e} in finding user with email: ${email}`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.postLogin = postLogin;
const postSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    // Validation
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 422, {
            success: false,
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        // Check if user already exists
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 409, {
                success: false,
                message: 'Email already exists',
            });
        }
        // Hash password and create user
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            name,
            email,
            password: hashedPassword,
            cart: { items: [] },
        });
        await user.save();
        // Send welcome email
        try {
            await transporter.sendMail({
                to: email,
                subject: 'Sign up Successful',
                from: process.env.SENDER || '',
                html: '<h1>Sign up Successful!</h1><p>Thank you for registering with our service.</p>',
            });
        }
        catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Continue despite email error
        }
        return sendResponse(res, 201, {
            success: true,
            message: 'Account created successfully',
            redirectUrl: '/login',
        });
    }
    catch (e) {
        console.error(`Error during signup: ${e instanceof Error ? e.message : e}`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.postSignUp = postSignUp;
const postLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(`Error destroying session: ${err}`);
                return sendResponse(res, 500, { error: 'Failed to logout' });
            }
            return sendResponse(res, 200, {
                success: true,
                redirectUrl: '/',
            });
        });
    }
    catch (e) {
        console.error(`Error: ${e instanceof Error ? e.message : e} in logging out.`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.postLogout = postLogout;
const getResetPassword = async (req, res) => {
    try {
        return sendResponse(res, 200, {
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error: ${e instanceof Error ? e.message : e} in resetting password.`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.getResetPassword = getResetPassword;
const postResetPassword = async (req, res) => {
    try {
        const buffer = await new Promise((resolve, reject) => {
            crypto_1.default.randomBytes(32, (err, buffer) => {
                if (err)
                    reject(err);
                else
                    resolve(buffer);
            });
        });
        const token = buffer.toString('hex');
        const user = (await user_1.default.findOne({
            email: req.body.email,
        }));
        if (!user) {
            return sendResponse(res, 404, {
                success: false,
                message: 'No account with that email found.',
            });
        }
        // Set reset token with expiration (1 hour)
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + 3600000);
        await user.save();
        // Send password reset email
        try {
            await transporter.sendMail({
                to: req.body.email,
                from: process.env.SENDER || '',
                subject: 'Password Reset',
                html: `
          <p>You requested a password reset</p>
          <p>Click <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset/${token}">here</a> to set a new password</p>
          <p>This link is only valid for one hour!</p>
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            return sendResponse(res, 500, {
                success: false,
                message: 'Failed to send reset email',
            });
        }
        return sendResponse(res, 200, {
            success: true,
            message: 'Password reset instructions sent to your email',
        });
    }
    catch (e) {
        console.error(`Error in postResetPassword: ${e instanceof Error ? e.message : e}`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.postResetPassword = postResetPassword;
const getNewPassword = async (req, res) => {
    const token = req.params.token;
    try {
        const user = (await user_1.default.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        }));
        if (!user) {
            return sendResponse(res, 400, {
                success: false,
                message: 'Invalid or expired token',
            });
        }
        return sendResponse(res, 200, {
            userId: user._id.toString(),
            passwordToken: token,
            errorMessage: req.flash('error'),
        });
    }
    catch (e) {
        console.error(`Error: ${e instanceof Error ? e.message : e} in getNewPassword.`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.getNewPassword = getNewPassword;
const postNewPassword = async (req, res) => {
    const { password, userId, passwordToken } = req.body;
    try {
        const user = (await user_1.default.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId,
        }));
        if (!user) {
            return sendResponse(res, 400, {
                success: false,
                message: 'User not found or token expired',
            });
        }
        // Update password and clear reset token
        user.password = await bcryptjs_1.default.hash(password, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        // Send confirmation email
        try {
            await transporter.sendMail({
                to: user.email,
                from: process.env.SENDER || '',
                subject: 'Password Updated',
                html: `
          <p>Your password has been successfully updated!</p>
          <p>Click <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">here</a> to login.</p>
        `,
            });
        }
        catch (emailError) {
            console.error('Failed to send password update confirmation email:', emailError);
            // Continue despite email error
        }
        return sendResponse(res, 200, {
            success: true,
            message: 'Password updated successfully',
            redirectUrl: '/login',
        });
    }
    catch (e) {
        console.error(`Error: ${e instanceof Error ? e.message : e} in postNewPassword.`);
        return sendResponse(res, 500, { error: 'Server error' });
    }
};
exports.postNewPassword = postNewPassword;
