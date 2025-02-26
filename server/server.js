require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { styleText } = require('util');

// Import Config & Models
const mongooseConnect = require('./config/database');
const User = require('./models/user');

// Import Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middleware Setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Setup (for frontend communication)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allows cookies to be sent and received
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ✅ Attach User to Request (Middleware)
app.use(async (req, res, next) => {
  const userId = process.env.USER_ID;
  try {
    const user = await User.findById(userId);
    req.user = user;
    next();
  } catch (err) {
    console.error(styleText('redBright', `Error: ${err} in finding user with id: ${userId}`));
  }
});

// ✅ API Routes
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use(authRoutes);

// ✅ Serve React Frontend
const clientBuildPath = path.resolve(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Catch-all to serve React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ✅ Connect to Database and Start Server
mongooseConnect(() => {
  console.info(styleText('blueBright', `🔋 Connected to Mongoose 🔋`));

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
  });

  app.listen(PORT, () => {
    console.log(styleText('cyanBright', `📡 Server running on http://localhost:${PORT} 📡`));
  });
}).catch(err => console.log(err));
