const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./config/connection');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();

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
      console.log(err);
    });
});

app.use('/admin/', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

Product.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  constraints: true,
});

User.hasMany(Product);

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Admin', email: 'admin@email.com' });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    console.log(user, '***User***');
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
