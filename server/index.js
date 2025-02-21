require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { styleText } = require('util');

// local DB and model import
const { mongoConnect } = require('./config/database');
const User = require('./models/user');

// Import Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve React Frontend
app.use(express.json());
const clientBuildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

app.use((req, res, next) => {
  const userId = '67b7462ab6569d1f8907d7be';
  User.findById(userId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(styleText('redBright', `Error: ${err} in finding user with id: ${userId}`));
    });
});

// Use Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Start Server with MongoDB
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(styleText('cyanBright', `📡 Server running on http://localhost:${PORT} 📡`));
  });
});
