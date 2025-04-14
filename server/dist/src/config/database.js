"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDB_URI = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.mongoDB_URI = process.env.MONGODB_URI;
const mongooseConnect = async (callback) => {
    try {
        if (exports.mongoDB_URI) {
            const client = await mongoose_1.default.connect(exports.mongoDB_URI);
            console.info(`Fetching database: ${client?.connections[0]?.db?.databaseName} 🛍️`);
            callback();
        }
    }
    catch (err) {
        console.error(`Error in connecting to Mongoose: ${err}`);
        throw err;
    }
};
exports.default = mongooseConnect;
