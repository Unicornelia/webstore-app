import mongoose from 'mongoose';

const mongoDB_URI: string =
  process.env.MONGODB_URI || 'mongodb://localhost:27017';

const mongooseConnect = async (callback: { (): void; (): void }) => {
  try {
    const client = await mongoose.connect(mongoDB_URI);
    console.info(
      `Fetching database: ${client?.connections[0]?.db?.databaseName} 🛍️`
    );
    callback();
  } catch (err) {
    console.error(`Error in connecting to Mongoose: ${err}`);
    throw err;
  }
};

export default mongooseConnect;
