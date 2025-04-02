"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = (req, res, next) => {
    if (!req.session?.isAuthenticated) {
        return res.redirect(301, '/login');
    }
    next();
};
exports.isAuth = isAuth;
