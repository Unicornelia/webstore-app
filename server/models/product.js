const getDb = require("../config/database");

class Product {
  constructor(title, description, imageUrl, price) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  save () {}
}


const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Product;
