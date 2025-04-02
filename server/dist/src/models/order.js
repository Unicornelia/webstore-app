"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const orderSchema = new mongoose_1.default.Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    user: {
        name: { type: String, required: true },
        userId: { type: mongoose_2.Types.ObjectId, required: true, ref: 'User' },
    },
});
exports.default = mongoose_1.default.model('Order', orderSchema);
