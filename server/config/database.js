const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const mongooseConnect = (callback) => {
  return mongoose.connect(process.env.MONGODB_URI, clientOptions)
    .then(client => {
      console.info('🔋Connected to the MongoDB_Client');
      callback();
    })
    .catch(err => {
      console.error(`Error in connecting to MongoDB: ${err}`);
      throw err;
    });
};

module.exports = mongooseConnect;
