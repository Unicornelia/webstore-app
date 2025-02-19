require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// DB import
const { mongoConnect } = require('./config/database');

const errorController = require('./controllers/error');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');

// Import Routes
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next();
});

// Use Routes
app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404Page);

// Start Server with MongoDB
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT} 📡`);
  });
});
