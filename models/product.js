const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json",
);

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    fs.readFile(p, "utf8", (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(p, "utf8", (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data));
    });
  }
};
