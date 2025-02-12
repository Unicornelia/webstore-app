const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

db.execute('SELECT * FROM PRODUCTS')
  .then((result) => {
    console.log(result[1], 'result');
  })
  .catch((err) => {
    console.log(err, 'error');
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin/', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

app.listen(3000);
