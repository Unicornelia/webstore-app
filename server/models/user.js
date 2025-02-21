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
    let newQuantity = 1;

    const cartProductIndex = this.cart.items.findIndex((item) => {
      return item.productId.toString() === product._id.toString();
    });

    const isItemAlreadyInCart = cartProductIndex >= 0;
    const updatedCartItems = [...this.cart.items];

    if (isItemAlreadyInCart) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
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
