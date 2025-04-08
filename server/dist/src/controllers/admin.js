"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.postEditProduct = exports.getEditProduct = exports.postAddProduct = exports.getProducts = exports.getAddProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const getAddProduct = async (req, res) => {
    try {
        res
            .status(200)
            .json({ isAuthenticated: req.session.isAuthenticated, editing: false });
    }
    catch (e) {
        console.error(`Error in getAddProduct: ${e}`);
    }
};
exports.getAddProduct = getAddProduct;
const getProducts = async (req, res) => {
    try {
        const products = await product_1.default.find({ userId: req.user._id });
        res
            .status(200)
            .json({ products, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in fetching all products: ${e}`);
    }
};
exports.getProducts = getProducts;
const postAddProduct = async (req, res) => {
    try {
        const product = new product_1.default({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            description: req.body.description,
            userId: req.user._id,
        });
        const result = await product.save();
        res
            .status(201)
            .json({ result, isAuthenticated: req.session.isAuthenticated });
        console.info(`Added new product: ${result}`);
    }
    catch (e) {
        console.error(`Error in postAddProduct: ${e instanceof Error ? e.message : e}`);
    }
};
exports.postAddProduct = postAddProduct;
const getEditProduct = async (req, res) => {
    try {
        const editMode = req.query.editing;
        if (!editMode) {
            return res.redirect('/');
        }
        const { id } = req.params;
        const product = await product_1.default.findById(id);
        if (!product) {
            return res.redirect('/');
        }
        res
            .status(200)
            .json({ product, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in getEditProduct: ${e}`);
    }
};
exports.getEditProduct = getEditProduct;
const postEditProduct = async (req, res) => {
    try {
        const { id, title, imageUrl, price, description } = req.body;
        const product = await product_1.default.findById(id);
        if (product) {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            else {
                product.title = title;
                product.imageUrl = imageUrl;
                product.price = price;
                product.description = description;
                const result = await product.save();
                res
                    .status(201)
                    .json({ result, isAuthenticated: req.session.isAuthenticated });
                console.info(`Updated product: ${result}`);
            }
        }
    }
    catch (e) {
        console.error(`Error in updating product: ${e}`);
    }
};
exports.postEditProduct = postEditProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await product_1.default.deleteOne({ _id: req.body.productId, userId: req.user._id });
        console.log(`Product ${id} has been deleted`);
        res.status(201).json({ message: 'Product deleted successfully' });
    }
    catch (e) {
        console.error(`Error deleting product: ${e}`);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
