const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      console.info('🔋Connected to the MongoDB_Client');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.error(`Error in connecting to MongoDB: ${err}`);
      throw err;
    });
};

const getDb = () => {
  console.log(_db, 'DB')
  if (_db) {
    return _db;
  } else {
    throw new Error('No DB found for MongoDB_Client.');
  }
};

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;