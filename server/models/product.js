const { getDb } = require('../config/database');

class Product {
  constructor(title, description, imageUrl, price) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
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
}

module.exports = Product;
