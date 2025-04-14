import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const mongoDB_URI = process.env.MONGODB_URI;

const mongooseConnect = async (callback: { (): void; (): void }) => {
  try {
    if (mongoDB_URI) {
      const client = await mongoose.connect(mongoDB_URI);
      console.info(
        `Fetching database: ${client?.connections[0]?.db?.databaseName} 🛍️`
      );
      callback();
    }
  } catch (err) {
    console.error(`Error in connecting to Mongoose: ${err}`);
    throw err;
  }
};

export default mongooseConnect;
