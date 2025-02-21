const { getDb } = require('../config/database');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    db.collection('users').insertOne(this)
      .then(result => console.info(result))
      .catch((err) => {
        console.error(`Error in creating new user: ${err}`);
      });
  }

  static async findById(id) {
    const db = getDb();
    try {
      return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
    } catch (err) {
      console.error(`Error in finding user with id: ${id} from DB: ${err}`);
    }
  }
}

module.exports = User;
