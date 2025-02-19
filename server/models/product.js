const { getDb } = require('../config/database');

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db.collection('products').insertOne(this)
      .then(result => {
        console.log(result, '#result');
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
    }).catch(error => console.error(error));
  }
}

module.exports = Product;
