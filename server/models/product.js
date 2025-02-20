const { getDb } = require('../config/database');
const mongodb = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

class Product {
  constructor(title, imageUrl, price, description, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = new ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOperation = db.collection('products').insertOne(this);
    }
    return dbOperation.then(result => {
      console.log(result, '#result');
      return result;
    })
      .catch((err) => {
        console.error(`Error in inserting One to DB: ${err}`);
      });
  }

  static fetchAll() {
    const db = getDb();
    // only use this if not too many otherwise paginate
    return db.collection('products').find().toArray().then(products => {
      return products;
    }).catch(err => console.error(`Error in fetching all products from DB: ${err}`));
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(id) }).next().then(product => {
      return product;
    }).catch(err => console.error(`Error in one product with id: ${id} from DB: ${err}`));
  }
}

module.exports = Product;
