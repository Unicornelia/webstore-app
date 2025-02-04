const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json",
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, "utf8", (err, data) => {
    if (err) {
      console.log(`Error in reading from file: ${err}`);
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(`Error in writing to file: ${err}`);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
