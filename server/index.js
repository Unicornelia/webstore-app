require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { styleText } = require('util');

// Import Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const mongooseConnect = require('./config/database');
const User = require('./models/user');

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
  const userId = process.env.USER_ID;
  User.findById(userId)
    .then(user => {
      // console.log(`User found: ${user}`);
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
app.use(authRoutes);

// Start Server and create user if none exists
mongooseConnect(() => {
  console.info(styleText('blueBright', `🔋 Connected to Mongoose 🔋 `));
  User.findOne().then(user => {
    if (!user) {
      const user = new User({
        name: 'Rosa',
        email: 'rosa@parks.com',
        cart: [],
      });

      user.save()
        .then(r => console.log(`User created: ${r}`))
        .catch(err => console.error(`Error in user save: ${err}`));
    }
  })
  app.listen(PORT, () => {
    console.log(styleText('cyanBright', `📡 Server running on http://localhost:${PORT} 📡`));
  });
}).catch(err => console.log(err));
