require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./config/connection');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware to get access to the user in the whole app
// this is just registering for incoming requests
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // we add a new field to the req object, a seq object indeed
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(`Error in find user by id: 1 => ${err}`);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .authenticate()
  .then(() => console.log('🔌Connection has been established successfully.'))
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Admin', email: 'admin@email.com' });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(PORT, () => {
      console.log(`Sever listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
