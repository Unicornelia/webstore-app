"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.getCheckoutSuccess = exports.getCheckout = exports.postCartDeleteItem = exports.postCart = exports.getCart = exports.getProductDetail = exports.getProducts = exports.getIndex = exports.createPaymentIntent = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const stripe_1 = __importDefault(require("stripe"));
dotenv_1.default.config();
const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new stripe_1.default(stripeSecret);
const getIndex = async (req, res) => {
    try {
        const products = await product_1.default.find();
        res
            .status(200)
            .json({ products, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in getIndex: ${e}`);
        res.status(500).json({ error: 'Failed to fetch products on index' });
    }
};
exports.getIndex = getIndex;
const getProducts = async (req, res) => {
    try {
        const products = await product_1.default.find();
        res
            .status(200)
            .json({ products, isAuthenticated: req.session.isAuthenticated });
        for (let item of products) {
            console.log(item);
        }
        for (let itemPos in products) {
            console.log(itemPos);
        }
    }
    catch (e) {
        console.error(`Error in getProducts: ${e}`);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getProducts = getProducts;
const getProductDetail = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await product_1.default.findById(productId);
        res
            .status(200)
            .json({ product, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in getProductDetail: ${e}`);
    }
};
exports.getProductDetail = getProductDetail;
const getCart = async (req, res) => {
    try {
        const { cart } = await req.user.populate('cart.items.product');
        const cartItems = cart.items;
        res
            .status(200)
            .json({ cartItems, isAuthenticated: req.session.isAuthenticated });
    }
    catch (err) {
        console.error(`Error in getCart: ${err}`);
    }
};
exports.getCart = getCart;
const postCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await product_1.default.findById(productId);
        const result = await req.user.addToCart(product);
        console.log(`Result in postCart: ${result}`);
        res
            .status(201)
            .json({ result, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in postCart: ${e}`);
    }
};
exports.postCart = postCart;
const postCartDeleteItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const result = await req.user.removeFromCart(productId);
        res
            .status(201)
            .json({ result, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in postCartDeleteItem: ${e}`);
    }
};
exports.postCartDeleteItem = postCartDeleteItem;
const getCheckout = async (req, res) => {
    try {
        const { cart } = await req.user.populate('cart.items.product');
        const checkoutItems = cart.items;
        let total = checkoutItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: checkoutItems.map((item) => ({
                price_data: {
                    currency: 'eur',
                    unit_amount: Math.round(item.product.price * 100),
                    product_data: {
                        name: item.product.title,
                        description: item.product.description,
                    },
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
        });
        res.status(200).json({
            checkoutItems,
            isAuthenticated: req.session.isAuthenticated,
            totalSum: total,
            stripeSessionID: stripeSession.id,
        });
    }
    catch (err) {
        console.error(`Error in getCheckout: ${err}`);
    }
};
exports.getCheckout = getCheckout;
const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    }
    catch (e) {
        console.error(`Error in createPaymentIntent: ${e}`);
        res.status(500).send({ error: e instanceof Error ? e.message : e });
    }
};
exports.createPaymentIntent = createPaymentIntent;
const getCheckoutSuccess = async (req, res) => {
    try {
        const { cart } = await req.user.populate('cart.items.product');
        const products = cart.items.map((item) => {
            return {
                quantity: item.quantity,
                product: { ...item.product._doc },
            };
        });
        const order = new order_1.default({
            user: {
                userId: req.user._id,
                name: req.user.name,
            },
            products,
        });
        await order.save();
        await req.user.clearCart();
        res
            .status(201)
            .json({ order, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in getCheckoutSuccess: ${e}`);
    }
};
exports.getCheckoutSuccess = getCheckoutSuccess;
const getOrders = async (req, res) => {
    try {
        const orders = await order_1.default.find({ 'user.userId': req.user._id });
        res
            .status(200)
            .json({ orders, isAuthenticated: req.session.isAuthenticated });
    }
    catch (e) {
        console.error(`Error in getOrders: ${e}`);
    }
};
exports.getOrders = getOrders;
