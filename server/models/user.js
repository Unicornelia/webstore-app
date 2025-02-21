const { getDb } = require('../config/database');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, id, cart) {
    this.name = name;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
    this.cart = cart;
  }

  save = async () => {
    const db = getDb();
    try {
      db.collection('users').insertOne(this);
    } catch (err) {
      console.error(`Error in creating new user: ${err}`);
    }
  };

  addToCart = async (product) => {
    const db = getDb();

    // const cartProduct = this.cart.items.findIndex((element) => {
    //   return element._id === product._id;
    // })

    const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  };

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
