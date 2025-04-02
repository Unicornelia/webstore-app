"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoDB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const mongooseConnect = async (callback) => {
    try {
        const client = await mongoose_1.default.connect(mongoDB_URI);
        console.info(`Fetching database: ${client?.connections[0]?.db?.databaseName} 🛍️`);
        callback();
    }
    catch (err) {
        console.error(`Error in connecting to Mongoose: ${err}`);
        throw err;
    }
};
exports.default = mongooseConnect;
