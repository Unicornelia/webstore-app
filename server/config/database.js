const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const mongooseConnect = (callback) => {
  return mongoose.connect(process.env.MONGODB_URI, clientOptions)
    .then(client => {
      console.info(`Fetching database: ${client.connections[0].db.databaseName} 🛍️`);
      callback();
    })
    .catch(err => {
      console.error(`Error in connecting to Mongoose: ${err}`);
      throw err;
    });
};

module.exports = mongooseConnect;
