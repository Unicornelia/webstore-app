"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                product: {
                    type: mongoose_2.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
});
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((item) => {
        return item.product.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const isItemAlreadyInCart = cartProductIndex >= 0;
    const updatedCartItems = [...this.cart.items];
    if (isItemAlreadyInCart) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({ product: product._id, quantity: newQuantity });
    }
    this.cart = { items: updatedCartItems };
    return this.save();
};
userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter((item) => item.product.toString() !== productId.toString());
    return this.save();
};
userSchema.methods.clearCart = function (productId) {
    this.cart = { items: [] };
    return this.save();
};
exports.default = mongoose_1.default.model('User', userSchema);
