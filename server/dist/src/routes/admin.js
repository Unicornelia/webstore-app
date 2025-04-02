"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const admin_1 = require("../controllers/admin");
const is_auth_1 = require("../middleware/is-auth");
const router = (0, express_1.Router)();
router.get('/products', is_auth_1.isAuth, admin_1.getProducts);
router.get('/add-product', is_auth_1.isAuth, admin_1.getAddProduct);
router.post('/add-product', [
    (0, express_validator_1.body)('title').isString().isLength({ min: 3 }).trim(),
    (0, express_validator_1.body)('price').isFloat(),
    (0, express_validator_1.body)('description').isLength({ min: 4, max: 400 }).trim(),
], is_auth_1.isAuth, admin_1.postAddProduct);
router.get('/edit-product/:id', is_auth_1.isAuth, admin_1.getEditProduct);
router.post('/edit-product', [
    (0, express_validator_1.body)('title').isString().isLength({ min: 3 }).trim(),
    (0, express_validator_1.body)('price').isFloat(),
    (0, express_validator_1.body)('description').isLength({ min: 4, max: 400 }).trim(),
], is_auth_1.isAuth, admin_1.postEditProduct);
router.delete('/delete-product/:id', is_auth_1.isAuth, admin_1.deleteProduct);
exports.default = router;
